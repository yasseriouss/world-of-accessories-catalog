import os
import shutil
import json

base_dir = r"c:\Users\yasse\Documents\Catalogue"
web_dir = os.path.join(base_dir, "deploy", "web_catalog")
print_dir = os.path.join(base_dir, "deploy", "printed_catalogs")

# Clean and recreate
shutil.rmtree(web_dir, ignore_errors=True)
shutil.rmtree(print_dir, ignore_errors=True)
os.makedirs(web_dir, exist_ok=True)
os.makedirs(print_dir, exist_ok=True)

# ----------------- 1. Setup Web Catalog -----------------
with open(os.path.join(base_dir, "web_catalog", "templates", "index.html"), "r", encoding="utf-8") as f:
    web_index_html = f.read()

with open(os.path.join(web_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(web_index_html)

# Static assets
shutil.copytree(os.path.join(base_dir, "web_catalog", "static"), os.path.join(web_dir, "static"))
shutil.copytree(os.path.join(base_dir, "styles"), os.path.join(web_dir, "styles"))
shutil.copytree(os.path.join(base_dir, "Branding"), os.path.join(web_dir, "Branding"))

# Data
os.makedirs(os.path.join(web_dir, "data"), exist_ok=True)
shutil.copy(os.path.join(base_dir, "data", "products.json"), os.path.join(web_dir, "data", "products.json"))
shutil.copy(os.path.join(base_dir, "data", "categories_data.json"), os.path.join(web_dir, "data", "categories_data.json"))

if os.path.exists(os.path.join(base_dir, "favicon.ico")):
    shutil.copy(os.path.join(base_dir, "favicon.ico"), os.path.join(web_dir, "favicon.ico"))

# Web vercel.json (Zero rewrites or links to admin or print portals)
web_vercel = {
    "version": 2,
    "cleanUrls": True,
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {"key": "Cache-Control", "value": "public, max-age=0, must-revalidate"},
                {"key": "Access-Control-Allow-Origin", "value": "*"}
            ]
        }
    ]
}
with open(os.path.join(web_dir, "vercel.json"), "w", encoding="utf-8") as f:
    json.dump(web_vercel, f, indent=2)

# Web README
with open(os.path.join(web_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write("""# World of Accessories - Web Catalog
Official responsive 2026 digital catalog for customers with live search, dual categorization (10 categories + 3 spaces: Kitchens, Dressing, Other).
- **Live URL**: https://world-of-accessories.vercel.app
""")

# ----------------- 2. Setup Printed Catalogs -----------------
with open(os.path.join(base_dir, "printed_catalogs.html"), "r", encoding="utf-8") as f:
    print_index_html = f.read()

# Link the digital catalog button to the web catalog
print_index_html = print_index_html.replace('href="/"', 'href="https://world-of-accessories.vercel.app"')
print_index_html = print_index_html.replace('href="/index.html"', 'href="https://world-of-accessories.vercel.app"')

with open(os.path.join(print_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(print_index_html)
with open(os.path.join(print_dir, "printed_catalogs.html"), "w", encoding="utf-8") as f:
    f.write(print_index_html)

# A4 catalogs
shutil.copy(os.path.join(base_dir, "catalog_ar.html"), os.path.join(print_dir, "catalog_ar.html"))
shutil.copy(os.path.join(base_dir, "catalog_en.html"), os.path.join(print_dir, "catalog_en.html"))
shutil.copy(os.path.join(base_dir, "catalog_en_branded.html"), os.path.join(print_dir, "catalog_en_branded.html"))

# Categories booklets
shutil.copytree(os.path.join(base_dir, "Categories"), os.path.join(print_dir, "Categories"))
shutil.copytree(os.path.join(base_dir, "styles"), os.path.join(print_dir, "styles"))
shutil.copytree(os.path.join(base_dir, "Branding"), os.path.join(print_dir, "Branding"))
shutil.copytree(os.path.join(base_dir, "data"), os.path.join(print_dir, "data"))
shutil.copytree(os.path.join(base_dir, "web_catalog", "static"), os.path.join(print_dir, "static"))
shutil.copy(os.path.join(base_dir, "web_catalog", "templates", "admin.html"), os.path.join(print_dir, "admin.html"))

if os.path.exists(os.path.join(base_dir, "favicon.ico")):
    shutil.copy(os.path.join(base_dir, "favicon.ico"), os.path.join(print_dir, "favicon.ico"))

# Print vercel.json
print_vercel = {
    "version": 2,
    "cleanUrls": True,
    "rewrites": [
        {"source": "/admin", "destination": "/admin.html"}
    ],
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {"key": "Cache-Control", "value": "public, max-age=0, must-revalidate"}
            ]
        }
    ]
}
with open(os.path.join(print_dir, "vercel.json"), "w", encoding="utf-8") as f:
    json.dump(print_vercel, f, indent=2)

# Print README
with open(os.path.join(print_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write("""# World of Accessories - Printed Catalogs & Category Booklets
Official print-ready A4 catalogs, international English edition, branded collection, and 20 individual category booklets for World of Accessories 2026.
- **Live URL**: https://world-of-accessories-print.vercel.app
- **Web Catalog**: https://world-of-accessories-web.vercel.app
""")

print("Successfully prepared both deploy directories:")
print(f"1. Web Catalog: {web_dir}")
print(f"2. Printed Catalogs: {print_dir}")
