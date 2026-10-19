from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from loguru import logger
from app.schemas.auth_schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.user_service import create_user, authenticate_user, get_user_by_username, get_all_users
from app.services.avatar_service import process_and_save_avatar, delete_avatar_file
from app.utils.security import create_jwt_token, decode_jwt_token
from app.db.mongodb import get_database

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Dependency to get the current authenticated user from JWT Bearer token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_jwt_token(token)
    if payload is None:
        raise credentials_exception
        
    username: str = payload.get("username")
    if username is None:
        raise credentials_exception
        
    db = get_database()
    user = await get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
        
    return user

@router.post("/register", response_model=TokenResponse)
async def register(register_data: RegisterRequest):
    db = get_database()
    
    # Check if username exists
    existing_user = await get_user_by_username(db, register_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
        
    # Create user
    user = await create_user(db, register_data)
    logger.info(f"New user registered: {user['username']}")
    
    # Generate token — use _id as user_id
    token = create_jwt_token(user_id=str(user["_id"]), username=user["username"])
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    db = get_database()
    
    user = await authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Generate token — use _id as user_id
    token = create_jwt_token(user_id=str(user["_id"]), username=user["username"])
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return _user_to_response(current_user)

@router.post("/me/avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Accepts multipart image upload, sanitizes/crops to 512x512 WebP,
    updates user profile avatar_url, and cleans up any old avatar.
    """
    content = await file.read()
    new_avatar_url = process_and_save_avatar(str(current_user["_id"]), content)

    db = get_database()
    # Remove previous custom avatar if present
    old_avatar = current_user.get("avatar_url")
    if old_avatar and old_avatar != new_avatar_url:
        delete_avatar_file(old_avatar)

    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"avatar_url": new_avatar_url}}
    )
    logger.info(f"Updated avatar for user {current_user['username']} -> {new_avatar_url}")
    return {"avatar_url": new_avatar_url}

@router.delete("/me/avatar")
async def delete_user_avatar(current_user: dict = Depends(get_current_user)):
    """
    Deletes the current user's avatar image file and resets avatar_url to null.
    """
    old_avatar = current_user.get("avatar_url")
    if old_avatar:
        delete_avatar_file(old_avatar)

    db = get_database()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"avatar_url": None}}
    )
    logger.info(f"Reset avatar for user {current_user['username']} to null")
    return {"avatar_url": None}

@router.get("/users", response_model=list[UserResponse])
async def read_all_users(current_user: dict = Depends(get_current_user)):
    db = get_database()
    users = await get_all_users(db, exclude_id=str(current_user["_id"]))
    return [_user_to_response(u) for u in users]

def _user_to_response(user: dict) -> dict:
    """Maps a MongoDB user doc to UserResponse schema."""
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user.get("email", ""),
        "display_name": user.get("display_name", user["username"]),
        "avatar_color": user.get("avatar_color", "#3357FF"),
        "avatar_url": user.get("avatar_url", None),
        "priority": user.get("priority", 5),
        "is_online": user.get("is_online", False),
        "last_seen": user.get("last_seen"),
        "created_at": user.get("created_at"),
    }
