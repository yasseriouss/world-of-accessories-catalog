import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

def detect_usage_type(p):
    comb = (p.get('ar', '') + ' ' + p.get('en', '')).lower()
    
    # 1. Dressing & Wardrobes - دريسينج ودواليب الملابس
    # دلالات واضحة على غرف الملابس والدواليب
    dressing_keywords = [
        'دريسنج', 'دريسنغ', 'dressing', 'wardrobe', 'بناطيل', 'شماعة', 'شماعه', 
        'قميص', 'جزامة', 'جزامه', 'دولاب دريسنج', 'خزنة دريسنج', 'خزنه دريسنج', 
        'ماسوره شماعه', 'ماسورة شماعة', 'ميكانيزم مرايا', 'عجل دولاب', 'دولاب جرار', 
        'طقم مجر دولاب', 'سحاب دولاب'
    ]
    if any(k in comb for k in dressing_keywords):
        return "dressing", "دريسينج", "Dressing & Wardrobes"

    # 2. Kitchens - مطابخ
    # دلالات واضحة على المطابخ ووحدات المطبخ
    kitchen_keywords = [
        'مطبخ', 'مطابخ', 'kitchen', 'مطبقيه', 'مطبقية', 'ترولي', 'ترولى', 'ماجيك', 
        'كارجو', 'سلة بصل', 'سله بصل', 'تخزين رز', 'باسكت', 'هوايه مطبخ', 'هواية مطبخ', 
        'رجل مطبخ', 'خلع درج حوض', 'حوض', 'صفاية', 'صفايه', 'مجفف اطباق', 'ستاند اطباق', 
        'وراقة استاند', 'حامل مقشات', 'حامل طاسات', 'ماجيك فاصوليا', 'ماجيك كورنر', 
        'رشاقه خزان', 'رشاقة', 'عمود وزر مطبخ', 'دولاب امامي 5 رف', 'دولاب محوري'
    ]
    if any(k in comb for k in kitchen_keywords):
        return "kitchen", "مطابخ", "Kitchens"

    # 3. Other / General Hardware & Furniture - أخرى / عام
    # مفصلات، مجاري أدراج عامة، مسامير، مقابض، أذرع هيدروليك، غراء، كوابيل
    return "other", "أخرى", "General & Other"

counts = {"kitchen": 0, "dressing": 0, "other": 0}
samples = {"kitchen": [], "dressing": [], "other": []}

for p in products:
    u_key, u_ar, u_en = detect_usage_type(p)
    counts[u_key] += 1
    if len(samples[u_key]) < 10:
        samples[u_key].append(p['ar'])

print("Usage type distribution:")
print(f"🍳 مطابخ (Kitchen): {counts['kitchen']} products")
print(f"👔 دريسينج (Dressing): {counts['dressing']} products")
print(f"🛋️ أخرى وعام (Other): {counts['other']} products")
print(f"Total: {sum(counts.values())}")

print("\n--- Samples Kitchen ---")
for s in samples['kitchen'][:5]:
    print(" ", s)

print("\n--- Samples Dressing ---")
for s in samples['dressing'][:5]:
    print(" ", s)

print("\n--- Samples Other ---")
for s in samples['other'][:5]:
    print(" ", s)
