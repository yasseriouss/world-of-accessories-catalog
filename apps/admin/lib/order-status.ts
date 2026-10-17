import { tOr } from './i18n';

/** Order lifecycle, in display order. Labels live in messages/ar.json → orderStatus. */
export const ORDER_STATUSES = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'] as const;

export const orderStatusLabel = (status: string) => tOr(`orderStatus.${status}`, status);
