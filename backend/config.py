from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    MONGODB_URI: str = "mongodb://localhost:27017"
    FACTCHECK_API_KEY: str = ""
    SEARCH_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
