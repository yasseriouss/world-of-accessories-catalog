import csv
import json
import os

with open("assets/woa-product-images/report.csv", "r", encoding="utf-8-sig") as f:
    report = list(csv.DictReader(f))

seo_map = {int(r["id"]): r for r in report}

for json_path in ["apps/market/data/products.json", "data/products.json"]:
    if not os.path.exists(json_path):
        continue
    with open(json_path, "r", encoding="utf-8") as f:
        prods = json.load(f)
    
    updated = 0
    for p in prods:
        pid = int(p["id"])
        if pid in seo_map:
            r = seo_map[pid]
            p["slug"] = r["slug"]
            p["seo_title_ar"] = r["seo_title_ar"]
            p["image"] = f"https://ha-woa.vercel.app/seo-images/{r['slug']}.webp"
            updated += 1
            
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(prods, f, ensure_ascii=False, indent=2)
    print(f"Updated {updated} products in {json_path}")
