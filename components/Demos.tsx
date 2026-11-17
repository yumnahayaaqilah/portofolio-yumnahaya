"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Zoom } from "./ui";

const swap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { type: "spring", stiffness: 300, damping: 26 },
} as const;

function Seg<T extends string>({ id, options, value, onChange }: { id: string; options: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button key={o.key} className={value === o.key ? "on" : ""} aria-pressed={value === o.key} onClick={() => onChange(o.key)}>
          {value === o.key && <motion.span layoutId={`seg-${id}`} className="pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Streaming ---------- */
const STAGES = [
  { name: "Producer", text: "Replays the stored events as a stream, in order." },
  { name: "Kafka", text: "The event log. It feeds a mirror job into the lake and the streaming job." },
  { name: "HDFS lake", text: "Parquet archive. It can replay events into the same streaming job to recompute. 0 duplicate offsets, 0 gaps." },
  { name: "Spark Streaming", text: "Online logistic regression (River) scores each session at its third event and learns as outcomes arrive." },
  { name: "PostgreSQL", text: "Idempotent writes: each micro-batch is stored with its batch ID in one transaction, and replayed batches are skipped." },
  { name: "Streamlit", text: "The dashboard tracks daily ROC-AUC, Precision@5% and purchase rate by score decile." },
];

export function StreamingDemo() {
  const [s, setS] = useState(0);
  return (
    <>
      <div className="demo">
        <span className="demo-label">Kappa architecture. Click a stage.</span>
        <div className="flow">
          {STAGES.map((st, i) => (
            <span key={st.name} style={{ display: "contents" }}>
              <motion.button className={s === i ? "on" : ""} onClick={() => setS(i)} whileHover={{ y: -3 }} whileTap={{ scale: 0.94 }} aria-pressed={s === i}>
                {st.name}
              </motion.button>
              {i < STAGES.length - 1 && (
                <motion.span className="arr" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}>
                  →
                </motion.span>
              )}
            </span>
          ))}
        </div>
        <div className="flow-desc">
          <AnimatePresence mode="wait">
            <motion.p key={s} style={{ margin: 0, color: "var(--tx)" }} {...swap}>
              <b>{STAGES[s].name}.</b> {STAGES[s].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="demo">
        <span className="demo-label">Streamlit dashboard. Swipe or pick a tab.</span>
        <DashSlider />
      </div>
    </>
  );
}

const DASH = [
  { key: "pipeline", label: "Pipeline", src: "/assets/dash-pipeline.webp", alt: "Pipeline tab: pipeline status, latest scored sessions, and daily volume and purchase rate with anomalies", cap: "Pipeline status, latest scored sessions, and daily volume with anomaly flags." },
  { key: "model", label: "Model", src: "/assets/dash-model.webp", alt: "Model tab: daily AUC and Precision at 5 percent, model weights over time, purchase rate by score decile, and a flagging simulation", cap: "Sessions in the top 10% of scores buy at 35%, vs 8.4% overall. Flagging the top 11% gives the best F1 (0.39, lift 4.1x)." },
  { key: "customers", label: "Customers", src: "/assets/dash-customers.webp", alt: "Customer tab: purchase rate by cart and price, shopping funnel, purchases by category, abandoned carts and purchase rate by hour", cap: "Shopping funnel, purchase rate by cart and price, abandoned carts and purchase rate by hour." },
] as const;

function DashSlider() {
  const [i, setI] = useState(0);
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const go = (n: number) => setI(Math.max(0, Math.min(DASH.length - 1, n)));
  return (
    <>
      <Seg id="dash" value={DASH[i].key} onChange={(k) => go(DASH.findIndex((d) => d.key === k))} options={DASH.map((d) => ({ key: d.key, label: d.label }))} />
      <div className="slider" ref={ref}>
        <motion.div
          className="slider-track"
          drag="x"
          dragConstraints={{ left: -w * (DASH.length - 1), right: 0 }}
          dragElastic={0.15}
          animate={{ x: -i * w }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -w / 5 || info.velocity.x < -400) go(i + 1);
            else if (info.offset.x > w / 5 || info.velocity.x > 400) go(i - 1);
          }}
        >
          {DASH.map((d) => (
            <div className="slide" key={d.key}>
              <img src={d.src} alt={d.alt} draggable={false} />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="slider-bar">
        <AnimatePresence mode="wait">
          <motion.p key={i} className="figcap" style={{ margin: 0, flex: 1, minWidth: 200 }} {...swap}>
            {DASH[i].cap}
          </motion.p>
        </AnimatePresence>
        <div className="arrows">
          <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous tab">←</button>
          <button onClick={() => go(i + 1)} disabled={i === DASH.length - 1} aria-label="Next tab">→</button>
        </div>
      </div>
    </>
  );
}

/* ---------- Anemify ---------- */
const SCREENS = [
  { src: "/assets/anemify-camera.webp", label: "Guided camera and ROI crop, with a sample photo" },
  { src: "/assets/anemify-reject.webp", label: "Invalid photo rejected: a keyboard fails the Mahalanobis-distance OOD check" },
  { src: "/assets/anemify-result.webp", label: "Calibrated risk score with each photo's score and next steps" },
];
const MODELS = {
  palm: { v: 0.86, t: "Palm model. Sensitivity 0.91, specificity 0.67." },
  eye: { v: 0.73, t: "Eye model alone separates poorly (specificity 0.49), so its score is fused with the palm model." },
  fusion: { v: 0.89, t: "Fusion of palm and eye scores on 1,000 simulated pairs. Sensitivity 0.89, specificity 0.74." },
} as const;

export function AnemifyDemo() {
  const [scr, setScr] = useState(0);
  const [m, setM] = useState<keyof typeof MODELS>("palm");
  return (
    <>
      <div className="demo">
        <span className="demo-label">On the device. Tap a step.</span>
        <div className="phone-demo">
          <div>
            <div className="phone">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={scr}
                  className="screen"
                  tabIndex={0}
                  aria-label={`${SCREENS[scr].label}. Scroll to see the full screen.`}
                  initial={{ opacity: 0, x: 60, rotate: 4 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -60, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                >
                  <img src={SCREENS[scr].src} alt={SCREENS[scr].label} />
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.p className="scroll-hint" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              ↕ scroll inside the phone
            </motion.p>
          </div>
          <div className="opts">
            {SCREENS.map((s, i) => (
              <motion.button key={s.src} className={scr === i ? "on" : ""} onClick={() => setScr(i)} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }} aria-pressed={scr === i}>
                {s.label}
              </motion.button>
            ))}
            <p style={{ fontSize: 15, margin: "6px 0 0" }}>An 8.5 MB TensorFlow Lite model scores on the device, with no server and no upload.</p>
          </div>
        </div>
      </div>
      <div className="demo demo-grid">
        <div>
          <span className="demo-label">Compare test AUC</span>
          <Seg id="anem" value={m} onChange={setM} options={[{ key: "palm", label: "Palm" }, { key: "eye", label: "Eye" }, { key: "fusion", label: "Fusion" }]} />
          <AnimatePresence mode="wait">
            <motion.div key={m} className="bignum" style={{ color: "var(--c1)" }} {...swap}>
              {MODELS[m].v.toFixed(2)}
            </motion.div>
          </AnimatePresence>
          <div className="meter">
            <motion.i style={{ background: "var(--c1)" }} animate={{ width: `${MODELS[m].v * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
          </div>
          <p style={{ margin: 0 }}>{MODELS[m].t}</p>
        </div>
        <Zoom src="/assets/anemify-roc.webp" alt="ROC curves for the eye, palm and PDR fusion models on the test set" caption="ROC curves on the test set." />
      </div>
    </>
  );
}

/* ---------- Ames ---------- */
const SEGS = {
  premium: { price: 266872, text: "945 houses · 1,977 sq ft · quality 7.6/10" },
  standard: { price: 139818, text: "1,985 houses · 1,273 sq ft · quality 5.4/10" },
} as const;

export function AmesDemo() {
  const [g, setG] = useState<keyof typeof SEGS>("premium");
  return (
    <>
      <div className="demo demo-grid">
        <div>
          <span className="demo-label">Two housing segments. Pick one.</span>
          <Seg id="ames" value={g} onChange={setG} options={[{ key: "standard", label: "Standard / mid-range" }, { key: "premium", label: "Premium" }]} />
          <AnimatePresence mode="wait">
            <motion.div key={g} className="bignum" style={{ color: "var(--c3)" }} {...swap}>
              ${SEGS[g].price.toLocaleString("en-US")}
            </motion.div>
          </AnimatePresence>
          <p style={{ margin: "8px 0 0" }}>Average sale price. {SEGS[g].text}</p>
          <div className="meter">
            <motion.i style={{ background: "var(--c3)" }} animate={{ width: `${(SEGS[g].price / 266872) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 16 }} />
          </div>
        </div>
        <Zoom src="/assets/ames-pca.webp" alt="K-Means clusters shown on two PCA dimensions" caption="K-Means clusters on two PCA dimensions." />
      </div>
      <div className="demo">
        <Zoom src="/assets/ames-boxplot.webp" alt="Box plot of sale price by overall build quality" caption="Median sale price rises with build quality." />
      </div>
    </>
  );
}
