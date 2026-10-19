import asyncio
import random
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.config import get_settings
from app.utils.security import hash_password
from app.models.user import COLLECTION as USERS_COL
from app.models.contact import COLLECTION as CONTACTS_COL, create_contact_doc

USERS = [
    {"username": "alice", "priority": 3, "display_name": "Alice Chen"},
    {"username": "bob", "priority": 5, "display_name": "Bob Smith"},
    {"username": "charlie", "priority": 7, "display_name": "Charlie Brown"},
    {"username": "diana", "priority": 9, "display_name": "Diana Prince"},
    {"username": "eve", "priority": 2, "display_name": "Eve Wilson"}
]

PALETTE = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF3", "#FFD433", "#FF338A"]

async def seed_users():
    settings = get_settings()
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    collection = db[USERS_COL]

    password_hash = hash_password("password123")
    
    for u in USERS:
        existing = await collection.find_one({"username": u["username"]})
        if not existing:
            user_doc = {
                "_id": str(ObjectId()),
                "username": u["username"],
                "email": f"{u['username']}@demo.local",
                "display_name": u["display_name"],
                "priority": u["priority"],
                "hashed_password": password_hash,
                "avatar_color": random.choice(PALETTE),
                "is_online": False,
                "last_seen": None,
                "created_at": datetime.now(timezone.utc)
            }
            await collection.insert_one(user_doc)
            print(f"Inserted user: {u['username']} (Priority {u['priority']})")
        else:
            print(f"User {u['username']} already exists, skipping.")
            
    # Backfill mutual contacts between all demo users
    contacts_col = db[CONTACTS_COL]
    all_demo_users = await collection.find({"username": {"$in": [u["username"] for u in USERS]}}).to_list(100)
    for u1 in all_demo_users:
        for u2 in all_demo_users:
            if u1["_id"] != u2["_id"]:
                existing_c = await contacts_col.find_one({"user_id": str(u1["_id"]), "contact_id": str(u2["_id"])})
                if not existing_c:
                    await contacts_col.insert_one(create_contact_doc(str(u1["_id"]), str(u2["_id"])))
                    print(f"Linked mutual contacts: {u1['username']} <-> {u2['username']}")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
