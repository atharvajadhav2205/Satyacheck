from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from schemas import AnalyzeTextRequest, AnalyzeUrlRequest, AnalysisResultSchema
from services.analysis import run_analysis_pipeline
from database import analyses_collection
import uvicorn
from typing import List

app = FastAPI(title="SatyaCheck - API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/api/health", methods=["GET", "HEAD"])
async def health_check():
    return {"status": "ok"}

from services.file_processing import process_file

@app.post("/api/analyze/text", response_model=AnalysisResultSchema)
async def analyze_text(request: AnalyzeTextRequest):
    try:
        return await run_analysis_pipeline(request.text, "text", request.language)
    except Exception as e:
        print(f"Error in analyze_text: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

@app.post("/api/analyze/url", response_model=AnalysisResultSchema)
async def analyze_url(request: AnalyzeUrlRequest):
    from services.file_processing import extract_text_from_url
    try:
        content = await extract_text_from_url(request.url)
        return await run_analysis_pipeline(content, "url", request.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/{file_type}", response_model=AnalysisResultSchema)
async def analyze_file(file_type: str, language: str = Form("English"), file: UploadFile = File(...)):
    if file_type not in ["image", "audio", "pdf"]:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    try:
        extracted_text = await process_file(file, file_type)
        if not extracted_text or extracted_text.strip().lower().startswith("no readable text"):
            raise HTTPException(status_code=400, detail="No readable text or claims could be found in the uploaded file.")
        return await run_analysis_pipeline(extracted_text, file_type, language)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from database import analyses_collection, claims_collection, sources_collection

@app.get("/api/analysis/{analysis_id}", response_model=AnalysisResultSchema)
async def get_analysis(analysis_id: str):
    doc = await analyses_collection.find_one({"_id": analysis_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    claims_cursor = claims_collection.find({"analysisId": analysis_id})
    claims = []
    all_sources = []
    
    async for c_doc in claims_cursor:
        sources_cursor = sources_collection.find({"claimId": c_doc["_id"]})
        source_ids = []
        async for s_doc in sources_cursor:
            source_ids.append(s_doc["_id"])
            source_obj = {
                "id": s_doc["_id"],
                "title": s_doc.get("title", ""),
                "publisher": s_doc.get("publisher", ""),
                "publishedDate": s_doc.get("publishedAt", ""),
                "snippet": s_doc.get("evidence", ""),
                "url": s_doc.get("url", "")
            }
            all_sources.append(source_obj)
            
        claims.append({
            "id": c_doc["_id"],
            "text": c_doc.get("claimText", ""),
            "verdict": c_doc.get("verdict", ""),
            "confidence": c_doc.get("confidence", 0),
            "explanation": c_doc.get("explanation", ""),
            "evidenceIds": source_ids
        })
        
    return {
        "id": doc["_id"],
        "inputType": doc.get("inputType", "text"),
        "inputPreview": doc.get("originalText", "")[:150],
        "overallVerdict": doc.get("overallVerdict", "insufficient"),
        "overallConfidence": doc.get("confidence", 0),
        "overallExplanation": doc.get("explanation", ""),
        "claims": claims,
        "sources": all_sources,
        "analyzedAt": doc["createdAt"].isoformat() + "Z"
    }

@app.get("/api/history")
async def get_history():
    cursor = analyses_collection.find().sort("createdAt", -1).limit(20)
    history = []
    async for doc in cursor:
        history.append({
            "id": doc["_id"],
            "date": doc["createdAt"].isoformat(),
            "inputType": doc["inputType"],
            "shortClaim": doc.get("originalText", "")[:50] + "...",
            "verdict": doc["overallVerdict"],
            "confidence": doc["confidence"]
        })
    return history

@app.delete("/api/analysis/{analysis_id}")
async def delete_analysis(analysis_id: str):
    doc = await analyses_collection.find_one({"_id": analysis_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Find all claims for this analysis, then delete their sources
    claims_cursor = claims_collection.find({"analysisId": analysis_id})
    async for c_doc in claims_cursor:
        await sources_collection.delete_many({"claimId": c_doc["_id"]})
    
    # Delete claims and the analysis itself
    await claims_collection.delete_many({"analysisId": analysis_id})
    await analyses_collection.delete_one({"_id": analysis_id})
    
    return {"status": "deleted", "id": analysis_id}

@app.delete("/api/history")
async def clear_all_history():
    await sources_collection.delete_many({})
    await claims_collection.delete_many({})
    await analyses_collection.delete_many({})
    return {"status": "cleared"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
