'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CartItem = { slug: string; code: string; name_ar: string; name_en: string | null;
  price: number; sale: number | null; image: string; qty: number; stock: number };

type Ctx = {
  items: CartItem[]; add: (p: Omit<CartItem,'qty'>) => void; remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void; clear: () => void;
  count: number; subtotal: number; savings: number;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = 'woa-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, hydrated]);

  const add = (p: Omit<CartItem,'qty'>) =>
    setItems(prev => {
      const ex = prev.find(i => i.slug === p.slug);
      if (ex) return prev.map(i => i.slug === p.slug ? { ...i, qty: Math.min(i.qty + 1, i.stock) } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  const remove = (slug: string) => setItems(prev => prev.filter(i => i.slug !== slug));
  const setQty = (slug: string, qty: number) =>
    setItems(prev => prev.map(i => i.slug === slug
      ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + (i.sale ?? i.price) * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.sale ? (i.price - i.sale) * i.qty : 0), 0);

  return <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, savings }}>
    {children}</CartCtx.Provider>;
}
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside provider');
  return c;
};
