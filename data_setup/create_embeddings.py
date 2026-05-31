import pandas as pd
import os
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

# 1. API Key Load karein
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not PINECONE_API_KEY:
    raise ValueError("Bhai, .env file mein PINECONE_API_KEY nahi mili. Check karo!")

# 2. Pinecone Initialize karein
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "islamic-duas"
dimension_size = 384  # 'all-MiniLM-L6-v2' model ka size 384 hota hai

# 3. Automatically Index Banayen (Agar nahi bana hua)
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

if index_name not in existing_indexes:
    print(f"Index '{index_name}' Pinecone par nahi mila. Naya index automatically ban raha hai...")
    pc.create_index(
        name=index_name,
        dimension=dimension_size,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1" # Free tier ke liye usually yehi region hota hai
        )
    )
    # Thora wait karte hain taake index puri tarah ready ho jaye
    print("Index ban raha hai, thora wait karein...")
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)
    print("Alhamdulillah, Index successfully ban gaya!")
else:
    print(f"Index '{index_name}' pehle se mojood hai. Usi mein data upload hoga.")

# Index ko connect karein
index = pc.Index(index_name)

# 4. Embedding Model Load karein
print("Embedding model load ho raha hai (sirf pehli dafa download hoga)...")
model = SentenceTransformer('all-MiniLM-L6-v2') 

# 5. Dataset Load karein
print("CSV Dataset load ho raha hai...")
# Note: Path apne hisaab se theek kar lena agar file kisi aur folder mein ho
df = pd.read_csv('islamic_dua_dataset_final.csv') 

# Missing (NaN) values ko khatam karein taake error na aaye
df = df.fillna("")

batch_size = 64
vectors_to_upsert = []

print("Embeddings ban rahi hain aur Pinecone par upload ho rahi hain...")

# 6. Har row (chunk) ki embedding banayen aur upload karein
for i, row in tqdm(df.iterrows(), total=len(df)):
    dua_id = str(row['dua_id'])
    
    # Ye humara text chunk hai jiski embedding banegi
    text_to_embed = f"Category: {row['category']}. Title: {row['title']}. Occasion: {row['occasion']}. English Meaning: {row['english_meaning']}. Urdu Meaning: {row['urdu_meaning']}"
    
    # Embedding generate karein
    embedding = model.encode(text_to_embed).tolist()
    
    # Metadata (Ye baad mein kaam aayega jab backend banega)
    metadata = {
        "category": row['category'],
        "title": row['title'],
        "arabic_text": row['arabic_text'],
        "urdu_meaning": row['urdu_meaning'],
        "english_meaning": row['english_meaning'],
        "reference": row['reference']
    }
    
    vectors_to_upsert.append({
        "id": dua_id,
        "values": embedding,
        "metadata": metadata
    })
    
    # Batch pura hone par upload karein
    if len(vectors_to_upsert) >= batch_size:
        index.upsert(vectors=vectors_to_upsert)
        vectors_to_upsert = []

# Bachi hui Duas upload karein
if len(vectors_to_upsert) > 0:
    index.upsert(vectors=vectors_to_upsert)

print("Mubarak ho! Sab Duas ki embeddings automatically Pinecone par upload ho chuki hain.")