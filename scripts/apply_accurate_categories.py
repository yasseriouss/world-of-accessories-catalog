import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from datetime import datetime
from audit_final_classification import classify_hardware_item

sys.stdout.reconfigure(encoding='utf-8')

# Load existing products
with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Update category_id for each product
changes_count = 0
for p in products:
    old_cat = p.get('category_id')
    new_cat = classify_hardware_item(p)
    if old_cat != new_cat:
        changes_count += 1
    p['category_id'] = new_cat
    p['updated_at'] = datetime.now().isoformat()

# Save data/products.json
with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

# Sync data/parsed_products.json
with open('data/parsed_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"[OK] Successfully reviewed and updated {len(products)} products!")
print(f"[INFO] Re-classified {changes_count} products to their accurate rightful categories.")
