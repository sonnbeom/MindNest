"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "생각이 바뀌는 과정", href: "#how" },
  { label: "이렇게 진행돼요", href: "#journey" },
  { label: "자주 묻는 질문", href: "#faq" },
  { label: "나의 변화", href: "/history" },
];

export default function NavSection() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250, 250, 248, 0.85)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "var(--text)" }}>
          <span>🧠</span>
          <span style={{ fontFamily: "var(--font-serif, serif)" }}>Mindnest</span>
        </Link>

        {/* 데스크탑 링크 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/session"
            className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-bold transition-all hover:scale-105"
            style={{
              background: "var(--primary)",
              color: "var(--text)",
              borderRadius: "var(--radius-button)",
            }}
          >
            생각 꺼내보기 →
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
          style={{ color: "var(--text)" }}
        >
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" style={{ transform: open ? "rotate(45deg) translate(2px, 6px)" : "" }} />
          <div className="w-5 h-0.5 bg-current mb-1.5 transition-all" style={{ opacity: open ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-current transition-all" style={{ transform: open ? "rotate(-45deg) translate(2px, -6px)" : "" }} />
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            background: "rgba(250, 250, 248, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderColor: "var(--border)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium py-1"
              style={{ color: "var(--muted)" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/session"
            className="inline-flex justify-center items-center px-5 py-3 text-sm font-bold mt-2"
            style={{ background: "var(--primary)", color: "var(--text)", borderRadius: "var(--radius-button)" }}
            onClick={() => setOpen(false)}
          >
            생각 꺼내보기 →
          </Link>
        </div>
      )}
    </nav>
  );
}
