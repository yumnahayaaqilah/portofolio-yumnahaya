"use client";

import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

const spring = { type: "spring", stiffness: 260, damping: 22 } as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  rotate = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, rotate, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <i>
        <b style={{ background: "var(--c1)" }} />
        <b style={{ background: "var(--c2)" }} />
        <b style={{ background: "var(--c3)" }} />
      </i>
      {children}
    </p>
  );
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [num, setNum] = useState(value.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setNum(v.toFixed(decimals)),
    });
    return () => c.stop();
  }, [inView, value, decimals]);

  const small = suffix.startsWith(" ");
  return (
    <span ref={ref}>
      {prefix}
      {num}
      {small ? <span className="unit">{suffix}</span> : suffix}
    </span>
  );
}

/** Card that tilts toward the pointer. */
export function Tilt({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 200, damping: 18 });

  return (
    <motion.div
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      whileHover={{ y: -6 }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

/** Image that opens full-size on click. */
export function Zoom({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <figure style={{ margin: 0 }}>
      <motion.img
        src={src}
        alt={alt}
        className="zoom"
        loading="lazy"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.02, rotate: -0.5 }}
        transition={spring}
      />
      {caption && <figcaption className="figcap">{caption}</figcaption>}
      {open && (
        <motion.div className="lightbox" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.img src={src} alt={alt} initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={spring} />
        </motion.div>
      )}
    </figure>
  );
}

/** Text that appears word by word each time it scrolls into view. */
export function Words({ text, as = "p", className, style, stagger = 0.025 }: { text: string; as?: "p" | "h2"; className?: string; style?: React.CSSProperties; stagger?: number }) {
  const Tag = as === "h2" ? motion.h2 : motion.p;
  return (
    <Tag
      className={className}
      style={style}
      initial="hide"
      whileInView="show"
      viewport={{ once: false, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          variants={{
            hide: { opacity: 0, y: 18, rotate: 4 },
            show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
          }}
        >
          {w + " "}
        </motion.span>
      ))}
    </Tag>
  );
}
