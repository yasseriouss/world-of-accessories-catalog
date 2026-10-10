#!/usr/bin/env python3
"""
World of Accessories - Unified Project Launcher
Starts the Web Catalog & Admin Server on http://localhost:8080
"""

import os
import sys
import uvicorn

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, root_dir)

    print("==================================================================")
    print("       💎 WORLD OF ACCESSORIES - UNIFIED SYSTEM RUNNER            ")
    print("==================================================================")
    print(" 🌐 Customer Web Catalog:  http://localhost:8080/")
    print(" 🔒 Private Admin Portal:  http://localhost:8080/admin  (PIN: 2026)")
    print(" 📖 Printed A4 Catalogs:   http://localhost:8080/printed_catalogs.html")
    print(" ⚡ Catalog Generator CLI: python catalog_generator/cli.py")
    print("==================================================================")
    print("Starting server...")

    uvicorn.run("web_catalog.server:app", host="0.0.0.0", port=8080, reload=False)

if __name__ == "__main__":
    main()
