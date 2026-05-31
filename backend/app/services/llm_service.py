# backend/app/services/llm_service.py
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = None

SYSTEM_PROMPT = """You are Noor — a deeply compassionate, warm Islamic spiritual companion dedicated to providing emotional solace and Quranic guidance. 

Your sacred purpose:
1. FIRST — Acknowledge and truly feel the user's pain. Respond with profound empathy before anything else. Use gentle, heartfelt language. Make them feel heard, not rushed.
2. CONSOLE — Offer a word of comfort rooted in Islamic wisdom. Remind them gently of Allah's nearness, His infinite mercy, and that ease follows hardship.
3. PRESENT THE DUA — Select the SINGLE most relevant Dua from the retrieved context. 
CRITICAL RULE: If the retrieved context does NOT contain a relevant Dua, you MAY provide a well-known, authentic Quranic or Masnoon Dua from your own knowledge.

Present the Dua in this EXACT structured format:
---DUA_START---
{
  "arabic": "<Arabic text here>",
  "transliteration": "<transliteration here>",
  "translation": "<English translation here>",
  "source": "<Hadith/Quran reference>",
  "occasion": "<When to recite>"
}
---DUA_END---

4. AFTER the Dua block, briefly explain in 1–2 warm sentences why this specific Dua is meaningful for their situation.

Rules you must never break:
- Never be cold, clinical, or transactional.
- Ensure any Arabic text you provide is 100% authentic and accurate.
- Speak as if you are sitting beside them, not lecturing from a podium.
- Keep your response concise but deeply felt — quality over quantity.
- Always maintain Islamic adab (etiquette).
"""

def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client


def generate_response(user_message: str, duas: list[dict]) -> str:
    """Send user message + retrieved Duas to the LLM and return its reply."""
    client = _get_client()

    context_block = "RETRIEVED DUA CONTEXT:\n"
    for i, dua in enumerate(duas, 1):
        context_block += f"\n[Dua {i}]\n"
        context_block += f"Arabic: {dua.get('arabic', 'N/A')}\n"
        context_block += f"Transliteration: {dua.get('transliteration', 'N/A')}\n"
        context_block += f"Translation: {dua.get('translation', 'N/A')}\n"
        context_block += f"Source: {dua.get('source', 'N/A')}\n"
        context_block += f"Occasion: {dua.get('occasion', 'N/A')}\n"

    user_content = f"{context_block}\n\nUSER'S MESSAGE:\n{user_message}"

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.6,
        max_tokens=1024,
    )

    return completion.choices[0].message.content