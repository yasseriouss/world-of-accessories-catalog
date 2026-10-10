#!/usr/bin/env python3
"""
CLI Entrypoint for Catalog Generator
Usage:
    python catalog_generator/cli.py
    python -m catalog_generator.cli
"""

import sys
import os

# Add root directory to sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from catalog_generator.generator import CatalogGenerator

def main():
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
            
    print("==================================================")
    print("      WORLD OF ACCESSORIES - CATALOG GENERATOR    ")
    print("==================================================")
    gen = CatalogGenerator(root_dir=root_dir)
    res = gen.generate_all()
    print("Result:", res)

if __name__ == "__main__":
    main()
