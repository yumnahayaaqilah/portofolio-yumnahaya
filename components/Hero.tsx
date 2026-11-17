"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const word = "Portfolio".split("");

const shapes = [
  { key: "circle", style: { right: "6%", top: "2%" }, size: 120, float: 14, dur: 5,
    svg: <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="var(--c1)" /><circle cx="50" cy="50" r="20" fill="var(--bg)" /></svg> },
  { key: "square", style: { right: "24%", top: "18%" }, size: 84, float: 18, dur: 6,
    svg: <svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="22" fill="var(--c2)" transform="rotate(14 50 50)" /></svg> },
  { key: "star", style: { right: "10%", top: "42%" }, size: 110, float: 12, dur: 4.5,
    svg: <svg viewBox="0 0 100 100"><path d="M50 4 61 37 96 38 68 59 78 94 50 73 22 94 32 59 4 38 39 37Z" fill="var(--c3)" stroke="var(--tx)" strokeWidth="3" strokeLinejoin="round" /></svg> },
  { key: "squiggle", style: { right: "30%", top: "58%" }, size: 130, float: 10, dur: 5.5,
    svg: <svg viewBox="0 0 130 50"><path d="M5 25c15-25 25 25 40 0s25 25 40 0 25 25 40 0" fill="none" stroke="var(--tx)" strokeWidth="7" strokeLinecap="round" /></svg> },
  { key: "dot", style: { right: "2%", top: "70%" }, size: 46, float: 16, dur: 3.8,
    svg: <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="var(--c2)" /></svg> },
];

export default function Hero() {
  const area = useRef<HTMLDivElement>(null);

  return (
    <section className="hero" aria-label="Introduction">
      <div className="w" ref={area}>
        <div className="floaters" aria-hidden="true">
          {shapes.map((s, i) => (
            <motion.div
              key={s.key}
              className="floater"
              style={{ ...s.style, width: s.size }}
              drag
              dragConstraints={area}
              dragElastic={0.4}
              whileDrag={{ scale: 1.15, rotate: 12 }}
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, scale: 0, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.5 + i * 0.12 }}
            >
              <motion.div
                animate={{ y: [0, -s.float, 0], rotate: [0, i % 2 ? 6 : -6, 0] }}
                transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}
              >
                {s.svg}
              </motion.div>
            </motion.div>
          ))}
          <motion.span className="drag-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            psst, the shapes are draggable ↑
          </motion.span>
        </div>

        <motion.div
          className="hello"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
        >
          <span className="dot"><i /></span>
          Hi, I&apos;m Yumna. Open to ML internships
        </motion.div>

        <h1 className="big-title" aria-label="Portfolio.">
          {word.map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 80, rotate: i % 2 ? 12 : -12 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.25 + i * 0.05 }}
              whileHover={{ y: -18, rotate: i % 2 ? 8 : -8, color: ["var(--c1)", "var(--c2)", "var(--c3)"][i % 3] }}
            >
              {ch}
            </motion.span>
          ))}
          <motion.span
            aria-hidden="true"
            className="dotc"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.6, 1] }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            .
          </motion.span>
        </h1>

        <div className="bars" aria-hidden="true">
          {["var(--c1)", "var(--c2)", "var(--c3)"].map((c, i) => (
            <motion.span
              key={c}
              style={{ background: c }}
              initial={{ width: 0 }}
              animate={{ width: 90 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1 + i * 0.12 }}
            />
          ))}
        </div>

        <motion.p
          className="lede"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 160, damping: 20 }}
        >
          Turning raw data into <b>machine learning models</b> that are tested, explained and deployed.
        </motion.p>

        <motion.div
          className="btns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, type: "spring", stiffness: 160, damping: 20 }}
        >
          <Link className="btn p" href="#projects">See the projects</Link>
          <Link className="btn" href="#contact">Get in touch</Link>
        </motion.div>
      </div>
    </section>
  );
}
