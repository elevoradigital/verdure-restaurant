"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Root Motion Config provider that overrides OS / device reduced-motion flags,
 * ensuring all Framer Motion transforms, gesture springs, and layout animations
 * run at full fidelity across every device.
 */
export default function MotionRootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
