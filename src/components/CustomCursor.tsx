"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import { useAmbience } from "@/context/AmbienceContext";
import { Sparkles, ArrowRight, Plus } from "lucide-react";

export default function CustomCursor() {
  const { variant, label, isVisible, isMouseDown } = useCursor();
  const { isEvening } = useAmbience();
  const prefersReducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Raw hardware-accelerated coordinate motion values (no React state re-renders)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inner precision dot spring (tight: 700 / 35 / 0.2)
  const dotSpringConfig = { stiffness: 700, damping: 35, mass: 0.2 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Outer contextual ring / morphing pill spring (smooth trailing: 280 / 26 / 0.5)
  const ringSpringConfig = { stiffness: 280, damping: 26, mass: 0.5 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    // Detect coarse-pointer / touch devices (<768px or no hover)
    const checkTouch = () => {
      const hasCoarse = window.matchMedia("(pointer: coarse), (hover: none)").matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsTouchDevice(hasCoarse || isSmallScreen);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    // Single passive mousemove listener for 60-120fps coordinate tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Touch screen or reduced motion guardrail -> deactivate custom cursor cleanly
  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }

  // Is morphing pill mode active?
  const isPill =
    variant === "hero3d" ||
    variant === "plate" ||
    variant === "gallery" ||
    variant === "tablePin";

  const isMagnetic = variant === "magnetic";
  const isHidden = variant === "hidden";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      {/* LAYER 1: INNER PRECISION DOT (8px) */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          opacity: isVisible && !isHidden && !isPill ? 1 : 0,
          scale: isVisible && !isHidden && !isPill ? (isMagnetic ? 0.6 : 1) : 0,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className={`w-2 h-2 rounded-full shadow-sm transition-colors duration-500 ${
            isEvening
              ? "bg-[#C8A97E] shadow-[0_0_8px_rgba(200,169,126,0.6)]"
              : "bg-[#1B3B2B] shadow-[0_0_8px_rgba(27,59,43,0.3)]"
          }`}
        />
      </motion.div>

      {/* LAYER 2: OUTER CONTEXTUAL RING / MORPHING PILL */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          opacity: isVisible && !isHidden ? 1 : 0,
          scale: isMouseDown ? 0.88 : 1,
        }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { type: "spring", stiffness: 450, damping: 25 },
        }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {/* STATE 1: DEFAULT MINIMAL ARCHITECTURAL RETICLE */}
          {variant === "default" && (
            <motion.div
              key="default"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`w-8 h-8 rounded-full border transition-colors duration-500 ${
                isEvening
                  ? "border-[rgba(244,243,238,0.3)] shadow-[0_0_12px_rgba(200,169,126,0.15)]"
                  : "border-[rgba(27,59,43,0.35)] shadow-[0_0_10px_rgba(27,59,43,0.08)]"
              }`}
            />
          )}

          {/* STATE 2: MAGNETIC HALO FOR BUTTONS & LINKS */}
          {isMagnetic && (
            <motion.div
              key="magnetic"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`w-12 h-12 rounded-full border backdrop-blur-[2px] transition-colors duration-500 ${
                isEvening
                  ? "bg-[#C8A97E]/15 border-[#C8A97E]/40 shadow-[0_0_16px_rgba(200,169,126,0.25)]"
                  : "bg-[#2D5A43]/15 border-[#2D5A43]/30 shadow-[0_0_14px_rgba(45,90,67,0.15)]"
              }`}
            />
          )}

          {/* STATE 3: HERO 3D INSPECTION PILL */}
          {variant === "hero3d" && (
            <motion.div
              key="hero3d"
              initial={{ scale: 0.8, y: 4, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -4, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[34px] px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border shadow-xl transition-all duration-500 whitespace-nowrap ${
                isEvening
                  ? "bg-[#C8A97E]/95 text-[#0B1610] border-black/10 shadow-[0_6px_24px_rgba(200,169,126,0.35)]"
                  : "bg-[#1B3B2B]/95 text-[#F4F3EE] border-[#F4F3EE]/20 shadow-[0_6px_24px_rgba(17,38,27,0.35)]"
              }`}
            >
              <Sparkles className="w-3 h-3 animate-spin [animation-duration:8s]" />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                {label || "✢ TILT 3D"}
              </span>
            </motion.div>
          )}

          {/* STATE 4: 3D PLATE DISH CARDS PILL */}
          {variant === "plate" && (
            <motion.div
              key="plate"
              initial={{ scale: 0.8, y: 4, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -4, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[34px] px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border shadow-xl transition-all duration-500 whitespace-nowrap ${
                isEvening
                  ? "bg-[#C8A97E] text-[#0B1610] border-[#0B1610]/15 shadow-[0_6px_24px_rgba(200,169,126,0.4)]"
                  : "bg-[#1B3B2B] text-[#F4F3EE] border-[#F4F3EE]/20 shadow-[0_6px_24px_rgba(17,38,27,0.4)]"
              }`}
            >
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                {label || "TILT / VIEW →"}
              </span>
            </motion.div>
          )}

          {/* STATE 5: INTERIOR ATMOSPHERE GALLERY PHOTO PILL */}
          {variant === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ scale: 0.8, y: 4, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -4, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[34px] px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border shadow-xl transition-all duration-500 whitespace-nowrap ${
                isEvening
                  ? "bg-[#C8A97E] text-[#0B1610] border-black/10 shadow-[0_6px_24px_rgba(200,169,126,0.4)]"
                  : "bg-[#F4F3EE]/95 text-[#11261B] border-[#11261B]/15 shadow-[0_6px_24px_rgba(17,38,27,0.25)]"
              }`}
            >
              <Plus className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                {label || "+ EXPAND SPACE"}
              </span>
            </motion.div>
          )}

          {/* STATE 6: ARCHITECTURAL FLOORPLAN TABLE PIN PILL */}
          {variant === "tablePin" && (
            <motion.div
              key="tablePin"
              initial={{ scale: 0.8, y: 4, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -4, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`h-[34px] px-3.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border shadow-xl transition-all duration-500 whitespace-nowrap ${
                label.includes("BOOKED")
                  ? "bg-[#5C645E]/90 text-[#F4F3EE] border-white/20 shadow-md"
                  : isEvening
                  ? "bg-[#C8A97E] text-[#0B1610] border-black/10 shadow-[0_6px_24px_rgba(200,169,126,0.4)]"
                  : "bg-[#1B3B2B] text-[#F4F3EE] border-[#F4F3EE]/20 shadow-[0_6px_24px_rgba(17,38,27,0.4)]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  label.includes("BOOKED")
                    ? "bg-[#F4F3EE]/60"
                    : isEvening
                    ? "bg-[#0B1610] animate-pulse"
                    : "bg-[#6B8E78] animate-pulse"
                }`}
              />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
                {label || "SELECT TABLE"}
              </span>
              {!label.includes("BOOKED") && <ArrowRight className="w-3 h-3" />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
