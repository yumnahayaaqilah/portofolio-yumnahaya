"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { AmesDemo, AnemifyDemo, StreamingDemo } from "./Demos";
import { CountUp, Reveal } from "./ui";
import { Footer } from "./Sections";

const demos = { streaming: StreamingDemo, anemify: AnemifyDemo, ames: AmesDemo };

function Row({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="row">
      <Reveal>
        <div className="row-label">
          {label}
          <b>{title}</b>
        </div>
      </Reveal>
      <div>{children}</div>
    </div>
  );
}

export default function CaseStudy({ slug }: { slug: string }) {
  const p = getProject(slug)!;
  const i = projects.findIndex((x) => x.slug === slug);
  const next = projects[i + 1];
  const c = `var(--${p.color})`;
  const cs = `var(--${p.color}s)`;
  const Demo = demos[p.slug];

  return (
    <>
      <section className="cs-head">
        <div className="w">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Link href="/#projects" className="back">← All projects</Link>
          </motion.div>
          <motion.span
            className="crumb"
            style={{ background: cs, color: c }}
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
          >
            Case study {p.index} · {p.category}
          </motion.span>
          <motion.h1
            className="cs-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.2 }}
          >
            {p.title}
          </motion.h1>
          <motion.p className="cs-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            {p.subtitle}
          </motion.p>
          <div className="meta">
            {p.meta.map((m, k) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 30, rotate: k === 1 ? 0 : k === 0 ? -3 : 3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.45 + k * 0.08 }}
                style={{ borderTop: `4px solid ${c}` }}
              >
                <small>{m.label}</small>
                <b>{m.value}</b>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 60 }}>
        <div className="w">
          <Row label="01 · The context" title="Why it matters">
            <Reveal>
              <div className="text">
                {p.context.map((t) => (
                  <p key={t.slice(0, 20)}>{t}</p>
                ))}
              </div>
            </Reveal>
          </Row>

          <Row label="02 · The approach" title={`${p.approach.length} key steps`}>
            <div className="steps">
              {p.approach.map((s, k) => (
                <Reveal key={s.title} delay={k * 0.06}>
                  <motion.div className="step" whileHover={{ x: 6 }}>
                    <motion.span
                      className="n"
                      style={{ background: cs, color: "var(--tx)" }}
                      whileHover={{ rotate: [0, -12, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {String(k + 1).padStart(2, "0")}
                    </motion.span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </Row>

          <Row label="03 · See it" title="Try it yourself">
            <Reveal>
              <Demo />
            </Reveal>
          </Row>

          <Row label="04 · The core insight" title="What I learned">
            <Reveal y={30}>
              <blockquote className="quote" style={{ ["--hl" as string]: cs }}>
                <span style={{ color: c }}>“</span>
                <mark>{p.insight}</mark>
                <span style={{ color: c }}>”</span>
              </blockquote>
            </Reveal>
          </Row>

          <Row label="05 · The outcome" title="Results">
            <div className="ocards">
              {p.outcome.map((o, k) => (
                <Reveal key={o.label} delay={k * 0.08} rotate={k === 1 ? 0 : k === 0 ? -3 : 3} className="fill">
                  <motion.div className="ocard" whileHover={{ y: -6, rotate: k % 2 ? 1 : -1 }}>
                    <small>{o.label}</small>
                    <strong style={{ color: c }}>
                      <CountUp value={o.value} decimals={o.decimals} prefix={o.prefix} suffix={o.suffix} />
                    </strong>
                    <p>{o.note}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <h3 style={{ fontSize: 18, margin: "36px 0 14px" }}>Limits I kept in view</h3>
              <ul className="limits">
                {p.limits.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 style={{ fontSize: 18, margin: "36px 0 14px" }}>Built with</h3>
              <div className="tags">
                {p.tags.map((t) => (
                  <motion.span key={t} className="tag" whileHover={{ y: -3, rotate: -3 }}>
                    {t}
                  </motion.span>
                ))}
              </div>
              <a className="btn repo" href={p.repo} target="_blank" rel="noopener">
                View code on GitHub ↗
              </a>
            </Reveal>
          </Row>

          <Reveal y={50}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
              {next ? (
                <Link href={`/projects/${next.slug}/`} className="next" style={{ background: `var(--${next.color}s)` }}>
                  <div>
                    <small style={{ color: `var(--${next.color})` }}>Next case study</small>
                    <b>{next.name}</b>
                  </div>
                  <i>→</i>
                </Link>
              ) : (
                <Link href="/#projects" className="next" style={{ background: "var(--sf2)" }}>
                  <div>
                    <small style={{ color: "var(--mu)" }}>That&apos;s all three</small>
                    <b>Back to all projects</b>
                  </div>
                  <i>←</i>
                </Link>
              )}
            </motion.div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
