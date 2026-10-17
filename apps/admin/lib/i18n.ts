import ar from '@/messages/ar.json';

/**
 * Admin UI strings. The panel is Arabic-only, so this is a tiny typed lookup over
 * messages/ar.json instead of a full i18n framework. Usable in server and client
 * components. Add a locale by adding messages/<locale>.json and a locale switch here.
 */
export const LOCALE = 'ar';

type Messages = typeof ar;
type Params = Record<string, string | number>;

/** Dotted paths to every string leaf of the messages file, e.g. 'orders.title'. */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type MessageKey = Leaves<Messages>;

function lookup(key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], ar);
  return typeof value === 'string' ? value : undefined;
}

function format(template: string, params?: Params) {
  return params ? template.replace(/\{(\w+)\}/g, (m, name) => (name in params ? String(params[name]) : m)) : template;
}

/** Translate a known key; `{name}` placeholders are filled from `params`. */
export function t(key: MessageKey, params?: Params): string {
  return format(lookup(key) ?? key, params);
}

/**
 * Translate a key built at runtime (e.g. `orderStatus.${status}`); returns `fallback`
 * when the key does not exist, so unknown DB values still render.
 */
export function tOr(key: string, fallback: string, params?: Params): string {
  const template = lookup(key);
  return template === undefined ? fallback : format(template, params);
}
