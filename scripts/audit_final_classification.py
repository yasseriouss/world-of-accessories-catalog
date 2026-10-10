import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

def clean_for_match(text):
    t = text.lower()
    # replace 'درجة' or 'درجه' with '__degree__' so it doesn't match 'درج'
    t = re.sub(r'درج[ةه]', '__degree__', t)
    return t

def classify_hardware_item(p):
    ar = p.get('ar', '').strip()
    en = p.get('en', '').strip()
    comb = f"{ar} {en}".lower()
    c_clean = clean_for_match(comb)

    # 1. المفصلات (Hinges)
    # مفصلة، مفصله، بيفوت، مكمل عقرب، بلند كورنر، عقربه 165
    if any(k in comb for k in [
        'مفصل', 'مفصله', 'مفصلة', 'hinge', 'بيفوت', 'بلوم عقربه', 'عقربه 165', 
        'مكمل عقرب', 'بلند كورنر', 'عدلة 2قوة', 'ركبة2قوة'
    ]):
        return 1

    # 4. الأذرع والميكانيزمات الهيدروليكية (Support Arms & Mechanisms)
    # Priority check for arms/lift struts
    if any(k in comb for k in [
        'دراع', 'ذراع', 'باكم', 'gas spring', 'gas strut', 'ميكانيزم سرير', 'ميكانيزم طاوله', 
        'ميكانيزم طاولة', 'ميكانيزم تربيزة', 'میكانیزتربیزه', 'ميكانيزم سحارة', 'رافعة هيدروليك', 
        'دراع قلاب'
    ]):
        return 4

    # 2. المقابض والمسكات والأزرار (Handles & Knobs)
    if any(k in comb for k in [
        'مقبض', 'مقابض', 'مسكة', 'مسكه', 'handle', 'knob', 'زرار مدور', 'زرار مربع', 
        'زرار خشابي', 'زرار بيج', 'هووك', 'هوك', 'شماعه جداري', 'علاقة مطبخ', 'علاقه مطبخ', 'اوكرة', 'أوكرة'
    ]) and not any(k in comb for k in ['بروفيل مقبض', 'شماعة بناطيل', 'شماعة قميص', 'شماعه بناطيل', 'شماعه قميص', 'زاويه ربط مقبض']):
        return 2

    # 3. أنظمة الأدراج وسكك الحركة والسحب (Drawer Systems & Slides)
    # Check with c_clean so 'درجة' is not matched
    if any(k in c_clean for k in [
        'مجرى', 'مجرى درج', 'درج', 'سلايد', 'runner', 'slide', 'تاندوم', 'اندر ماونت', 
        'أندر ماونت', 'جوانب درج', 'طقم مجر دولاب', 'عجل دولاب', 'جرار 280', 'جرار 200', 'عجل سحاب', 'خلع درج'
    ]) and not any(k in comb for k in ['ترولي', 'تقسيمة درج', 'تقسيمه درج']):
        return 3

    # 5. المسامير والمثبتات ومواد اللصق (Fasteners, Screws, Glues & Adhesives)
    if any(k in comb for k in [
        'مسمار', 'مcmار', 'سن صاج', 'تجميع', 'صامولة', 'صاموله', 'فيشر', 'screw', 'bolt', 
        'غراء', 'سيلكون', 'سيلكو', 'فوم', 'ماده تركي', 'مادة تركي', 'سريع sma', 'شحم', 
        'خابور', 'كويله خشب', 'دبوس هوا', 'سلوتيب', 'تيب 5سم', 'مزيل صدا', 'لاصق خشب', 'استرتش تغليف', 'كرتون'
    ]):
        return 5

    # 6. الوزرات والبروفيلات وهوايات المطابخ والتشطيب (Profiles, Plinths, Vents & Trim)
    if any(k in comb for k in [
        'عود وزر', 'وزره', 'هوايه', 'هواية', 'بروفيل g', 'بروفيل جولا', 'بروفيل مقبض', 
        'بروفيل 240', 'بروفايل', 'قشاط', 'شريط حرف', 'كعب كرسي', 'كعب عدل', 'كعب ترابيزة', 
        'طبة', 'طبه', 'غطاء مسامير', 'قطاع زجاج'
    ]) and not any(k in comb for k in ['وصلة بروفايل']):
        return 6

    # 7. إكسسوارات المطبخ والدريسنج والتخزين (Kitchen & Dressing Storage)
    if any(k in comb for k in [
        'ترولي', 'ترولى', 'مطبقيه', 'مطبقية', 'رشاقه', 'سلة', 'سله', 'سبت', 'باسكت', 
        'ماجيك', 'كارجو', 'شماعة بناطيل', 'شماعه بناطيل', 'شماعة قميص', 'شماعه قميص', 
        'جزامة', 'جزامه', 'دولاب محوري', 'دولاب دريسنج', 'دولاب امامي', 'دولاب 5 رف', 
        'ترابيزه مكوه', 'ترابيزة مكواة', 'تشت', 'صفاية', 'صفايه', 'مجفف', 'منظم', 'تقسيمة', 
        'تقسيمه', 'سلة بصل', 'تخزين رز', 'ستاند اطباق', 'وراقة استاند', 'حامل مقشات', 
        'ميكانيزم مرايا', 'ماسوره شماعه', 'شماعة', 'شماعه'
    ]):
        return 7

    # 8. الأقفال والكوالين وأصابع التاتش (Locks, Latches & Push Units)
    if any(k in comb for k in [
        'كالون', 'قفل', 'تاتش', 'صابع تاتش', 'دفاش', 'سوستة', 'سوسته', 'مغناطيس', 'ترباس', 'سلندر', 'lock', 'latch', 'وحدة تخريم صابع'
    ]):
        return 8

    # 9. الأرجل والعجلات والكوابيل وحوامل الرفوف (Legs, Wheels, Brackets & Shelf Pins)
    if any(k in comb for k in [
        'رجل', 'رجول', 'أرجل', 'عجل', 'عجلة', 'عجله', 'كابولي', 'زاوية', 'زاويه', 'زاوي', 
        'تكايه', 'تكاية', 'طقم تعليق', 'حامل رف', 'حامل ماسوره', 'حامل ماسورة', 'دعامة', 'bracket', 'اليتا تركي', 'حامل طاسات'
    ]):
        return 9

    # 10. الإضاءة والأنظمة الذكية والفاخرة (Smart Tech, Lighting & Specialty)
    if any(k in comb for k in [
        'ليد', 'led', 'سنسور', 'حساس', 'ترانس', 'محول', 'بصمة', 'بصمه', 'خزنة', 'خزنه', 
        'مكينة عد', 'مرايا مضيئه', 'وصلة بروفايل'
    ]):
        return 10

    # Fallbacks
    if 'حامل' in comb or 'زاوية' in comb:
        return 9
    return 10

