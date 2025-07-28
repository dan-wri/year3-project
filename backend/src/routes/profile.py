from fastapi import APIRouter, Request, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database.db import get_user_profile, update_user_profile
from ..database.models import get_db
from ..utils import authenticate_and_get_user_details

router = APIRouter()


class ProfileUpdate(BaseModel):
    avatar_url: str | None = None
    age: int | None = None
    gender: str | None = None
    bio: str | None = None
    xp: int | None = None


@router.get("/profile")
async def get_profile(request: Request, db: Session = Depends(get_db)):
    user = authenticate_and_get_user_details(request)
    user_id = user["user_id"]

    profile = get_user_profile(db, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "clerk_user_id": profile.clerk_user_id,
        "avatar_url": profile.avatar_url,
        "age": profile.age,
        "gender": profile.gender,
        "bio": profile.bio,
        "xp": profile.xp
    }


@router.post("/profile")
async def update_profile(data: ProfileUpdate, request: Request, db: Session = Depends(get_db)):
    user = authenticate_and_get_user_details(request)
    user_id = user["user_id"]

    updated = update_user_profile(db, user_id, data.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {"status": "updated"}
