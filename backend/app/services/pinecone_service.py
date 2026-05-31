import os
import requests
from pinecone import Pinecone
from dotenv import load_dotenv

# Environment variables ko load karein
load_dotenv()

_index = None

def _get_index():
    global _index
    if _index is None:
        pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        _index = pc.Index("islamic-duas")
    return _index

def retrieve_duas(query: str, top_k: int = 3) -> list[dict]:
    """Embed the query via API to save RAM and fetch relevant Duas."""
    index = _get_index()

    # Model ko local RAM mein load karne ke bajaye Hugging Face API call karein
    hf_token = os.environ.get("HUGGINGFACE_API_KEY")
    if not hf_token:
        raise ValueError("HUGGINGFACE_API_KEY is missing in environment variables.")

    api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {hf_token}"}

    response = requests.post(api_url, headers=headers, json={"inputs": [query]})
    
    if response.status_code != 200:
        raise Exception(f"Embedding API Error: {response.text}")
        
    embedding = response.json()[0] # Pehla result hamari query ki embedding hai

    results = index.query(
        vector=embedding,
        top_k=top_k,
        include_metadata=True,
    )

    duas = []
    for match in results.get("matches", []):
        meta = match.get("metadata", {})
        duas.append(
            {
                "score": round(match.get("score", 0.0), 4),
                "arabic": meta.get("arabic", ""),
                "transliteration": meta.get("transliteration", ""),
                "translation": meta.get("translation", ""),
                "source": meta.get("source", ""),
                "occasion": meta.get("occasion", ""),
            }
        )
    return duas