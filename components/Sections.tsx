"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/projects";
import { Eyebrow, Reveal, Tilt, Words } from "./ui";

const EMAIL = "yumnahayaaqilah@gmail.com";

export function Marquee() {
  const items = ["Machine Learning", "Computer Vision", "Stream Processing", "Apache Kafka", "Spark", "TensorFlow Lite", "Model Evaluation", "Python", "SQL"];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        {row.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

const icons = {
  cap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" /></svg>,
  team: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.5-3.5 3.2-5.5 6.5-5.5s6 2 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.3 2.5 3.5 5.2" /></svg>,
};

const facts = [
  { icon: icons.cap, color: "#0a7472", title: "IPB University", text: "D4 Software Engineering Technology, GPA 3.93/4.00" },
  { icon: icons.book, color: "#c27a12", title: "First author, SINTA 2", text: "JASIEK journal, Vol. 8 No. 1, June 2026" },
  { icon: icons.star, color: "#3f6fe6", title: "KSE scholarship", text: "Karya Salemba Empat recipient, 2024/2025" },
  { icon: icons.team, color: "#0a7472", title: "Executive Chair, MTE 2026", text: "Led 30 committee members to run tech training for 64 high school students" },
];

export function About() {
  return (
    <section id="about">
      <div className="w about">
        <Reveal rotate={-4}>
          <div className="photo-wrap">
            <motion.div
              className="blob"
              animate={{ borderRadius: ["42% 58% 50% 50% / 50% 46% 54% 50%", "55% 45% 42% 58% / 44% 56% 44% 56%", "42% 58% 50% 50% / 50% 46% 54% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img src="/assets/photo.webp" alt="Portrait of Yumna Haya Aqilah" width={720} height={934} whileHover={{ rotate: -2, scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>About me</Eyebrow>
          </Reveal>
          <Words as="h2" className="h2" style={{ marginBottom: 20 }} stagger={0.05} text="I build machine learning into software that works outside the notebook." />
          <Words
            style={{ fontSize: 18 }}
            stagger={0.012}
            text="I'm a Software Engineering Technology student at IPB University who works where machine learning meets production-style engineering. I've built a streaming pipeline that scores live clickstream data with Kafka and Spark, and a computer vision model that runs fully offline on Android. In both, I care about the parts that make a model usable: leakage-safe evaluation, calibrated scores, verifiable data flow and documented limits."
          />
          <div className="cards4">
            {facts.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08} className="fill">
                <motion.div className="ic" whileHover={{ y: -4, rotate: i % 2 ? 0.8 : -0.8 }}>
                  <span className="icon" style={{ background: f.color }}>{f.icon}</span>
                  <div>
                    <b>{f.title}</b>
                    <p>{f.text}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects">
      <div className="w">
        <Reveal>
          <Eyebrow>Selected projects</Eyebrow>
          <h2 className="h2">Three projects spanning data pipelines, modeling and on-device deployment.</h2>
        </Reveal>
        <div className="pgrid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1} rotate={i === 1 ? 0 : i === 0 ? -3 : 3}>
              <Tilt>
                <Link href={`/projects/${p.slug}/`} className="pcard" aria-label={`Read the ${p.name} case study`}>
                  <span className="corner" style={{ background: `var(--${p.color}s)` }} />
                  <span className="num" style={{ background: `var(--${p.color})`, color: "var(--bg)", position: "relative" }}>
                    {p.index}
                  </span>
                  <h3 style={{ position: "relative" }}>{p.name}</h3>
                  <p>{p.teaser}</p>
                  <div className="hl">
                    {p.highlight.map((h) => (
                      <div key={h.label} style={{ background: `var(--${p.color}s)` }}>
                        <strong style={{ color: `var(--${p.color})` }}>{h.value}</strong>
                        <span>{h.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="go">
                    Read case study <i>→</i>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STACK: { name: string; items: string[] }[] = [
  { name: "Languages", items: ["Python", "R", "SQL", "PHP"] },
  { name: "Data and ML", items: ["pandas", "NumPy", "scikit-learn", "River"] },
  { name: "Deep learning", items: ["TensorFlow", "Keras", "TensorFlow Lite"] },
  { name: "Big data", items: ["Apache Kafka", "Apache Spark", "HDFS", "Docker"] },
  { name: "Databases", items: ["PostgreSQL", "PostGIS", "MySQL", "MongoDB", "DuckDB"] },
  { name: "Apps and visualization", items: ["Flutter", "Laravel", "Streamlit", "matplotlib", "seaborn"] },
];
const K = ["var(--c1)", "var(--c2)", "var(--c3)"];

export function Stack() {
  const [sel, setSel] = useState("All");
  return (
    <section id="stack">
      <div className="w">
        <Reveal>
          <Eyebrow>Tech stack</Eyebrow>
          <h2 className="h2">Tools I have used in real projects.</h2>
        </Reveal>
        <div className="chips" role="group" aria-label="Filter tech stack">
          {["All", ...STACK.map((s) => s.name)].map((n) => (
            <button key={n} className={`chip ${sel === n ? "on" : ""}`} onClick={() => setSel(n)} aria-pressed={sel === n}>
              {sel === n && <motion.span layoutId="chip-pill" className="pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span>{n}</span>
            </button>
          ))}
        </div>
        <motion.div className="sgrid" layout>
          {STACK.map((s, i) => {
            const on = sel === s.name;
            const off = sel !== "All" && !on;
            return (
              <motion.div
                key={s.name}
                layout
                className={`scard ${on ? "on" : ""}`}
                style={{ ["--k" as string]: K[i % 3] }}
                animate={{ opacity: off ? 0.25 : 1, scale: off ? 0.96 : on ? 1.03 : 1, y: on ? -6 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <h3 style={{ color: on ? K[i % 3] : undefined }}>{s.name}</h3>
                {s.items.map((t, j) => (
                  <motion.span
                    key={t}
                    className="t"
                    animate={on ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={{ delay: j * 0.05, duration: 0.4 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </motion.div>
            );
          })}
        </motion.div>
        <p style={{ marginTop: 22 }}>Also: Git, GitHub, Jupyter, Google Colab.</p>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement("textarea");
      t.value = EMAIL;
      document.body.append(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="contact">
      <div className="w">
        <Reveal y={60}>
          <div className="contact">
            <motion.span className="orb" style={{ width: 260, height: 260, right: -60, top: -80, background: "var(--c2)", opacity: 0.35 }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity }} />
            <motion.span className="orb" style={{ width: 140, height: 140, right: 140, bottom: -50, background: "var(--c1)", opacity: 0.4 }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />
            <div style={{ position: "relative" }}>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="h2">Ready to turn data, experiments and ideas into meaningful AI solutions.</h2>
              <p style={{ maxWidth: "46ch", fontSize: 18 }}>I&apos;m looking for a machine learning internship. Happy to talk about any of these projects.</p>
              <div className="btns">
                <a className="btn p" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`} target="_blank" rel="noopener">
                  Send an email
                </a>
                <motion.button className="btn" onClick={copy} whileTap={{ scale: 0.92 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={copied ? "y" : "n"} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                      {copied ? "Copied!" : "Copy email"}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
              <div className="links">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href="https://linkedin.com/in/yumnahayaaqilah" target="_blank" rel="noopener">LinkedIn</a>
                <a href="https://github.com/yumnahayaaqilah" target="_blank" rel="noopener">GitHub</a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="w">
        <span>© 2026 Yumna Haya Aqilah</span>
      </div>
    </footer>
  );
}
