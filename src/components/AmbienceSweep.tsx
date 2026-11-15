"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function AmbienceSweep() {
  const { mode, isEvening, isTransitioning, lastOrigin } = useAmbience();
  const prefersReducedMotion = useHydratedReducedMotion();

  if (prefersReducedMotion) return null;

  const originX = lastOrigin?.x ?? (typeof window !== "undefined" ? window.innerWidth * 0.78 : 0);
  const originY = lastOrigin?.y ?? 36;
  const targetDiameter = lastOrigin
    ? lastOrigin.endRadius * 2.15
    : (typeof window !== "undefined" ? Math.hypot(window.innerWidth, window.innerHeight) * 2.15 : 2400);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden"
        >
          {/* 1. Origin Optical Bloom Pulse */}
          <motion.div
            key={`bloom-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              background: isEvening
                ? `radial-gradient(circle at ${originX}px ${originY}px, rgba(200, 169, 126, 0.35) 0%, rgba(18, 36, 27, 0.2) 50%, transparent 85%)`
                : `radial-gradient(circle at ${originX}px ${originY}px, rgba(255, 255, 255, 0.45) 0%, rgba(244, 243, 238, 0.25) 50%, transparent 85%)`,
            }}
          />

          {/* 2. Golden-Hour Horizon Halo Crest Ring */}
          <motion.div
            key={`halo-ring-${mode}-${originX}-${originY}`}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.95,
            }}
            animate={{
              width: targetDiameter,
              height: targetDiameter,
              opacity: [0.95, 0.75, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              left: originX,
              top: originY,
              boxShadow: isEvening
                ? "0 0 60px 18px rgba(200, 169, 126, 0.45), inset 0 0 35px 10px rgba(217, 186, 143, 0.3)"
                : "0 0 60px 18px rgba(255, 255, 255, 0.65), inset 0 0 35px 10px rgba(244, 243, 238, 0.4)",
              border: isEvening
                ? "2px solid rgba(200, 169, 126, 0.75)"
                : "2px solid rgba(255, 255, 255, 0.85)",
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
