import json

with open("data/products.json", "r", encoding="utf-8") as f:
    prods = json.load(f)

def clean(s):
    if s is None:
        return ""
    return str(s).replace("'", "''")

for part_idx, start in enumerate(range(350, len(prods), 80)):
    chunk = prods[start:start+80]
    vals = []
    for p in chunk:
        cat_id = p.get('category_id')
        cat_val = str(cat_id) if cat_id is not None else "NULL"
        vals.append(f"({p['id']}, '{clean(p['ar'])}', '{clean(p['en'])}', '{clean(p['price'])}', {cat_val}, '{clean(p.get('usage_type', 'other'))}', '{clean(p.get('usage_ar', 'أخرى'))}', '{clean(p.get('usage_en', 'Other'))}', '{clean(p.get('image', 'Branding/logo-100.png'))}')")
    sql = "INSERT INTO public.woa_products (id, ar, en, price, category_id, usage_type, usage_ar, usage_en, image) VALUES\n" + ",\n".join(vals) + "\nON CONFLICT (id) DO UPDATE SET ar=EXCLUDED.ar, en=EXCLUDED.en, price=EXCLUDED.price, category_id=EXCLUDED.category_id, usage_type=EXCLUDED.usage_type, usage_ar=EXCLUDED.usage_ar, usage_en=EXCLUDED.usage_en, image=EXCLUDED.image;"
    with open(f"deploy/part_{part_idx}.sql", "w", encoding="utf-8") as sf:
        sf.write(sql)
    print(f"Wrote deploy/part_{part_idx}.sql with {len(chunk)} rows")
