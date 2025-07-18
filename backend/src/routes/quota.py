from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database.db import get_challenge_quota, reset_quota_if_needed
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db

router = APIRouter()


@router.get("/quota")
async def get_quota(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    quota = get_challenge_quota(db, user_id)
    if not quota:
        return {
            "user_id": user_id,
            "quota_remaining": 0,
            "last_reset_date": datetime.now(timezone.utc)
        }

    quota = reset_quota_if_needed(db, quota)
    return quota
