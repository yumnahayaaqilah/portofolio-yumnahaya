"use client";

import { MotionConfig } from "motion/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
