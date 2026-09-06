"""
MongoDB connection and collection access layer.
"""

from django.conf import settings
from pymongo import MongoClient
from pymongo.database import Database
import logging

logger = logging.getLogger(__name__)

_mongo_client: MongoClient | None = None
_mongo_db: Database | None = None


def get_mongo_client() -> MongoClient:
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
            # Test connection
            _mongo_client.admin.command('ping')
            logger.info("Connected successfully to MongoDB at %s", settings.MONGODB_URI)
        except Exception as e:
            logger.error("Failed to connect to MongoDB: %s", e)
            raise e
    return _mongo_client


def get_db() -> Database:
    global _mongo_db
    if _mongo_db is None:
        client = get_mongo_client()
        _mongo_db = client[settings.MONGODB_DB_NAME]
    return _mongo_db


# Helper to convert MongoDB document _id to string id
def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    clean = dict(doc)
    if '_id' in clean:
        if 'id' not in clean:
            clean['id'] = str(clean['_id'])
        del clean['_id']
    return clean


def serialize_docs(docs) -> list[dict]:
    return [serialize_doc(doc) for doc in docs]
