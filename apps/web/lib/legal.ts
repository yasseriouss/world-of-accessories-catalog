/** Policy pages; their copy lives in messages/*.json under `legal.<slug>`. */
export const LEGAL_SLUGS = ['shipping', 'returns', 'privacy', 'terms'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export const isLegalSlug = (s: string): s is LegalSlug => (LEGAL_SLUGS as readonly string[]).includes(s);