results = {}
for p in products:
    cid = classify_hardware_item(p)
    results.setdefault(cid, []).append(p)

category_meta = {
    1: {"ar": "المفصلات", "en": "Hinges", "icon": "🔧"},
    2: {"ar": "المقابض والمسكات", "en": "Handles & Knobs", "icon": "🚪"},
    3: {"ar": "أنظمة الأدراج وسكك الحركة", "en": "Drawer Systems & Slides", "icon": "📦"},
    4: {"ar": "الأذرع والميكانيزمات الهيدروليكية", "en": "Support Arms & Lift Mechanisms", "icon": "💪"},
    5: {"ar": "المسامير والمثبتات ومواد اللصق", "en": "Fasteners, Screws & Adhesives", "icon": "🔩"},
    6: {"ar": "الوزرات والبروفيلات والتهوية", "en": "Profiles, Plinths & Trim", "icon": "✨"},
    7: {"ar": "إكسسوارات المطبخ والدريسنج", "en": "Kitchen & Dressing Storage Units", "icon": "🍽️"},
    8: {"ar": "الأقفال والكوالين وأصابع التاتش", "en": "Locks, Latches & Push Units", "icon": "🔐"},
    9: {"ar": "الأرجل والعجلات والكوابيل", "en": "Legs, Wheels & Brackets", "icon": "🛠️"},
    10: {"ar": "الإضاءة الذكية والأنظمة الخاصة", "en": "Smart Tech, Lighting & Specialty", "icon": "💡"}
}

print("================================================================")
print("             ACCURATE CATEGORIZATION AUDIT                      ")
print("================================================================")
for cid in range(1, 11):
    prods = results.get(cid, [])
    meta = category_meta[cid]
    print(f"Cat {cid:02d} | {meta['icon']} {meta['ar']} ({meta['en']}): {len(prods)} products")

print(f"\nTotal: {sum(len(v) for v in results.values())} products")
