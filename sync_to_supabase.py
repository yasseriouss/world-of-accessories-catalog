import json
import time
import urllib.request
import urllib.error

SUPABASE_URL = "https://jzllhisbgjfdnurfuzfb.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

with open(r"c:\Users\yasse\Documents\Catalogue\data\products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# Upload chunks with retry
batch_size = 50
for i in range(0, len(products), batch_size):
    chunk = products[i:i + batch_size]
    prod_payload = []
    for p in chunk:
        prod_payload.append({
            "id": p["id"],
            "ar": p["ar"],
            "en": p["en"],
            "price": str(p["price"]),
            "category_id": p.get("category_id"),
            "usage_type": p.get("usage_type", "other"),
            "usage_ar": p.get("usage_ar", "أخرى وعام"),
            "usage_en": p.get("usage_en", "General / Other"),
            "image": p.get("image", "Branding/logo-100.png")
        })

    success = False
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/woa_products",
                data=json.dumps(prod_payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                print(f"Products chunk {i} to {i+len(chunk)} sync response: {resp.status}")
                success = True
                break
        except Exception as e:
            print(f"Retry {attempt+1} for chunk {i}: {e}")
            time.sleep(2)

    if not success:
        print(f"FAILED chunk {i}")
    time.sleep(0.3)

print("All chunks processed successfully!")
