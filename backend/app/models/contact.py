from typing import Optional, TypedDict
from datetime import datetime, timezone
from bson import ObjectId

COLLECTION = "contacts"

class ContactDoc(TypedDict):
    _id: str
    user_id: str
    contact_id: str
    created_at: datetime

def create_contact_doc(user_id: str, contact_id: str) -> dict:
    """Creates a new contact relationship document."""
    return {
        "_id": str(ObjectId()),
        "user_id": str(user_id),
        "contact_id": str(contact_id),
        "created_at": datetime.now(timezone.utc)
    }
