from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ClaimSchema(BaseModel):
    id: str
    text: str
    verdict: str
    confidence: int
    explanation: str
    evidenceIds: List[str]

class SourceSchema(BaseModel):
    id: str
    title: str
    publisher: str
    publishedDate: str
    snippet: str
    url: str

class AnalysisResultSchema(BaseModel):
    id: str
    inputType: str
    inputPreview: str
    originalText: str = ""
    language: str = "English"
    overallVerdict: str
    overallConfidence: int
    overallExplanation: str
    claims: List[ClaimSchema]
    sources: List[SourceSchema]
    analyzedAt: str

# Request schemas
class AnalyzeTextRequest(BaseModel):
    text: str
    language: str = "English"

class AnalyzeUrlRequest(BaseModel):
    url: str
    language: str = "English"

# DB schemas
class DBAnalysis(BaseModel):
    id: str = Field(alias="_id")
    inputType: str
    originalText: str
    language: str
    overallVerdict: str
    confidence: int
    explanation: str
    createdAt: datetime

class DBClaim(BaseModel):
    id: str = Field(alias="_id")
    analysisId: str
    claimText: str
    verdict: str
    confidence: int
    explanation: str

class DBSource(BaseModel):
    id: str = Field(alias="_id")
    claimId: str
    title: str
    publisher: str
    url: str
    publishedAt: str
    evidence: str
    sourceType: str
