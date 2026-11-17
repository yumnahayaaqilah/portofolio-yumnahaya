"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Nav() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("");
  const path = usePathname();

  useEffect(() => {
    if (path.startsWith("/projects")) {
      setActive("projects");
      return;
    }
    const ids = ["about", "projects", "stack", "contact"];
    const onScroll = () => {
      let cur = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) cur = "contact";
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <motion.nav
      className="nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
    >
      <div className="nav-in">
        <Link href="/" className="brand">
          <i>
            <b style={{ background: "var(--c1)" }} />
            <b style={{ background: "var(--c2)" }} />
            <b style={{ background: "var(--c3)" }} />
          </i>
          <span>Yumna Haya Aqilah</span>
        </Link>
        {[
          { id: "about", label: "About", sm: true },
          { id: "projects", label: "Projects", sm: false },
          { id: "stack", label: "Stack", sm: true },
          { id: "contact", label: "Contact", sm: false },
        ].map((l) => (
          <Link key={l.id} className={`link ${l.sm ? "hide-sm" : ""} ${active === l.id ? "on" : ""}`} href={`/#${l.id}`} aria-current={active === l.id ? "true" : undefined}>
            {active === l.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span>{l.label}</span>
          </Link>
        ))}
        <motion.button
          className="theme"
          onClick={toggle}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          whileTap={{ scale: 0.85, rotate: 90 }}
          whileHover={{ rotate: 20 }}
        >
          <motion.svg key={dark ? "sun" : "moon"} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>
            {dark ? (
              <>
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            ) : (
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            )}
          </motion.svg>
        </motion.button>
      </div>
    </motion.nav>
  );
}
