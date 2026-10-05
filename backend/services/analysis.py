import uuid
from datetime import datetime, timezone
from database import analyses_collection, claims_collection, sources_collection
from schemas import AnalysisResultSchema, ClaimSchema, SourceSchema
from services.ai import extract_claims_from_text, verify_claim_with_gemini
from services.retrieval import retrieve_evidence, rank_evidence

async def run_analysis_pipeline(input_text: str, input_type: str = "text", language: str = "English") -> AnalysisResultSchema:
    analysis_id = f"res_{uuid.uuid4().hex[:8]}"
    now_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    
    # 1. Extract claims
    extracted_claims_text = await extract_claims_from_text(input_text)
    
    claims = []
    all_sources = []
    
    overall_confidence_sum = 0
    verdict_counts = {"supported": 0, "contradicted": 0, "misleading": 0, "insufficient": 0}
    
    # 2 & 3 & 4. Process each claim (Retrieve, Rank, Verify)
    for claim_text in extracted_claims_text:
        claim_id = f"clm_{uuid.uuid4().hex[:8]}"
        
        # Retrieve & Rank
        raw_evidence = await retrieve_evidence(claim_text)
        ranked_evidence = rank_evidence(claim_text, raw_evidence, top_k=5)
        
        # Verify with Gemini
        verification = await verify_claim_with_gemini(claim_text, ranked_evidence, language)
        
        # Format sources
        claim_sources = []
        source_ids = []
        for ev in ranked_evidence:
            src_id = f"src_{uuid.uuid4().hex[:8]}"
            source_ids.append(src_id)
            source_obj = SourceSchema(
                id=src_id,
                title=ev.get("title", ""),
                publisher=ev.get("publisher", ""),
                publishedDate=ev.get("publishedDate", ""),
                snippet=ev.get("snippet", ""),
                url=ev.get("url", "")
            )
            claim_sources.append(source_obj)
            all_sources.append(source_obj)
            
            # Save source to DB
            await sources_collection.insert_one({
                "_id": src_id,
                "claimId": claim_id,
                "title": source_obj.title,
                "publisher": source_obj.publisher,
                "url": source_obj.url,
                "publishedAt": source_obj.publishedDate,
                "evidence": source_obj.snippet,
                "sourceType": ev.get("sourceType", "web")
            })
            
        verdict = verification.get("verdict", "insufficient")
        conf = verification.get("confidence", 0)
        
        claim_obj = ClaimSchema(
            id=claim_id,
            text=claim_text,
            verdict=verdict,
            confidence=conf,
            explanation=verification.get("explanation", ""),
            evidenceIds=source_ids
        )
        claims.append(claim_obj)
        
        # Save claim to DB
        await claims_collection.insert_one({
            "_id": claim_id,
            "analysisId": analysis_id,
            "claimText": claim_text,
            "verdict": verdict,
            "confidence": conf,
            "explanation": claim_obj.explanation
        })
        
        overall_confidence_sum += conf
        if verdict in verdict_counts:
            verdict_counts[verdict] += 1
            
    # Calculate overall verdict
    overall_verdict = "insufficient"
    if claims:
        overall_verdict = max(verdict_counts.keys(), key=lambda k: verdict_counts[k])
        overall_confidence = int(overall_confidence_sum / len(claims))
        if len(claims) == 1:
            overall_explanation = claims[0].explanation
        else:
            claim_points = "\n".join([f"• {c.text}: {c.explanation}" for c in claims])
            overall_explanation = f"Assessment: {overall_verdict.upper()} ({overall_confidence}% confidence based on {len(claims)} claims).\n\n{claim_points}"
    else:
        overall_confidence = 0
        overall_explanation = "No verifiable claims could be extracted from the content."
    
    # Create final result
    result = AnalysisResultSchema(
        id=analysis_id,
        inputType=input_type,
        inputPreview=input_text[:150] + ("..." if len(input_text) > 150 else ""),
        originalText=input_text,
        language=language,
        overallVerdict=overall_verdict,
        overallConfidence=overall_confidence,
        overallExplanation=overall_explanation,
        claims=claims,
        sources=all_sources,
        analyzedAt=now_str
    )
    
    # Save analysis to DB
    await analyses_collection.insert_one({
        "_id": analysis_id,
        "inputType": input_type,
        "originalText": input_text,
        "language": language,
        "overallVerdict": overall_verdict,
        "confidence": overall_confidence,
        "explanation": overall_explanation,
        "createdAt": datetime.fromisoformat(now_str.replace("Z", "+00:00"))
    })
    
    return result
