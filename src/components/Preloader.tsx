"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

interface PreloaderProps {
  onComplete: () => void;
}

const CULINARY_LOGS = [
  "Preparing daylight service...",
  "Kindling fruitwood hearth...",
  "Plating seasonal courses...",
  "Dining room floorplan ready.",
];

const HERO_ASSETS_TO_PRELOAD = [
  "/images/hero-bowl.jpg",
  "/images/mushroom-tart.jpg",
  "/images/pistachio-gelato.jpg",
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Direct DOM refs to avoid 100+ React state re-renders during high-frequency count-up
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ringProgressRef = useRef<SVGCircleElement>(null);
  const statusLogRef = useRef<HTMLSpanElement>(null);

  const exitTriggeredRef = useRef(false);

  const startExitSequence = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;

    try {
      sessionStorage.setItem("verdure_loaded", "true");
    } catch {}

    setIsExiting(true);

    // Synchronize underlying hero entrance scale at mid-shutter lift
    const heroSyncTimer = setTimeout(() => {
      onComplete();
    }, 280);

    // Completely unmount after all 3 vertical shutters clear the viewport (180ms stagger + 750ms duration)
    const unmountTimer = setTimeout(() => {
      setIsUnmounted(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }, 980);

    return () => {
      clearTimeout(heroSyncTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    // If already loaded in this browsing session, immediately fast-forward
    try {
      if (sessionStorage.getItem("verdure_loaded") === "true") {
        onComplete();
        setIsUnmounted(true);
        if (typeof document !== "undefined") {
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
        }
        return;
      }
    } catch {}

    // Lock body scroll while the preloader curtain is mounted
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    // Silent background asset preloading for the 3 Hero tasting dishes
    HERO_ASSETS_TO_PRELOAD.forEach((src) => {
      if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = src;
      }
    });

    // Snappy 1050ms precision countdown engine (60-120fps hardware RAF loop)
    const startTime = performance.now();
    const duration = 1050;
    const ringCircumference = 2 * Math.PI * 88; // ~552.92px
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out for odometer deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 2.5);
      const pct = Math.min(Math.floor(easedProgress * 100), 100);

      // Direct DOM update: Counter number
      if (counterRef.current) {
        counterRef.current.textContent = pct.toString().padStart(2, "0");
      }

      // Direct DOM update: Bottom hairline progress
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Direct DOM update: SVG Celestial Compass Ring strokeDashoffset
      if (ringProgressRef.current) {
        const offset = ringCircumference * (1 - progress);
        ringProgressRef.current.style.strokeDashoffset = `${offset}`;
      }

      // Direct DOM update: Live culinary calibration status lines
      if (statusLogRef.current) {
        let logIdx = 0;
        if (pct >= 86) logIdx = 3;
        else if (pct >= 56) logIdx = 2;
        else if (pct >= 26) logIdx = 1;

        if (statusLogRef.current.textContent !== CULINARY_LOGS[logIdx]) {
          statusLogRef.current.textContent = CULINARY_LOGS[logIdx];
        }
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        // Complete! Ensure 100 is stamped then trigger shutter wipe
        if (counterRef.current) counterRef.current.textContent = "100";
        if (progressBarRef.current) progressBarRef.current.style.transform = "scaleX(1)";
        if (ringProgressRef.current) ringProgressRef.current.style.strokeDashoffset = "0";
        if (statusLogRef.current) statusLogRef.current.textContent = CULINARY_LOGS[3];

        setTimeout(() => {
          startExitSequence();
        }, 120);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [prefersReducedMotion, startExitSequence]);

  if (isUnmounted) return null;

  const letters = ["V", "E", "R", "D", "U", "R", "E"];
  const ringRadius = 88;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div
      key="verdure-architectural-preloader"
      className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden select-none pointer-events-auto"
      aria-label="Verdure Loading Screen"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* ================================================================ */}
      {/* 1. THREE VERTICAL ARCHITECTURAL SHUTTER PANELS (THE 3-COLUMN WIPE)*/}
      {/* ================================================================ */}
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-none z-0">
        {[0, 1, 2].map((idx) => (
          <motion.div
            key={idx}
            initial={{ y: "0%" }}
            animate={
              isExiting
                ? {
                    y: "-100%",
                    transition: {
                      duration: 0.75,
                      delay: idx * 0.09,
                      ease: [0.76, 0, 0.24, 1],
                    },
                  }
                : { y: "0%" }
            }
            className="relative h-full bg-[#11261B] border-r border-[#F4F3EE]/10 last:border-r-0 will-change-transform"
          >
            {/* Structural Blueprint Grid Crosshair Markers */}
            <span className="absolute top-14 -right-1.5 text-[#F4F3EE]/30 font-mono text-xs select-none z-10">
              +
            </span>
            <span className="absolute bottom-24 -right-1.5 text-[#F4F3EE]/30 font-mono text-xs select-none z-10">
              +
            </span>
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-[#F4F3EE]/20 font-mono text-xs select-none z-10 hidden sm:inline-block">
              +
            </span>
          </motion.div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* 2. FOREGROUND EDITORIAL CONTENT LAYER (Fades out cleanly in 250ms) */}
      {/* ================================================================ */}
      <motion.div
        animate={isExiting ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-8 md:p-12 text-[#F4F3EE]"
      >
        {/* TOP LEDGER ROW */}
        <header className="w-full flex items-center justify-between pb-4 border-b border-[#F4F3EE]/10 text-[11px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2.5 text-[#95A79B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
            <span className="font-semibold">No. 01 — Verdure Botanical Kitchen</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-[#6B8E78] hidden sm:inline-block">
              BENGALURU — 12.9716° N, 77.5946° E
            </span>

            <button
              type="button"
              onClick={startExitSequence}
              data-cursor="magnetic"
              className="px-3 py-1 rounded-full border border-[#C8A97E]/30 text-[#C8A97E] hover:text-[#F4F3EE] hover:bg-[#C8A97E]/10 transition-colors text-[10px] tracking-wider uppercase font-semibold cursor-pointer active:scale-95"
            >
              Skip Intro →
            </button>
          </div>
        </header>

        {/* CENTER STAGE: SVG BOTANICAL COMPASS RING & MASKED WORDMARK */}
        <main className="relative flex flex-col items-center justify-center my-auto py-8">
          {/* SVG Celestial / Botanical Compass Ring */}
          <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* Subtle Outer Blueprint Ring */}
              <circle
                cx="100"
                cy="100"
                r={ringRadius}
                fill="none"
                stroke="rgba(244, 243, 238, 0.10)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />

              {/* Animated Progress Compass Arc (Synchronized with 0-100 count) */}
              <circle
                ref={ringProgressRef}
                cx="100"
                cy="100"
                r={ringRadius}
                fill="none"
                stroke="#C8A97E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference}
                transform="rotate(-90 100 100)"
                className="transition-[stroke-dashoffset] duration-75 ease-linear will-change-[stroke-dashoffset]"
              />

              {/* 4 Cardinal Crosshair Extensions & Degree Markers */}
              <line x1="100" y1="6" x2="100" y2="16" stroke="#C8A97E" strokeWidth="1" opacity="0.7" />
              <line x1="100" y1="184" x2="100" y2="194" stroke="#C8A97E" strokeWidth="1" opacity="0.7" />
              <line x1="6" y1="100" x2="16" y2="100" stroke="#C8A97E" strokeWidth="1" opacity="0.7" />
              <line x1="184" y1="100" x2="194" y2="100" stroke="#C8A97E" strokeWidth="1" opacity="0.7" />

              <text x="100" y="24" textAnchor="middle" fill="rgba(244, 243, 238, 0.45)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.1em">0°</text>
              <text x="178" y="102" textAnchor="middle" fill="rgba(244, 243, 238, 0.45)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.1em">90°</text>
              <text x="100" y="180" textAnchor="middle" fill="rgba(244, 243, 238, 0.45)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.1em">180°</text>
              <text x="22" y="102" textAnchor="middle" fill="rgba(244, 243, 238, 0.45)" fontSize="5.5" fontFamily="monospace" letterSpacing="0.1em">270°</text>
            </svg>

            {/* Inner Center Content: Masked Rising Wordmark */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="flex items-center justify-center overflow-hidden py-1">
                {letters.map((char, index) => (
                  <div key={index} className="overflow-hidden inline-block">
                    <motion.span
                      initial={{ y: "115%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.7,
                        delay: 0.12 + index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.24em] text-[#F4F3EE] drop-shadow-sm"
                    >
                      {char}
                    </motion.span>
                  </div>
                ))}
              </div>

              {/* Italic Serif Subtitle in Warm Candlelight Amber */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-serif italic text-sm sm:text-base md:text-lg text-[#C8A97E] tracking-wider"
              >
                Taste in Pure Form.
              </motion.p>
            </div>
          </div>
        </main>

        {/* BOTTOM ARCHITECTURAL TELEMETRY BAR & ODOMETER COUNTER */}
        <footer className="w-full pt-4 sm:pt-6 border-t border-[#F4F3EE]/10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
          {/* Left Cell: Live Culinary Calibration Logs */}
          <div className="flex flex-col justify-end">
            <span className="text-[10px] font-mono tracking-widest text-[#6B8E78] uppercase mb-1">
              KITCHEN PREPARATION
            </span>
            <span
              ref={statusLogRef}
              className="text-[11px] sm:text-xs font-mono tracking-wider text-[#95A79B] uppercase font-medium h-5 flex items-center"
            >
              Preparing daylight service...
            </span>
          </div>

          {/* Center Cell: Razor-Thin Progress Hairline */}
          <div className="flex flex-col justify-end gap-1.5 pb-1">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#6B8E78] uppercase">
              <span>SERVICE READINESS</span>
              <span className="text-[#C8A97E] font-semibold">BOTANICAL KITCHEN</span>
            </div>
            <div className="w-full h-[1.5px] bg-[#F4F3EE]/15 relative overflow-hidden rounded-full">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#C8A97E] via-[#EAE8E0] to-[#F4F3EE] origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Right Cell: Oversized Odometer Percentage */}
          <div className="flex items-baseline justify-start md:justify-end gap-1 pb-1">
            <span
              ref={counterRef}
              className="font-mono text-5xl sm:text-6xl md:text-7xl font-light tracking-tighter tabular-nums text-[#F4F3EE] leading-none"
            >
              00
            </span>
            <span className="font-mono text-2xl sm:text-3xl text-[#C8A97E] font-light leading-none">
              %
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
