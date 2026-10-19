import re
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from loguru import logger

from app.db.mongodb import get_database
from app.api.routes_auth import get_current_user
from app.models.contact import COLLECTION as CONTACTS_COL, create_contact_doc
from app.models.user import COLLECTION as USERS_COL

router = APIRouter(tags=["contacts"])

class AddContactRequest(BaseModel):
    username: Optional[str] = None
    contact_id: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    username: str
    email: str = ""
    display_name: str
    avatar_color: str = "#3357FF"
    avatar_url: Optional[str] = None
    priority: int = 5
    is_online: bool = False
    last_seen: Optional[datetime] = None
    created_at: Optional[datetime] = None
    is_contact: bool = True
    contact_added_at: Optional[datetime] = None

class UserSearchResult(BaseModel):
    id: str
    username: str
    display_name: str
    avatar_color: str = "#3357FF"
    avatar_url: Optional[str] = None
    is_contact: bool = False

@router.get("/contacts", response_model=List[ContactResponse])
async def list_contacts(current_user: dict = Depends(get_current_user)):
    """
    Returns user's manual contacts merged with any active message thread participants.
    Non-contacts appearing from incoming messages carry is_contact: False.
    """
    db = get_database()
    current_uid = str(current_user["_id"])

    # 1. Fetch all manual contacts
    contact_docs = await db[CONTACTS_COL].find({"user_id": current_uid}).to_list(length=1000)
    contact_map = {c["contact_id"]: c.get("created_at") for c in contact_docs}
    
    # 2. Fetch all message thread partner IDs (incoming or outgoing)
    thread_partners = set(contact_map.keys())
    msg_cursor = db["messages"].find(
        {"$or": [{"sender_id": current_uid}, {"recipient_id": current_uid}]},
        {"sender_id": 1, "recipient_id": 1}
    ).limit(500)
    
    async for msg in msg_cursor:
        s_id = msg.get("sender_id")
        r_id = msg.get("recipient_id")
        if s_id and s_id != current_uid:
            thread_partners.add(s_id)
        if r_id and r_id != current_uid:
            thread_partners.add(r_id)

    if not thread_partners:
        return []

    # 3. Look up user details for all partners
    user_docs = await db[USERS_COL].find({"_id": {"$in": list(thread_partners)}}).to_list(length=1000)

    results = []
    for u in user_docs:
        uid = str(u["_id"])
        is_contact = uid in contact_map
        results.append(ContactResponse(
            id=uid,
            username=u["username"],
            email=u.get("email", ""),
            display_name=u.get("display_name", u["username"]),
            avatar_color=u.get("avatar_color", "#3357FF"),
            avatar_url=u.get("avatar_url", None),
            priority=u.get("priority", 5),
            is_online=u.get("is_online", False),
            last_seen=u.get("last_seen"),
            created_at=u.get("created_at"),
            is_contact=is_contact,
            contact_added_at=contact_map.get(uid)
        ))

    # Sort contacts first, then alphabetical by display name
    results.sort(key=lambda x: (not x.is_contact, x.display_name.lower()))
    return results

@router.post("/contacts", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def add_contact(req: AddContactRequest, current_user: dict = Depends(get_current_user)):
    """
    Adds a verified user to current user's manual contact list.
    """
    db = get_database()
    current_uid = str(current_user["_id"])

    target_user = None
    if req.contact_id:
        target_user = await db[USERS_COL].find_one({"_id": req.contact_id})
    elif req.username:
        target_user = await db[USERS_COL].find_one({"username": req.username.strip()})
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either username or contact_id must be provided"
        )

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    target_uid = str(target_user["_id"])
    if target_uid == current_uid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot add yourself as a contact"
        )

    # Check if already added
    existing = await db[CONTACTS_COL].find_one({"user_id": current_uid, "contact_id": target_uid})
    added_at = None
    if not existing:
        doc = create_contact_doc(current_uid, target_uid)
        await db[CONTACTS_COL].insert_one(doc)
        added_at = doc["created_at"]
        logger.info(f"User {current_user['username']} added contact {target_user['username']}")
    else:
        added_at = existing.get("created_at")

    return ContactResponse(
        id=target_uid,
        username=target_user["username"],
        email=target_user.get("email", ""),
        display_name=target_user.get("display_name", target_user["username"]),
        avatar_color=target_user.get("avatar_color", "#3357FF"),
        avatar_url=target_user.get("avatar_url", None),
        priority=target_user.get("priority", 5),
        is_online=target_user.get("is_online", False),
        last_seen=target_user.get("last_seen"),
        created_at=target_user.get("created_at"),
        is_contact=True,
        contact_added_at=added_at
    )

@router.delete("/contacts/{contact_id}")
async def remove_contact(contact_id: str, current_user: dict = Depends(get_current_user)):
    """
    Removes a contact relationship. Message history remains intact.
    """
    db = get_database()
    current_uid = str(current_user["_id"])

    result = await db[CONTACTS_COL].delete_one({"user_id": current_uid, "contact_id": str(contact_id)})
    logger.info(f"User {current_user['username']} removed contact {contact_id} (deleted: {result.deleted_count})")
    return {"status": "removed", "contact_id": contact_id}

@router.get("/users/search", response_model=List[UserSearchResult])
async def search_users(
    q: str = Query(..., min_length=1, description="Search query string"),
    current_user: dict = Depends(get_current_user)
):
    """
    Searches registered users by username or display name with debounce gating.
    Requires at least 3 characters to protect user privacy and avoid directory leakage.
    Returns maximum 5 results.
    """
    query_str = q.strip()
    if len(query_str) < 3:
        return []

    db = get_database()
    current_uid = str(current_user["_id"])

    # Fetch current user contacts to label existing contacts
    contact_docs = await db[CONTACTS_COL].find({"user_id": current_uid}).to_list(length=1000)
    contact_ids = {c["contact_id"] for c in contact_docs}

    escaped_q = re.escape(query_str)
    regex = {"$regex": escaped_q, "$options": "i"}
    filter_query = {
        "_id": {"$ne": current_uid},
        "$or": [
            {"username": regex},
            {"display_name": regex}
        ]
    }

    users = await db[USERS_COL].find(filter_query).limit(5).to_list(length=5)

    return [
        UserSearchResult(
            id=str(u["_id"]),
            username=u["username"],
            display_name=u.get("display_name", u["username"]),
            avatar_color=u.get("avatar_color", "#3357FF"),
            avatar_url=u.get("avatar_url", None),
            is_contact=str(u["_id"]) in contact_ids
        )
        for u in users
    ]
