from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel  # pylint: disable=no-name-in-module
from sqlalchemy.orm import Session
from ..database.db import (get_challenge_quota,
                           create_challenge_quota, reset_quota_if_needed, get_user_rewrites, create_rewrite)

from ..ai_generator import improve_text_with_ai
from ..utils import authenticate_and_get_user_details
from ..database.models import get_db
import json
from datetime import datetime

router = APIRouter()


class ImproveTextRequest(BaseModel):
    text: str
    type: str

    class Config:
        json_schema_extra = {"example": {
            "text": "Please rewrite this text more professionally.",
            "type": "Email"
        }}


@router.post("/improve-text")
async def improve_text(request: ImproveTextRequest, request_obj: Request, db: Session = Depends(get_db)):
    try:
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")

        quota = get_challenge_quota(db, user_id)
        if not quota:
            create_challenge_quota(db, user_id)

        quota = reset_quota_if_needed(db, quota)

        if quota.quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="Quota exhausted")

        improved = improve_text_with_ai(request.text, request.type)

        new_rewrite = create_rewrite(
            db=db,
            original_text=request.text,
            improved_text=improved,
            created_by=user_id,
            rewrite_type=request.type
        )

        quota.quota_remaining -= 1
        db.commit()

        return {
            "id": new_rewrite.id,
            "original_text": new_rewrite.original_text,
            "improved_text": new_rewrite.improved_text,
            "type": new_rewrite.type,
            "timestamp": new_rewrite.date_created.isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/write-history")
async def write_history(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")

    rewrites = get_user_rewrites(db, user_id)
    return {"rewrites": rewrites}
