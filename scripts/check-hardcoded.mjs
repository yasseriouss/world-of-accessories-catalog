#!/usr/bin/env node
/**
 * Guard: no hardcoded user-facing text or colors in the Next.js apps.
 *
 * - Text belongs in apps/<app>/messages/{ar,en}.json and is read through next-intl.
 * - Colors belong in tokens.css (packages/ui/tokens.css is the source) and are
 *   referenced as var(--token).
 *
 * A line can opt out with a trailing `allow-hardcoded: <reason>` comment, e.g. for
 * values a browser API needs as a literal (viewport themeColor, manifest colors).
 *
 * Usage: node scripts/check-hardcoded.mjs [app ...]   (default: store web admin)
 * Exit code 1 when any violation is found.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const APPS = process.argv.slice(2).length ? process.argv.slice(2) : ['store', 'web', 'admin'];
const SCAN_DIRS = ['app', 'components', 'lib'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'messages']);
const SKIP_FILES = new Set(['tokens.css']);
const CODE_EXT = new Set(['.ts', '.tsx']);
const STYLE_EXT = new Set(['.css']);
const ALLOW = /allow-hardcoded:/;

const RULES = [
  {
    id: 'color',
    exts: new Set([...CODE_EXT, ...STYLE_EXT]),
    // hex (#abc, #aabbcc, #aabbccdd) or functional colors
    test: /(^|[^&\w])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?)\(/,
    message: 'hardcoded color — use a var(--token) from tokens.css',
  },
  {
    id: 'text-arabic',
    exts: CODE_EXT,
    test: /[؀-ۿ]/,
    message: 'hardcoded Arabic text — move it to messages/*.json',
  },
  {
    id: 'text-locale-ternary',
    exts: CODE_EXT,
    // isAr ? 'x' : 'y'   |   locale === 'ar' ? "x" : "y"
    // Locale codes and text direction ('en', 'ar-EG', 'rtl') are identifiers, not copy.
    test: {
      test: (line) => {
        const m = line.match(/\b(?:isAr|ar|locale\s*===\s*['"]ar['"])\s*\?\s*(['"`])([^'"`]*)\1\s*:\s*(?:(['"`])([^'"`]*)\3)?/);
        if (!m) return false;
        const ident = /^(?:[a-z]{2}(?:-[A-Z]{2})?|rtl|ltr)$/;
        return !(ident.test(m[2]) && (m[4] === undefined || ident.test(m[4])));
      },
    },
    message: 'per-locale string ternary — use t(key) instead',
  },
  {
    id: 'text-attr',
    exts: new Set(['.tsx']),
    test: /\b(?:aria-label|placeholder|title|alt)=["'][^"'{]*[A-Za-z]{2,}/,
    message: 'hardcoded attribute text — use {t(key)}',
  },
  {
    id: 'text-jsx',
    exts: new Set(['.tsx']),
    // >Some words<  (JSX text node with at least one latin word). Arrow functions
    // (`=> a <= b`) and comparisons (`a > 0 && b < c`) are code, not text.
    test: {
      test: (line) => {
        const re = /(?<![=-])>\s*([^<>{}=;()]*\b[A-Za-z]{2,}\b[^<>{}=;()]*)<(?!=)/g;
        for (const m of line.matchAll(re)) {
          if (!/&&|\|\|/.test(m[1])) return true;
        }
        return false;
      },
    },
    message: 'hardcoded JSX text — use {t(key)}',
  },
];

function* walk(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** Strip // and /* *\/ comments on a single line so commented code is ignored. */
function stripComments(line) {
  return line.replace(/\/\*.*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/, '$1');
}

/** Load every messages/<locale>.json of an app as { locale: object }. */
function loadMessages(app) {
  const dir = join(ROOT, 'apps', app, 'messages');
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.json')); } catch { return {}; }
  return Object.fromEntries(files.map((f) => [f.replace(/\.json$/, ''), JSON.parse(readFileSync(join(dir, f), 'utf8'))]));
}

const hasPath = (obj, dotted) => dotted.split('.').reduce((node, k) => (node && typeof node === 'object' ? node[k] : undefined), obj) !== undefined;

/**
 * Literal translation keys must exist in every locale file:
 *  - next-intl:  const tx = useTranslations('ns') / getTranslations('ns' | { namespace: 'ns' }) / createTranslator({ namespace: 'ns' })
 *                then tx('key') or tx.raw('key')  →  ns.key
 *  - admin:      t('full.key') imported from '@/lib/i18n'
 * Keys built at runtime (template literals) are not checked.
 */
function missingKeys(app, file, source, messages) {
  const out = [];
  const translators = new Map();
  for (const m of source.matchAll(/const\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\(\s*(?:'([\w.]+)'|\{[^}]*namespace:\s*'([\w.]+)'[^}]*\})?\s*\)/g)) {
    translators.set(m[1], m[2] ?? m[3] ?? '');
  }
  for (const m of source.matchAll(/const\s+(\w+)\s*=\s*createTranslator\(\{[^}]*namespace:\s*'([\w.]+)'/g)) translators.set(m[1], m[2]);
  if (/from '@\/lib\/i18n'/.test(source)) translators.set('t', '');
  for (const [name, ns] of translators) {
    const call = new RegExp(`(?<![\\w.])${name}(?:\\.raw)?\\(\\s*'([\\w.]+)'`, 'g');
    for (const m of source.matchAll(call)) {
      const key = ns ? `${ns}.${m[1]}` : m[1];
      for (const [locale, msgs] of Object.entries(messages)) {
        if (!hasPath(msgs, key)) {
          const line = source.slice(0, m.index).split('\n').length;
          out.push(`${relative(ROOT, file).replace(/\\/g, '/')}:${line}  [i18n-missing-key] "${key}" is missing in messages/${locale}.json`);
        }
      }
    }
  }
  return out;
}

const violations = [];
for (const app of APPS) {
  const messages = loadMessages(app);
  for (const sub of SCAN_DIRS) {
    for (const file of walk(join(ROOT, 'apps', app, sub))) {
      const ext = extname(file);
      if (SKIP_FILES.has(basename(file))) continue;
      if (!CODE_EXT.has(ext) && !STYLE_EXT.has(ext)) continue;
      const source = readFileSync(file, 'utf8');
      source.split(/\r?\n/).forEach((raw, i) => {
        if (ALLOW.test(raw)) return;
        const line = stripComments(raw);
        for (const rule of RULES) {
          if (rule.exts.has(ext) && rule.test.test(line)) {
            violations.push(`${relative(ROOT, file).replace(/\\/g, '/')}:${i + 1}  [${rule.id}] ${rule.message}`);
          }
        }
      });
      if (CODE_EXT.has(ext)) violations.push(...missingKeys(app, file, source, messages));
    }
  }
}

if (violations.length) {
  console.error(violations.join('\n'));
  console.error(`\n✗ ${violations.length} hardcoded text/color or missing-translation violation(s). See CLAUDE.md → "No hardcoded text or colors".`);
  process.exit(1);
}
console.log('✓ No hardcoded text or colors found; all translation keys exist.');
