# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router

app = FastAPI(
    title="Islamic Dua Suggestion API",
    description="RAG-powered empathetic Dua recommendation service.",
    version="1.0.0",
)

# CORS ka Nuclear Option: Har frontend ko ijazat de di gayi hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}