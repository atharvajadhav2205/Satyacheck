import io
from fastapi import UploadFile
from bs4 import BeautifulSoup
import httpx

async def extract_text_from_image(file_bytes: bytes) -> str:
    # 1. Primary: Use Gemini Vision (multimodal) - works out-of-the-box on Windows without tesseract.exe
    try:
        from PIL import Image
        import google.generativeai as genai
        from services.ai import CANDIDATE_MODELS
        
        img = Image.open(io.BytesIO(file_bytes))
        prompt = "Extract and transcribe all readable text, headlines, captions, and claims from this image exactly as written. If there is no text, concisely describe the visual claims. Return only the extracted text without commentary."
        
        for model_name in CANDIDATE_MODELS:
            try:
                m = genai.GenerativeModel(model_name)
                res = m.generate_content([prompt, img])
                text = res.text.strip()
                if text:
                    return text
            except Exception as e:
                print(f"Gemini vision model {model_name} failed: {e}")
                continue
    except Exception as e:
        print(f"Gemini vision extraction error: {e}")
        
    # 2. Fallback: Tesseract OCR (if installed on system)
    try:
        from PIL import Image
        import pytesseract
        img = Image.open(io.BytesIO(file_bytes))
        text = str(pytesseract.image_to_string(img)).strip()
        if text:
            return text
    except Exception as e:
        print(f"Tesseract OCR fallback failed: {e}")
        
    raise ValueError("Could not extract any readable text or claims from the uploaded image. Please ensure the image contains clear, readable text.")

async def extract_text_from_audio(file_bytes: bytes, filename: str) -> str:
    # 1. Primary: Use Gemini native audio transcription (0 local RAM, no faster-whisper / ctranslate2)
    try:
        import os
        from services.ai import CANDIDATE_MODELS
        import google.generativeai as genai
        
        ext = (os.path.splitext(filename)[1] or ".mp3").lower().replace(".", "")
        mime_map = {
            "mp3": "audio/mp3",
            "wav": "audio/wav",
            "m4a": "audio/m4a",
            "ogg": "audio/ogg",
            "aac": "audio/aac",
            "flac": "audio/flac"
        }
        mime_type = mime_map.get(ext, "audio/mp3")
        
        prompt = "Transcribe all spoken text, statements, and claims in this audio recording accurately. Do not add commentary or opinion."
        for model_name in CANDIDATE_MODELS:
            try:
                m = genai.GenerativeModel(model_name)
                res = m.generate_content([
                    prompt,
                    {"mime_type": mime_type, "data": file_bytes}
                ])
                text = res.text.strip()
                if text:
                    return text
            except Exception as e:
                print(f"Gemini audio transcription on {model_name} failed: {e}")
                continue
    except Exception as e:
        print(f"Audio transcription error: {e}")
        
    raise ValueError("Could not transcribe any clear speech or claims from the uploaded audio file.")

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import pymupdf as fitz
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += str(page.get_text())
        return text if text.strip() else "No readable text found in PDF."
    except Exception as e:
        print(f"PyMuPDF Error: {e}")
        return "Failed to extract text from PDF."

async def extract_text_from_url(url: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10.0)
            soup = BeautifulSoup(resp.content, "lxml")
            
            # Remove scripts and styles
            for script in soup(["script", "style"]):
                script.extract()
                
            text = soup.get_text(separator=' ')
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            return text if text.strip() else "No readable content found at URL."
    except Exception as e:
        print(f"URL Extraction Error: {e}")
        return "Failed to fetch or parse URL content."

async def process_file(file: UploadFile, file_type: str) -> str:
    file_bytes = await file.read()
    if file_type == "image":
        return await extract_text_from_image(file_bytes)
    elif file_type == "audio":
        filename = file.filename or "audio.tmp"
        return await extract_text_from_audio(file_bytes, filename)
    elif file_type == "pdf":
        return await extract_text_from_pdf(file_bytes)
    else:
        return "Unsupported file type."
