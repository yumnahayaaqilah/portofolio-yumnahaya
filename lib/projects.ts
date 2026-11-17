export type Step = { title: string; body: string };
export type Metric = { label: string; value: number; decimals?: number; prefix?: string; suffix?: string; note: string };

export type Project = {
  slug: "streaming" | "anemify" | "ames";
  index: string;
  color: "c1" | "c2" | "c3";
  category: string;
  name: string;
  title: string;
  subtitle: string;
  teaser: string;
  meta: { label: string; value: string }[];
  highlight: { value: string; label: string }[];
  context: string[];
  approach: Step[];
  insight: string;
  outcome: Metric[];
  limits: string[];
  tags: string[];
  repo: string;
};

export const projects: Project[] = [
  {
    slug: "streaming",
    index: "01",
    color: "c2",
    category: "Data Engineering · Online Learning · E-commerce",
    name: "Streaming Purchase Intent",
    title: "Real-time purchase intent scoring on a Kappa architecture",
    subtitle:
      "Scoring 41.1M clickstream events at each session's third event with a model that keeps learning, verified against an independent recomputation.",
    teaser: "Kafka and Spark pipeline that scores shoppers at their third event and learns as outcomes arrive.",
    meta: [
      { label: "Role", value: "Sole developer" },
      { label: "Data", value: "41.1M events · 3.73M sessions" },
      { label: "Stack", value: "Kafka · Spark · River · PostgreSQL" },
    ],
    highlight: [
      { value: "0.735", label: "ROC-AUC" },
      { value: "4.6x", label: "lift, top 5%" },
    ],
    context: [
      "E-commerce sites want to know early in a session which shoppers are likely to buy, so they can act before the session ends. A model trained once on historical data goes stale, while retraining in batches delays new patterns.",
      "I built a streaming pipeline on 41.1M events from 3.73M sessions (a 10% session sample of the REES46 dataset, 7 months) that scores each session at its third event and updates the model as purchase outcomes arrive. The second challenge was proof: a streaming system can silently drop or duplicate events, so every result needed independent verification.",
    ],
    approach: [
      {
        title: "Kappa ingestion",
        body: "A producer replays events into Kafka. One job mirrors the log into an HDFS Parquet lake, and Spark Structured Streaming consumes the same log for scoring. The lake can replay events into the same job to recompute results. Kafka and HDFS run in Docker.",
      },
      {
        title: "Online learning at the third event",
        body: "Online logistic regression (River) scores each session at its third event and learns from the outcome once the session resolves. Compared against a batch logistic regression, gradient boosting, an add-to-cart rule and a random baseline on the same test period.",
      },
      {
        title: "Idempotent writes to PostgreSQL",
        body: "Each micro-batch is written to an 8-table PostgreSQL schema together with its batch ID in one transaction; batches already recorded are skipped when Spark replays them. The producer resent 120,714 events as a block at the start of the topic. Raw data is never modified: a check script finds the block's end offset and the stream processor skips every event below it before sessions are built.",
      },
      {
        title: "Independent verification",
        body: "Recomputed all session labels with DuckDB as an answer key: 100% of 3,729,218 sessions match. Verified all 41,135,649 events against an independent recount across 14 categories. The HDFS lake has 0 duplicate offsets and 0 gaps.",
      },
    ],
    insight:
      "A model that learns as data arrives matches one trained on the full history (0.735 vs 0.734). Gradient boosting reaches only 0.744, so the next gain will come from better features, not a different algorithm.",
    outcome: [
      { label: "Online model", value: 0.735, decimals: 3, note: "ROC-AUC. Batch LR 0.734, ECE 0.017" },
      { label: "Top 5% of scores", value: 4.6, decimals: 1, suffix: "x", note: "Lift. Precision 42%; top 1% lift 5.9x" },
      { label: "Verification", value: 100, suffix: "%", note: "3,729,218 sessions match the DuckDB answer key" },
    ],
    limits: [
      "A high score shows likelihood, not the effect of an action. Targeting with discounts needs an A/B test or an uplift model.",
    ],
    tags: ["Apache Kafka", "Spark Structured Streaming", "HDFS", "River", "PostgreSQL", "DuckDB", "Streamlit", "Docker"],
    repo: "https://github.com/yumnahayaaqilah/kappa-purchase-intent",
  },
  {
    slug: "anemify",
    index: "02",
    color: "c1",
    category: "Computer Vision · Healthcare · On-Device ML",
    name: "Anemify",
    title: "Smartphone anemia screening from palm and conjunctiva photos",
    subtitle:
      "A calibrated screening model that runs fully offline on Android, validated per subject to avoid leakage.",
    teaser: "Calibrated computer vision model that screens for anemia offline on Android.",
    meta: [
      { label: "Role", value: "ML models and on-device inference" },
      { label: "Team", value: "3 people" },
      { label: "Stack", value: "TensorFlow · TFLite · Android" },
    ],
    highlight: [
      { value: "0.86", label: "test AUC, palm" },
      { value: "8.5 MB", label: "offline model" },
    ],
    context: [
      "Anemia is confirmed with a blood test, which needs equipment and trained staff. Anemify explores whether a photo of the palm or the inner lower eyelid (conjunctiva) can flag who should get tested first.",
      "The main challenge was making the evaluation trustworthy. The public dataset has 4,260 palm images, but several patient IDs belong to the same person, so a random image split would let near-duplicate photos appear in both training and test sets. With only about 400 subjects for development, the model also had to stay simple enough not to overfit.",
    ],
    approach: [
      {
        title: "Subject-level validation",
        body: "Grouped 525 patient IDs into 502 subjects and used StratifiedGroupKFold (5×2), so no subject appears in both training and validation folds.",
      },
      {
        title: "Frozen backbone over fine-tuning",
        body: "Fine-tuning the last 20 layers of EfficientNetB0 (BatchNorm frozen, learning rate 1e-5, 8 epochs) did not improve validation AUC (palm 0.840 vs 0.845 frozen; conjunctiva 0.725 vs 0.731), and the gain over the embedding baseline was not significant (p = 0.26–0.59). With equal performance, I kept the simpler model: a frozen backbone with an MLP head of 164K–328K parameters. The frozen model already reached a training AUC of 1.0, so unfreezing more weights only added overfitting risk.",
      },
      {
        title: "Calibration and fusion",
        body: "Embedded Platt scaling inside the TFLite model. On development data, ECE dropped from 0.049 to 0.035 (palm) and from 0.076 to 0.012 (conjunctiva). Palm and eye scores are combined with PDR fusion, evaluated on 1,000 simulated pairs because the two datasets are not paired.",
      },
      {
        title: "On-device guardrails",
        body: "A guided camera with ROI crop, a photo quality check, and a Mahalanobis-distance OOD detector that rejects non-target images such as a keyboard. The detector reuses the same frozen embeddings, another reason to avoid fine-tuning. Parity tests confirmed that scores on an Android device match the Colab results.",
      },
    ],
    insight:
      "The eye model alone separates poorly (specificity 0.49). Its value comes from fusion with the palm score, which lifts test AUC from 0.86 to 0.89.",
    outcome: [
      { label: "Palm model", value: 0.86, decimals: 2, note: "Test AUC. Sensitivity 0.91, specificity 0.67" },
      { label: "Fusion (simulated pairs)", value: 0.89, decimals: 2, note: "Test AUC. Sensitivity 0.89, specificity 0.74" },
      { label: "Model size", value: 8.5, decimals: 1, suffix: " MB", note: "Runs offline; photos never leave the phone" },
    ],
    limits: [
      "Calibrated to the dataset (about 60% anemic), not to the real user population.",
      "Fusion assumes palm and eye photos are independent, which could not be tested with unpaired data.",
      "A screening aid, not a diagnosis.",
    ],
    tags: ["Python", "TensorFlow", "TensorFlow Lite", "EfficientNetB0", "scikit-learn", "Android"],
    repo: "https://github.com/Arettaaa/Anemify",
  },
  {
    slug: "ames",
    index: "03",
    color: "c3",
    category: "Data Mining · CRISP-DM · Real Estate",
    name: "House Price Analysis",
    title: "Ames Housing: price drivers, price tiers and market segments",
    subtitle: "An individual CRISP-DM project in R combining regression, classification and clustering on 2,930 houses.",
    teaser: "Regression, decision tree and K-Means on 2,930 house sales, built in R.",
    meta: [
      { label: "Role", value: "Individual project" },
      { label: "Data", value: "2,930 sales · 81 variables" },
      { label: "Stack", value: "R · CRISP-DM" },
    ],
    highlight: [
      { value: "R² 0.80", label: "regression" },
      { value: "F1 0.90", label: "classification" },
    ],
    context: [
      "The Ames Housing dataset has 2,930 sales with 81 variables, many of them overlapping measures of size and quality. The goal was to explain what drives price, classify listings as high or low priced, and find natural market segments, while keeping each model honest about what it can and cannot show.",
    ],
    approach: [
      {
        title: "Feature selection and leakage control",
        body: "Reduced the variables to 9 predictors for regression. For the high/low price classifier, price itself was kept out of the inputs to avoid leakage.",
      },
      { title: "Linear regression", body: "Predicts sale price from the 9 predictors and reports test error in dollars." },
      { title: "Decision tree classification", body: "Classifies high vs low price with rules that non-technical users can read." },
      {
        title: "K-Means segmentation",
        body: "Chose k = 2 where the elbow method and silhouette score (0.46) agree, then profiled each segment.",
      },
    ],
    insight:
      "Premium homes sell for nearly twice the price of mid-range homes ($266,872 vs $139,818), with higher build quality (7.6 vs 5.4) and larger living area (1,977 vs 1,273 sq ft).",
    outcome: [
      { label: "Regression", value: 0.8, decimals: 2, prefix: "R² ", note: "Test MAE $23,088" },
      { label: "Classification", value: 0.9, decimals: 2, prefix: "F1 ", note: "Accuracy 0.89" },
      { label: "Clustering", value: 2, suffix: " segments", note: "Silhouette 0.46, moderate separation" },
    ],
    limits: ["Price is right-skewed; the next step is a log-transformed target and non-linear models for premium homes."],
    tags: ["R", "CRISP-DM", "Linear Regression", "Decision Tree", "K-Means", "PCA"],
    repo: "https://github.com/yumnahayaaqilah/ames-housing-price-analysis",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
