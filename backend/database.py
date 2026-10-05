import motor.motor_asyncio
from config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
db = client.factcheck_db

# Collections
analyses_collection = db.analyses
claims_collection = db.claims
sources_collection = db.sources
