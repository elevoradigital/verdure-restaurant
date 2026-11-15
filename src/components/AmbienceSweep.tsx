"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function AmbienceSweep() {
  const { mode, isEvening, isTransitioning, lastOrigin, targetMode, isMobileTransition } = useAmbience();
  const prefersReducedMotion = useHydratedReducedMotion();

  if (prefersReducedMotion) return null;

  const originX = lastOrigin?.x ?? (typeof window !== "undefined" ? window.innerWidth * 0.78 : 0);
  const originY = lastOrigin?.y ?? 36;
  const maxRadius = lastOrigin?.endRadius ?? (typeof window !== "undefined" ? Math.hypot(window.innerWidth, window.innerHeight) : 1200);

  // Base circle diameter is 64px (radius = 32px)
  const baseDiameter = 64;
  const baseRadius = 32;
  // Scale factor to comfortably cover the farthest corner with 18% margin
  const scaleFactor = Math.max((maxRadius * 1.18) / baseRadius, 12);

  // Incoming mode for color styling: use targetMode if available, else opposite of current
  const incomingMode = targetMode || (isEvening ? "day" : "evening");
  const isIncomingEvening = incomingMode === "evening";

  return (
    <AnimatePresence>
      {isTransitioning && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden"
        >
          {isMobileTransition ? (
            /* ========================================================== */
            /* 1. MOBILE ZERO-LAG GPU SCALE3D PORTAL ENGINE               */
            /* Pure transform scale3d — zero reflow, zero clip-path lag   */
            /* ========================================================== */
            <>
              {/* Origin Micro-Bloom */}
              <motion.div
                key={`mobile-bloom-${incomingMode}-${originX}-${originY}`}
                initial={{ opacity: 0.85, scale: 0.3 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[10001]"
                style={{
                  left: originX,
                  top: originY,
                  width: baseDiameter,
                  height: baseDiameter,
                  background: isIncomingEvening
                    ? "radial-gradient(circle, rgba(200, 169, 126, 0.85) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, transparent 70%)",
                }}
              />

              {/* Expanding Zero-Lag GPU scale3d Wave Portal */}
              <motion.div
                key={`mobile-wave-${incomingMode}-${originX}-${originY}`}
                initial={{
                  scale: 0.05,
                  opacity: 1,
                }}
                animate={{
                  scale: scaleFactor,
                  opacity: [1, 1, 0.98, 0],
                }}
                transition={{
                  duration: 0.38,
                  times: [0, 0.65, 0.85, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[10000]"
                style={{
                  left: originX,
                  top: originY,
                  width: baseDiameter,
                  height: baseDiameter,
                  backgroundColor: isIncomingEvening ? "#0B1610" : "#F4F3EE",
                  border: isIncomingEvening
                    ? "1.5px solid rgba(200, 169, 126, 0.75)"
                    : "1.5px solid rgba(45, 90, 67, 0.45)",
                  boxShadow: isIncomingEvening
                    ? "0 0 20px 4px rgba(200, 169, 126, 0.35)"
                    : "0 0 20px 4px rgba(255, 255, 255, 0.55)",
                }}
              />
            </>
          ) : (
            /* ========================================================== */
            /* 2. DESKTOP GPU COMPOSITED HORIZON HALO OVERLAY             */
            /* ========================================================== */
            <>
              {/* Desktop Origin Optical Bloom Pulse */}
              <motion.div
                key={`desktop-bloom-${mode}`}
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

              {/* Desktop Golden-Hour Horizon Halo Crest Ring (GPU scale3d) */}
              <motion.div
                key={`desktop-halo-${mode}-${originX}-${originY}`}
                initial={{
                  scale: 0.05,
                  opacity: 0.95,
                }}
                animate={{
                  scale: scaleFactor,
                  opacity: [0.95, 0.75, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform z-[10000]"
                style={{
                  left: originX,
                  top: originY,
                  width: baseDiameter,
                  height: baseDiameter,
                  boxShadow: isEvening
                    ? "0 0 40px 10px rgba(200, 169, 126, 0.45), inset 0 0 20px 6px rgba(217, 186, 143, 0.3)"
                    : "0 0 40px 10px rgba(255, 255, 255, 0.65), inset 0 0 20px 6px rgba(244, 243, 238, 0.4)",
                  border: isEvening
                    ? "2px solid rgba(200, 169, 126, 0.75)"
                    : "2px solid rgba(255, 255, 255, 0.85)",
                }}
              />
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
