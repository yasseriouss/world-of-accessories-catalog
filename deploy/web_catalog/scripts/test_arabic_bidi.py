import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

INDIC_DIGITS = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
}

def to_indic(s):
    return ''.join(INDIC_DIGITS.get(c, c) for c in str(s))

def clean_arabic_text(t):
    if not t:
        return ""
    t = str(t).strip()
    # 1. Artifacts
    t = t.replace('Drawerة', 'درجة').replace('حShelf', 'حرف').replace('D3', '3D')
    
    # 2. Common technical translations
    t = re.sub(r'(?i)\bsoft\s*close\b', 'سوفت كلوز', t)
    t = re.sub(r'(?i)\bhydraulic\b', 'هيدروليك', t)
    t = re.sub(r'(?i)\bblack\b', 'أسود', t)
    t = re.sub(r'(?i)\bsilver\b', 'فضي', t)
    t = re.sub(r'(?i)\bgold\b', 'ذهبي', t)
    t = re.sub(r'(?i)\bwhite\b', 'أبيض', t)
    t = re.sub(r'(?i)\bgrey\b|\bgray\b', 'رمادي', t)
    t = re.sub(r'(?i)\bhinge\b', 'مفصلة', t)
    t = re.sub(r'(?i)\bhandle\b', 'مقبض', t)
    t = re.sub(r'(?i)\bslide\b|\brunner\b', 'سكة مجرى', t)
    
    # 3. Units: cm, mm, dimensions
    t = re.sub(r'(\d+)\s*[*xX×]\s*(\d+)', r'\1 × \2 سم', t)
    t = re.sub(r'(?i)\b(?:cm|c\.m)\b', 'سم', t)
    t = re.sub(r'(?i)\b(?:mm|m\.m)\b', 'مم', t)
    t = re.sub(r'(?i)\b(?:meter|mtr)\b', 'متر', t)
    t = re.sub(r'(\d+)\s*مسمار', r'\1 مسامير', t)
    t = re.sub(r'(\d+)\s*متر', r'\1 أمتار', t)
    t = re.sub(r'(\d+)(سم|مم)', r'\1 \2', t)
    t = re.sub(r'(\d+)([ء-ي])', r'\1 \2', t)
    t = re.sub(r'([ء-ي])(\d+)', r'\1 \2', t)
    
    # Clean redundant spaces
    t = re.sub(r'\s+', ' ', t).strip()

    # Convert standalone numeric dimensions and quantities to Eastern Arabic numerals
    t = re.sub(r'(?<![A-Za-z0-9\-])\d+(?![A-Za-z0-9\-])', lambda m: to_indic(m.group(0)), t)

    # Wrap any technical terms, models, or English brand words in <bdi dir="ltr"> to isolate bidi context
    def wrap_bdi(m):
        tok = m.group(0).strip()
        return f'<bdi class="bidi-isolate" dir="ltr">{tok}</bdi>'

    t = re.sub(r'\b[A-Za-z0-9\+\-\.]*[A-Za-z][A-Za-z0-9\+\-\.]*\b', wrap_bdi, t)
    return t

if __name__ == '__main__':
    data = json.load(open('data/parsed_products.json', encoding='utf-8'))
    print("Testing Arabic text enhancement on sample products:")
    for p in data[:15]:
        before = p.get('ar', '')
        after = clean_arabic_text(before)
        price_ar = f"{to_indic(p.get('price'))} ج.م"
        num_str = f"{p.get('n', 0):04d}"
        code_ar = f"#{to_indic(num_str)}"
        print(f"Code: {code_ar} | Price: {price_ar}")
        print(f"  ORIGINAL: {before}")
        print(f"  ENHANCED: {after}")
        print("-" * 50)
