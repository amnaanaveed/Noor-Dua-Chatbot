# backend/app/models/schemas.py
from pydantic import BaseModel


class UserRequest(BaseModel):
    message: str


class BotResponse(BaseModel):
    reply: str