'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CartItem = {
  slug: string;
  code: string;
  name_ar: string;
  name_en: string | null;
  price: number;
  sale: number | null;
  image: string;
  qty: number;
  stock: number;
};

export type WishlistItem = {
  slug: string;
  code: string;
  name_ar: string;
  name_en: string | null;
  price: number;
  sale: number | null;
  image: string;
  stock: number;
};

export type CompareItem = {
  slug: string;
  code: string;
  name_ar: string;
  name_en: string | null;
  price: number;
  sale: number | null;
  image: string;
  stock: number;
};

type CartCtxType = {
  items: CartItem[];
  add: (p: Omit<CartItem, 'qty'>) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  savings: number;
};

type WishlistCtxType = {
  wishlist: WishlistItem[];
  toggleWishlist: (p: WishlistItem) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  wishlistCount: number;
};

type CompareCtxType = {
  compareList: CompareItem[];
  toggleCompare: (p: CompareItem) => void;
  removeFromCompare: (slug: string) => void;
  isInCompare: (slug: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
};

const CartCtx = createContext<CartCtxType | null>(null);
const WishlistCtx = createContext<WishlistCtxType | null>(null);
const CompareCtx = createContext<CompareCtxType | null>(null);

const CART_KEY = 'woa-cart-v1';
const WISHLIST_KEY = 'woa-wishlist-v1';
const COMPARE_KEY = 'woa-compare-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compareList, setCompareList] = useState<CompareItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'));
      setWishlist(JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]'));
      setCompareList(JSON.parse(localStorage.getItem(COMPARE_KEY) ?? '[]'));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
    }
  }, [compareList, hydrated]);

  const add = (p: Omit<CartItem, 'qty'>) =>
    setItems((prev) => {
      const ex = prev.find((i) => i.slug === p.slug);
      if (ex)
        return prev.map((i) =>
          i.slug === p.slug ? { ...i, qty: Math.min(i.qty + 1, i.stock) } : i
        );
      return [...prev, { ...p, qty: 1 }];
    });

  const remove = (slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug));

  const setQty = (slug: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i
      )
    );

  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + (i.sale ?? i.price) * i.qty, 0);
  const savings = items.reduce(
    (s, i) => s + (i.sale ? (i.price - i.sale) * i.qty : 0),
    0
  );

  const toggleWishlist = (p: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.slug === p.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== p.slug);
      }
      return [...prev, p];
    });
  };

  const removeFromWishlist = (slug: string) => {
    setWishlist((prev) => prev.filter((item) => item.slug !== slug));
  };

  const isInWishlist = (slug: string) => wishlist.some((item) => item.slug === slug);
  const wishlistCount = wishlist.length;

  const toggleCompare = (p: CompareItem) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.slug === p.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== p.slug);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), p];
      }
      return [...prev, p];
    });
  };

  const removeFromCompare = (slug: string) => {
    setCompareList((prev) => prev.filter((item) => item.slug !== slug));
  };

  const isInCompare = (slug: string) => compareList.some((item) => item.slug === slug);
  const clearCompare = () => setCompareList([]);
  const compareCount = compareList.length;

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, savings }}>
      <WishlistCtx.Provider
        value={{ wishlist, toggleWishlist, removeFromWishlist, isInWishlist, wishlistCount }}
      >
        <CompareCtx.Provider
          value={{ compareList, toggleCompare, removeFromCompare, isInCompare, clearCompare, compareCount }}
        >
          {children}
        </CompareCtx.Provider>
      </WishlistCtx.Provider>
    </CartCtx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error('useCart outside provider');
  return c;
};

export const useWishlist = () => {
  const c = useContext(WishlistCtx);
  if (!c) throw new Error('useWishlist outside provider');
  return c;
};

export const useCompare = () => {
  const c = useContext(CompareCtx);
  if (!c) throw new Error('useCompare outside provider');
  return c;
};

