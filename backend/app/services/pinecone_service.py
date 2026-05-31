import os
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Environment variables ko load karein
load_dotenv()

_model = None
_index = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _get_index():
    global _index
    if _index is None:
        pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
        _index = pc.Index("islamic-duas")
    return _index


def retrieve_duas(query: str, top_k: int = 3) -> list[dict]:
    """Embed the query and fetch the top_k most relevant Duas."""
    model = _get_model()
    index = _get_index()

    embedding = model.encode(query).tolist()

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