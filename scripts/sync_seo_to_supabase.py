import csv
import json
import urllib.request
import time

SUPABASE_URL = "https://jzllhisbgjfdnurfuzfb.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg"

print("1. Authenticating as admin...")
auth_url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
auth_headers = {
    "apikey": ANON_KEY,
    "Content-Type": "application/json"
}
auth_data = json.dumps({
    "email": "yassersalllam@gmail.com",
    "password": "Hqwu3geoMAqcz-xu9cDvNaA1"
}).encode("utf-8")

req = urllib.request.Request(auth_url, data=auth_data, headers=auth_headers, method="POST")
with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode("utf-8"))
    access_token = res["access_token"]
print("Authenticated successfully!")

print("2. Reading report.csv...")
with open("assets/woa-product-images/report.csv", "r", encoding="utf-8-sig") as f:
    report = list(csv.DictReader(f))

print(f"Loaded {len(report)} products from report.csv.")

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# Update products in batches
batch_size = 50
success_count = 0
for i in range(0, len(report), batch_size):
    chunk = report[i:i + batch_size]
    payload = []
    for r in chunk:
        pid = int(r["id"])
        slug = r["slug"]
        image_url = f"https://ha-woa.vercel.app/seo-images/{slug}.webp"
        payload.append({
            "id": pid,
            "slug": slug,
            "image": image_url
        })
    
    # Send upsert request
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                f"{SUPABASE_URL}/rest/v1/woa_products",
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                success_count += len(chunk)
                print(f"Batch {i//batch_size + 1}: updated {len(chunk)} products (total: {success_count})")
                break
        except Exception as e:
            print(f"Retry batch {i//batch_size + 1} (attempt {attempt+1}): {e}")
            time.sleep(1)
            
    time.sleep(0.2)

print(f"Supabase sync complete: {success_count} products updated.")
