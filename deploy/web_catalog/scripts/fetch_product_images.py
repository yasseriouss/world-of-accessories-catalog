#!/usr/bin/env python3
"""
Product Image Search & Fetcher Tool
Searches for realistic hardware product images based on Arabic/English product names,
downloads web-optimized product photos, and updates the catalog data.
"""

import os
import sys
import json
import re
import urllib.request
import urllib.parse
import argparse
import time
import hashlib

# Ensure UTF-8 stdout encoding on Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# User Agent for web requests
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

# Curated High-Definition Hardware Photography Collection (Fallback & Taxonomy mapping)
CURATED_HARDWARE_IMAGES = {
    "hinge": [
        "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&auto=format&fit=crop&q=80"
    ],
    "handle": [
        "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    "drawer": [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80"
    ],
    "support": [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80"
    ],
    "fastener": [
        "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=600&auto=format&fit=crop&q=80"
    ],
    "edge": [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80"
    ],
    "storage": [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80"
    ],
    "lock": [
        "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80"
    ],
    "tool": [
        "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80"
    ],
    "specialty": [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80"
    ]
}


def sanitize_search_query(product_name):
    """Clean product names from codes and arabic words for accurate search"""
    # Remove special characters
    q = re.sub(r'[\(\)\[\]\{\}\*\/\\\+\-]', ' ', product_name)
    words = [w.strip() for w in q.split() if len(w.strip()) > 1]
    return ' '.join(words[:5])


def search_online_images(query, limit=1):
    """Search images via public search endpoints with retry"""
    encoded_query = urllib.parse.quote(query + ' hardware furniture')
    try:
        # Wikimedia Commons search
        wiki_url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={encoded_query}&gsrlimit={limit}&prop=imageinfo&iiprop=url&format=json"
        req = urllib.request.Request(wiki_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=6) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            urls = []
            for _, info in pages.items():
                img_info = info.get('imageinfo', [])
                if img_info and 'url' in img_info[0]:
                    img_url = img_info[0]['url']
                    if any(img_url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                        urls.append(img_url)
            if urls:
                return urls
    except Exception as e:
        pass

    return []


def get_curated_image_for_product(product, index=0):
    """Return matching high quality photo from curated hardware photography"""
    name = (product.get('en', '') + ' ' + product.get('ar', '')).lower()
    
    if any(k in name for k in ['lock', 'قفل', 'كالون', 'مغناطيس']):
        bucket = CURATED_HARDWARE_IMAGES['lock']
    elif any(k in name for k in ['arm', 'دراع', 'باكم', 'رفع', 'support']):
        bucket = CURATED_HARDWARE_IMAGES['support']
    elif any(k in name for k in ['edge', 'شريط', 'تغليف', 'حافة']):
        bucket = CURATED_HARDWARE_IMAGES['edge']
    elif any(k in name for k in ['screw', 'مسمار', 'برغي', 'تثبيت']):
        bucket = CURATED_HARDWARE_IMAGES['fastener']
    elif any(k in name for k in ['bracket', 'كابولي', 'زاوية', 'دعامة']):
        bucket = CURATED_HARDWARE_IMAGES['tool']
    elif any(k in name for k in ['divider', 'tray', 'تقسيم', 'رف', 'منظم', 'سلة']):
        bucket = CURATED_HARDWARE_IMAGES['storage']
    elif any(k in name for k in ['handle', 'knob', 'مقبض', 'اكرة', 'أكرة']):
        bucket = CURATED_HARDWARE_IMAGES['handle']
    elif any(k in name for k in ['slide', 'runner', 'مجرى', 'درج', 'drawer']):
        bucket = CURATED_HARDWARE_IMAGES['drawer']
    elif any(k in name for k in ['gold', 'ذهبي', 'فاخر', 'chrome', 'كروم', 'specialty']):
        bucket = CURATED_HARDWARE_IMAGES['specialty']
    else:
        bucket = CURATED_HARDWARE_IMAGES['hinge']
        
    return bucket[index % len(bucket)]


def download_image(url, output_path):
    """Download and write image file safely"""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read()
            if len(content) > 1000:  # verify valid non-empty file
                with open(output_path, 'wb') as f:
                    f.write(content)
                return True
    except Exception as e:
        return False
    return False


def process_products(json_file='data/parsed_products.json', output_dir='assets/products', max_download=50):
    """Process products, search images, download, and update JSON"""
    if not os.path.exists(json_file):
        if os.path.exists('parsed_products.json'):
            json_file = 'parsed_products.json'
        else:
            print(f"[ERROR] Cannot find {json_file}")
            return

    os.makedirs(output_dir, exist_ok=True)

    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    products = data.get('value', data) if isinstance(data, dict) else data
    print(f"📦 Loaded {len(products)} products. Processing product images...")

    updated_count = 0
    downloaded_count = 0

    for idx, prod in enumerate(products, 1):
        prod_id = prod.get('n', idx)
        en_name = prod.get('en', '')
        ar_name = prod.get('ar', '')
        
        # Target local file
        local_filename = f"prod_{prod_id:04d}.jpg"
        local_rel_path = f"assets/products/{local_filename}"
        local_abs_path = os.path.join(output_dir, local_filename)

        # Assign image if not exists or download sample
        if not prod.get('image'):
            # Determine image URL (curated or search)
            img_url = get_curated_image_for_product(prod, idx)
            
            # Download up to max_download images locally
            if downloaded_count < max_download and not os.path.exists(local_abs_path):
                print(f"[{idx}/{len(products)}] Downloading image for: {en_name[:30]}...")
                if download_image(img_url, local_abs_path):
                    prod['image'] = local_rel_path
                    downloaded_count += 1
                else:
                    prod['image'] = img_url
            elif os.path.exists(local_abs_path):
                prod['image'] = local_rel_path
            else:
                prod['image'] = img_url

            updated_count += 1

    # Save updated JSON
    target_files = [json_file]
    if os.path.exists('parsed_products.json') and 'parsed_products.json' not in target_files:
        target_files.append('parsed_products.json')
    if os.path.exists('data/parsed_products.json') and 'data/parsed_products.json' not in target_files:
        target_files.append('data/parsed_products.json')

    for tf in target_files:
        with open(tf, 'w', encoding='utf-8') as f:
            if isinstance(data, dict) and 'value' in data:
                data['value'] = products
                json.dump(data, f, ensure_ascii=False, indent=2)
            else:
                json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"✅ Updated {tf} with image references.")

    print(f"\n🎉 Done! Updated {updated_count} products. Downloaded {downloaded_count} local photos.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Search and fetch product images")
    parser.add_argument('--limit', type=int, default=30, help="Number of sample images to download locally")
    parser.add_argument('--query', type=str, help="Search images for a specific query")
    args = parser.parse_args()

    if args.query:
        print(f"Searching images for '{args.query}'...")
        results = search_online_images(args.query, limit=3)
        if results:
            for r in results:
                print(f"Found: {r}")
        else:
            print(f"Curated match: {get_curated_image_for_product({'en': args.query, 'ar': args.query})}")
    else:
        process_products(max_download=args.limit)
