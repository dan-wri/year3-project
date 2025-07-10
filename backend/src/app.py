from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import challenge, webhooks, rewriter, quota

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(challenge.router, prefix="/api")
app.include_router(webhooks.router, prefix="/webhooks")
app.include_router(rewriter.router, prefix="/api")
app.include_router(quota.router, prefix="/api")
