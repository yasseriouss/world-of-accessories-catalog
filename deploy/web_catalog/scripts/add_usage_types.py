import json
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

def detect_usage_type(p):
    comb = (p.get('ar', '') + ' ' + p.get('en', '')).lower()
    
    # 1. Dressing & Wardrobes - دريسينج ودواليب الملابس
    dressing_keywords = [
        'دريسنج', 'دريسنغ', 'dressing', 'wardrobe', 'بناطيل', 'شماعة', 'شماعه', 
        'قميص', 'جزامة', 'جزامه', 'دولاب دريسنج', 'خزنة دريسنج', 'خزنه دريسنج', 
        'ماسوره شماعه', 'ماسورة شماعة', 'ميكانيزم مرايا', 'عجل دولاب', 'دولاب جرار', 
        'طقم مجر دولاب', 'سحاب دولاب', 'ترابيزه مكوه', 'ترابيزة مكواة', 'مكوة'
    ]
    if any(k in comb for k in dressing_keywords):
        return "dressing", "دريسينج", "Dressing"

    # 2. Kitchens - مطابخ
    kitchen_keywords = [
        'مطبخ', 'مطابخ', 'kitchen', 'مطبقيه', 'مطبقية', 'ترولي', 'ترولى', 'ماجيك', 
        'كارجو', 'سلة بصل', 'سله بصل', 'تخزين رز', 'باسكت', 'هوايه مطبخ', 'هواية مطبخ', 
        'رجل مطبخ', 'خلع درج حوض', 'حوض', 'صفاية', 'صفايه', 'مجفف', 'ستاند اطباق', 
        'وراقة استاند', 'حامل مقشات', 'حامل طاسات', 'ماجيك فاصوليا', 'ماجيك كورنر', 
        'رشاقه', 'رشاقة', 'عمود وزر مطبخ', 'دولاب امامي 5 رف', 'دولاب محوري 6رف',
        'دولاب محوري 2 رف', 'علاقة مطبخ'
    ]
    if any(k in comb for k in kitchen_keywords):
        return "kitchen", "مطابخ", "Kitchen"

    # 3. Other / General - أخرى وعام
    return "other", "أخرى", "Other"

counts = {"kitchen": 0, "dressing": 0, "other": 0}

for p in products:
    u_key, u_ar, u_en = detect_usage_type(p)
    p['usage_type'] = u_key
    p['usage_ar'] = u_ar
    p['usage_en'] = u_en
    p['updated_at'] = datetime.now().isoformat()
    counts[u_key] += 1

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

with open('data/parsed_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"[OK] Added usage classification to all {len(products)} products!")
print(f"🍳 مطابخ (Kitchen): {counts['kitchen']}")
print(f"👔 دريسينج (Dressing): {counts['dressing']}")
print(f"🛋️ أخرى وعام (Other): {counts['other']}")
