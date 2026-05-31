# backend/app/api/chat.py
import re
import json
import traceback
from fastapi import APIRouter, HTTPException
from app.models.schemas import UserRequest, BotResponse
from app.services.pinecone_service import retrieve_duas
from app.services.llm_service import generate_response

router = APIRouter()


def _parse_dua_block(text: str) -> tuple[dict | None, str]:
    """Extract structured Dua JSON from the LLM response."""
    pattern = r"---DUA_START---\s*(.*?)\s*---DUA_END---"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return None, text

    dua_json_str = match.group(1).strip()
    clean_text = text[: match.start()].strip() + "\n" + text[match.end() :].strip()

    try:
        dua = json.loads(dua_json_str)
        return dua, clean_text.strip()
    except json.JSONDecodeError:
        return None, text


@router.post("/ask", response_model=BotResponse)
def ask(request: UserRequest): 
    # Note: 'async def' ko 'def' kar diya hai kyun ke LLM aur Pinecone dono synchronous chal rahe hain.
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        duas = retrieve_duas(request.message)
        raw_reply = generate_response(request.message, duas)
        dua, narrative = _parse_dua_block(raw_reply)

        # Re-assemble the reply with a frontend-renderable marker
        if dua:
            reply = narrative + "\n\n__DUA_JSON__:" + json.dumps(dua, ensure_ascii=False)
        else:
            reply = raw_reply

        return BotResponse(reply=reply)

    except Exception as exc:
        print("\n💥 ERROR OCCURRED IN CHAT API:")
        traceback.print_exc()  # Yeh line asal Traceback ko terminal mein zabardasti print karegi
        raise HTTPException(status_code=500, detail=str(exc))