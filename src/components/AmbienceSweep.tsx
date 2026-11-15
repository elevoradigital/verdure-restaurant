"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function AmbienceSweep() {
  const { mode, isEvening, isTransitioning } = useAmbience();
  const prefersReducedMotion = useHydratedReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key={`sweep-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.45, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 pointer-events-none z-[60]"
          style={{
            background: isEvening
              ? "radial-gradient(circle at 75% 25%, rgba(200, 169, 126, 0.35), transparent 70%), linear-gradient(135deg, rgba(11, 22, 16, 0.45), transparent)"
              : "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.45), transparent 70%), linear-gradient(135deg, rgba(244, 243, 238, 0.35), transparent)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
