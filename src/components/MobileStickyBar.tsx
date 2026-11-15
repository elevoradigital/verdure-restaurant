"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { useAmbience } from "@/context/AmbienceContext";

interface MobileStickyBarProps {
  onOpenReservation: () => void;
  isModalActive?: boolean;
}

export default function MobileStickyBar({
  onOpenReservation,
  isModalActive = false,
}: MobileStickyBarProps) {
  const { isEvening } = useAmbience();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past hero (>320px) and hide when reaching reservation section
      const scrolledPastHero = window.scrollY > 320;
      
      const reserveEl = document.getElementById("story");
      let nearReserve = false;
      if (reserveEl) {
        const rect = reserveEl.getBoundingClientRect();
        nearReserve = rect.top <= window.innerHeight * 0.72;
      }

      setIsVisible(scrolledPastHero && !nearReserve && !isModalActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isModalActive]);

  return (
    <AnimatePresence>
      {isVisible && !isModalActive && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{
            type: "spring",
            damping: 24,
            stiffness: 250,
          }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-40 md:hidden pointer-events-auto"
        >
          <div className={`flex items-center justify-between p-2 pl-4 rounded-full backdrop-blur-md transition-colors duration-700 ${
            isEvening
              ? "bg-[#070F0A]/95 border border-[#C8A97E]/30 shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
              : "bg-[#11261B]/95 border border-[#F4F3EE]/20 shadow-[0_12px_32px_rgba(17,38,27,0.45)]"
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEvening ? "bg-[#C8A97E]" : "bg-[#6B8E78]"
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isEvening ? "bg-[#C8A97E]" : "bg-[#6B8E78]"
                }`} />
              </span>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xs font-semibold text-[#F4F3EE] tracking-wider">
                  VERDURE
                </span>
                <span className={`text-[10px] font-mono transition-colors duration-700 ${
                  isEvening ? "text-[#C8A97E]" : "text-[#A2ADA5]"
                }`}>
                  {isEvening ? "Tonight — 4 Tables Left" : "Daylight Service — 6 Tables Left"}
                </span>
              </div>
            </div>

            {/* Pill CTA with subtle periodic shimmer sweep */}
            <motion.button
              type="button"
              onClick={onOpenReservation}
              whileTap={{ scale: 0.95 }}
              className={`relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm overflow-hidden transition-colors duration-300 cursor-pointer ${
                isEvening
                  ? "bg-[#C8A97E] text-[#0B1610] hover:bg-[#D8BE96]"
                  : "bg-[#F4F3EE] text-[#11261B] hover:bg-white"
              }`}
            >
              {/* Periodic shimmer overlay */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 5.0,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 w-1/2 bg-gradient-to-r from-transparent ${
                  isEvening ? "via-white/30" : "via-[#2D5A43]/20"
                } to-transparent skew-x-12 pointer-events-none`}
              />

              <Calendar className={`w-3.5 h-3.5 ${isEvening ? "text-[#0B1610]" : "text-[#1B3B2B]"}`} />
              <span>Reserve Table</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
