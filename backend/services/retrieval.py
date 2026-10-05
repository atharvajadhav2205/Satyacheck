import httpx
from config import settings
import asyncio
from urllib.parse import urlparse

async def fetch_google_fact_check(claim: str) -> list[dict]:
    if not settings.FACTCHECK_API_KEY or settings.FACTCHECK_API_KEY.startswith("dummy") or settings.FACTCHECK_API_KEY.startswith("your_"):
        return []
    
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    results = []
    
    queries = [claim]
    words = claim.split()
    if len(words) > 7:
        queries.append(" ".join(words[:6]))
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for q in queries:
            try:
                response = await client.get(url, params={"query": q, "key": settings.FACTCHECK_API_KEY})
                if response.status_code == 200:
                    data = response.json()
                    for item in data.get("claims", []):
                        for review in item.get("claimReview", []):
                            publisher_info = review.get("publisher", {})
                            pub_name = publisher_info.get("name") or publisher_info.get("site") or "Verified Fact-Checker"
                            rating = review.get("textualRating", "Evaluated")
                            rev_title = review.get("title") or item.get("text", "")
                            item_text = item.get("text", "")
                            
                            results.append({
                                "title": rev_title,
                                "publisher": pub_name,
                                "url": review.get("url", ""),
                                "publishedDate": review.get("reviewDate", ""),
                                "snippet": f"Fact Check Rating: {rating}. Review: '{rev_title}'. Evaluated Claim: '{item_text}'.",
                                "sourceType": "fact_check"
                            })
                    if results:
                        break
            except Exception as e:
                print(f"FactCheck API Error on query '{q}': {e}")
                
    return results

async def fetch_tavily_search(claim: str) -> list[dict]:
    if not settings.SEARCH_API_KEY or settings.SEARCH_API_KEY.startswith("dummy") or settings.SEARCH_API_KEY.startswith("your_"):
        return []
    
    url = "https://api.tavily.com/search"
    results = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                url,
                json={
                    "api_key": settings.SEARCH_API_KEY,
                    "query": claim,
                    "search_depth": "basic",
                    "max_results": 5
                }
            )
            if response.status_code == 200:
                data = response.json()
                for item in data.get("results", []):
                    domain = urlparse(item.get("url", "")).netloc.replace("www.", "")
                    results.append({
                        "title": item.get("title", ""),
                        "publisher": domain or "Web Source",
                        "url": item.get("url", ""),
                        "publishedDate": item.get("published_date", "") or "",
                        "snippet": item.get("content", ""),
                        "sourceType": "web"
                    })
    except Exception as e:
        print(f"Tavily Search Error: {e}")
        
    return results

async def fetch_duckduckgo_search(claim: str) -> list[dict]:
    try:
        from duckduckgo_search import DDGS
        results = []
        with DDGS() as ddgs:
            ddg_results = ddgs.text(claim, max_results=5)
            for item in ddg_results:
                domain = urlparse(item.get("href", "")).netloc.replace("www.", "")
                results.append({
                    "title": item.get("title", ""),
                    "publisher": domain or "Web Result",
                    "url": item.get("href", ""),
                    "publishedDate": "",
                    "snippet": item.get("body", ""),
                    "sourceType": "web"
                })
        return results
    except Exception as e:
        print(f"DuckDuckGo Search Error: {e}")
        return []

async def retrieve_evidence(claim: str) -> list[dict]:
    fc_task = fetch_google_fact_check(claim)
    tavily_task = fetch_tavily_search(claim)
    
    fc_results, tavily_results = await asyncio.gather(fc_task, tavily_task, return_exceptions=True)
    
    all_evidence = []
    if isinstance(fc_results, list):
        all_evidence.extend(fc_results)
    if isinstance(tavily_results, list):
        all_evidence.extend(tavily_results)
        
    if not all_evidence:
        ddg_results = await fetch_duckduckgo_search(claim)
        all_evidence.extend(ddg_results)
        
    seen = set()
    deduped = []
    for ev in all_evidence:
        key = ev.get("url") or ev.get("title")
        if key and key not in seen:
            seen.add(key)
            deduped.append(ev)
            
    return deduped

def rank_evidence(claim: str, evidence: list[dict], top_k: int = 5) -> list[dict]:
    if not evidence:
        return []
    
    if len(evidence) <= top_k:
        return evidence
    
    claim_words = set(w.lower() for w in claim.split() if len(w) > 3)
    
    def score_item(item: dict) -> float:
        score = 0.0
        # Priority 1: Verified Fact-Check database reviews (Snopes, PolitiFact, etc.)
        if item.get("sourceType") == "fact_check":
            score += 10.0
        # Priority 2: Keyword overlap density with the claim
        text = f"{item.get('title', '')} {item.get('snippet', '')}".lower()
        if claim_words:
            overlap = sum(1 for w in claim_words if w in text)
            score += (overlap / len(claim_words)) * 5.0
        return score
        
    sorted_evidence = sorted(evidence, key=score_item, reverse=True)
    return sorted_evidence[:top_k]
