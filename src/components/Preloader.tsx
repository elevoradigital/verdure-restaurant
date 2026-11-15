"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const prefersReducedMotion = useHydratedReducedMotion();
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      const skipTimer = setTimeout(() => {
        setIsDone(true);
        onComplete();
      }, 0);
      return () => clearTimeout(skipTimer);
    }

    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    const startTime = Date.now();
    const duration = 950; // Optimized luxury mobile timing

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = "";
          setTimeout(onComplete, 350);
        }, 120);
      }
    }, 18);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, [onComplete, prefersReducedMotion]);

  const letters = ["V", "E", "R", "D", "U", "R", "E"];

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            borderBottomLeftRadius: "60px",
            borderBottomRightRadius: "60px",
            transition: {
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-14 bg-[#11261B] text-[#F4F3EE] select-none h-[100dvh] pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          {/* Top subtle brand metadata */}
          <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-widest text-[#6B8E78] uppercase">
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Botanical Culinary
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Est. 2026
            </motion.span>
          </div>

          {/* Center Stage: Letter-by-letter masked serif rise */}
          <div className="flex flex-col items-center">
            <div className="flex items-center overflow-hidden py-2">
              {letters.map((char, index) => (
                <div key={index} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "115%", rotateZ: 3 }}
                    animate={{ y: "0%", rotateZ: 0 }}
                    transition={{
                      duration: 0.65,
                      delay: 0.08 + index * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block font-serif text-4xl sm:text-7xl md:text-8xl font-normal tracking-[0.2em] text-[#F4F3EE]"
                  >
                    {char}
                  </motion.span>
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-2.5 text-[11px] sm:text-sm font-mono tracking-widest text-[#6B8E78] uppercase"
            >
              Taste in Pure Form
            </motion.p>
          </div>

          {/* Bottom Progress Bar & Monospace Counter */}
          <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-2.5">
            <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-mono text-[#A2ADA5]">
              <span>Initializing Sanctuary</span>
              <span className="font-semibold text-[#F4F3EE]">
                {progress.toString().padStart(2, "0")}%
              </span>
            </div>

            <div className="w-full h-[1.5px] bg-[#F4F3EE]/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#6B8E78]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
