'use client';
import { useEffect, useRef, ReactNode } from 'react';

// ظهور العناصر عند التمرير — IntersectionObserver بدون مكتبات
export default function Reveal({ children, delay = 0, as: Tag = 'div' }: any) {
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}
