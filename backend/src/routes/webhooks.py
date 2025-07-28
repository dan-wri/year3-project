from fastapi import APIRouter, Request, HTTPException, Depends
from ..database.db import create_challenge_quota, create_user_profile
from ..database.models import get_db, ChallengeQuota, Challenge
from svix.webhooks import Webhook
import os
import json

router = APIRouter()


@router.post("/clerk")
async def handle_user_created(request: Request, db=Depends(get_db)):
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")

    if not webhook_secret:
        raise HTTPException(
            status_code=500, detail="CLERK_WEBHOOK_SECRET not set")

    body = await request.body()
    payload = body.decode("utf-8")
    headers = dict(request.headers)

    try:
        wh = Webhook(webhook_secret)
        wh.verify(payload, headers)

        data = json.loads(payload)
        event_type = data.get("type")
        user_data = data.get("data", {})
        user_id = user_data.get("id")

        if event_type == "user.created":
            create_challenge_quota(db, user_id)
            create_user_profile(db, user_id)

        elif event_type == "user.deleted":
            quota = db.query(ChallengeQuota).filter_by(user_id=user_id).first()
            if quota:
                db.delete(quota)

            challenges = db.query(Challenge).filter_by(
                created_by=user_id).all()
            for challenge in challenges:
                db.delete(challenge)

            db.commit()

        else:
            return {"status": "ignored"}

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
