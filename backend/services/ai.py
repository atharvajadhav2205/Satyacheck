import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from datetime import datetime, timezone

import google.generativeai as genai
from config import settings
import json
import typing_extensions as typing

genai.configure(api_key=settings.GEMINI_API_KEY)

# List of models to try in order of preference/quota availability
CANDIDATE_MODELS = [
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash-lite-preview",
    "gemini-3.8-flash"
]

model = genai.GenerativeModel(CANDIDATE_MODELS[0])

class ExtractedClaim(typing.TypedDict):
    claimText: str

class ExtractedClaimsList(typing.TypedDict):
    claims: list[ExtractedClaim]

class VerificationResult(typing.TypedDict):
    verdict: str
    confidence: int
    explanation: str

def generate_with_fallback(prompt: str, schema):
    last_err: Exception | None = None
    for model_name in CANDIDATE_MODELS:
        try:
            m = genai.GenerativeModel(model_name)
            response = m.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=schema
                )
            )
            return json.loads(response.text)
        except Exception as e:
            last_err = e
            print(f"Model {model_name} failed: {e}. Trying next fallback...")
            continue
    if last_err:
        raise last_err
    raise RuntimeError("All candidate Gemini models failed to generate content.")

async def extract_claims_from_text(text: str) -> list[str]:
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.startswith("dummy"):
        return ["Dummy claim extracted from text."]
    
    prompt = f"""
    Extract key factual, verifiable claims from the following text. Ignore purely subjective opinions.
    Text:
    {text}
    """
    try:
        data = generate_with_fallback(prompt, ExtractedClaimsList)
        claims = [item['claimText'] for item in data.get('claims', []) if item.get('claimText')]
        return claims if claims else [text[:200]]
    except Exception as e:
        print(f"Error extracting claims with Gemini: {e}")
        # Graceful fallback: return the input text as the single claim
        return [text.strip()[:250]]

async def verify_claim_with_gemini(claim: str, evidence: list[dict], language: str = "English") -> dict:
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY.startswith("dummy"):
        return {
            "verdict": "insufficient",
            "confidence": 0,
            "explanation": "Please set a valid GEMINI_API_KEY in the backend .env to run real analysis."
        }
    
    if not evidence:
        return {
            "verdict": "insufficient",
            "confidence": 30,
            "explanation": f"No authoritative evidence or fact-checks could be found for this claim at this time."
        }
        
    evidence_text = "\n\n".join([
        f"Source {i+1} [{e.get('sourceType', 'web').upper()}]: {e.get('publisher', 'Unknown')} - Title: '{e.get('title', '')}'\nPublished Date: {e.get('publishedDate', 'Unknown')}\nEvidence/Snippet: {e.get('snippet', '')}"
        for i, e in enumerate(evidence)
    ])
    
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    prompt = f"""
    You are an expert fact-checker evaluating an online forward or claim.
    
    TODAY'S DATE: {today_str}
    
    Claim to Verify:
    "{claim}"
    
    Retrieved Evidence from Fact-Checkers and Verified Web Sources:
    {evidence_text}
    
    Rules for Verdict:
    - 'contradicted': The evidence explicitly debunks, refutes, or proves the claim is false, a hoax, or fabricated.
    - 'supported': Reliable evidence confirms that the claim is true and factually accurate.
    - 'misleading': The claim has a grain of truth, but is exaggerated, misattributed, lacks essential context, or misinterprets reality.
    - 'insufficient': The retrieved evidence does not contain sufficient direct information to verify or refute the claim.
    
    CRITICAL — Time-Sensitive Claims:
    - If the claim refers to a specific time frame like "today", "yesterday", "this week", "recently", or a specific date, you MUST check if the evidence dates actually match that time frame.
    - Today's date is {today_str}. Use this to judge recency.
    - If the evidence is about an old/past event and the claim says it happened "today" or recently, the evidence does NOT support the claim. Mark it as 'insufficient' or 'misleading' and explain that no recent evidence was found confirming this event on the claimed date.
    - Old news articles about similar past events do NOT count as evidence for a claim about a current event.
    - Do NOT confuse a past incident with a present-day claim. An article from 2023 about a sea link accident does not verify a claim that an accident happened today.
    
    Confidence:
    - Provide an integer confidence score from 0 to 100 representing how strongly the evidence supports your verdict.
    - If the claim is time-sensitive and none of the evidence matches the claimed time frame, confidence should be LOW (0-30) regardless of how relevant the topic seems.
    
    Language Requirement:
    - IMPORTANT: Write the 'explanation' field clearly and concisely in {language}.
    """
    
    try:
        return generate_with_fallback(prompt, VerificationResult)
    except Exception as e:
        print(f"Error verifying claim with Gemini: {e}")
        return {
            "verdict": "insufficient",
            "confidence": 0,
            "explanation": f"Verification failed due to an upstream model error: {str(e)[:120]}"
        }
