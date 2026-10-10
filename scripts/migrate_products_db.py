import json
import sys
import os
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# Load raw products
with open('data/parsed_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Load categories
with open('data/categories_data.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)['categories']

priority_order = [8, 4, 6, 7, 9, 10, 5, 2, 3, 1]
sorted_categories = sorted(categories, key=lambda c: priority_order.index(c['id']) if c['id'] in priority_order else 99)

now_iso = datetime.now().isoformat()
enriched = []

for idx, p in enumerate(products, start=1):
    combined = f"{p.get('en', '')} {p.get('ar', '')}".lower()
    cat_id = 1
    for cat in sorted_categories:
        keywords = [kw.lower() for kw in cat.get('keywords_en', []) + cat.get('keywords_ar', [])]
        if any(kw in combined for kw in keywords):
            cat_id = cat['id']
            break
            
    num = p.get('n', idx)
    price_val = str(p.get('price', '0')).strip()
    
    img_path = p.get('image', 'Branding/logo-100.png')
    if not img_path:
        img_path = 'Branding/logo-100.png'

    item = {
        "id": num,
        "n": num,
        "ar": p.get('ar', '').strip(),
        "en": p.get('en', '').strip(),
        "price": price_val,
        "category_id": cat_id,
        "image": img_path,
        "created_at": now_iso,
        "updated_at": now_iso
    }
    enriched.append(item)

# Save to data/products.json
with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(enriched, f, ensure_ascii=False, indent=2)

print(f"[OK] Successfully saved {len(enriched)} enriched products into data/products.json")
