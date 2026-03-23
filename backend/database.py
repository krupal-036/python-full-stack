import os
from pymongo import MongoClient, errors
from dotenv import load_dotenv

load_dotenv()
try:
    MONGO_URI = os.environ.get("MONGO_URI")
    if not MONGO_URI:
        raise ValueError("MONGO_URI not found in environment variables")
        
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client['pythonDB']
    users_collection = db['users']
    users_collection.create_index("username", unique=True, sparse=True)
    users_collection.create_index("email", unique=True, sparse=True)
    client.admin.command('ping')

except Exception as e:
    print(f"Database Connection Error: {e}")
    users_collection = None
