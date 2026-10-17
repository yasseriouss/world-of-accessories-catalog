import glob
import os
import re
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

SUPABASE_URL = "https://jzllhisbgjfdnurfuzfb.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bGxoaXNiZ2pmZG51cmZ1emZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTI5MDksImV4cCI6MjA5OTUyODkwOX0.0iIEyyD9pI8eblIixI8nbHJMm05kngTIMEWAi7yg_Eg"
BUCKET = "products"
FOLDER = "catalog"

IMAGE_DIR = r"c:\Users\yasse\Documents\Catalogue\seo-images"
files = glob.glob(os.path.join(IMAGE_DIR, "*.webp"))
print(f"Found {len(files)} webp images to upload to Supabase Storage ({BUCKET}/{FOLDER}/)...")

def upload_single_file(filepath):
    filename = os.path.basename(filepath)
    storage_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{FOLDER}/{filename}"
    
    with open(filepath, "rb") as f:
        data = f.read()
    
    headers = {
        "Authorization": f"Bearer {ANON_KEY}",
        "apikey": ANON_KEY,
        "Content-Type": "image/webp",
        "x-upsert": "true"
    }
    
    for attempt in range(3):
        try:
            req = urllib.request.Request(storage_url, data=data, method="POST", headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status in (200, 201):
                    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{FOLDER}/{filename}"
                    return filename, public_url, True, None
        except Exception as e:
            if attempt == 2:
                return filename, None, False, str(e)
            time.sleep(1)

# Execute concurrent uploads with 16 workers
success_count = 0
fail_count = 0
uploaded_urls = {}

start_time = time.time()
with ThreadPoolExecutor(max_workers=16) as executor:
    futures = [executor.submit(upload_single_file, f) for f in files]
    for idx, future in enumerate(as_completed(futures), 1):
        filename, public_url, ok, err = future.result()
        if ok:
            success_count += 1
            # Extract WOA code
            m = re.search(r"(woa-\d{4})", filename, re.IGNORECASE)
            if m:
                uploaded_urls[m.group(1).upper()] = public_url
        else:
            fail_count += 1
            print(f"Failed {filename}: {err}")
        
        if idx % 50 == 0 or idx == len(files):
            print(f"Uploaded {idx}/{len(files)} images ({(time.time() - start_time):.1f}s)...")

print(f"\nUpload finished in {(time.time() - start_time):.1f}s: {success_count} succeeded, {fail_count} failed.")

# Save mapping to json for database update
import json
with open("uploaded_images_map.json", "w", encoding="utf-8") as f:
    json.dump(uploaded_urls, f, indent=2, ensure_ascii=False)
print(f"Saved {len(uploaded_urls)} product code to public URL mappings to uploaded_images_map.json")
