"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

interface AmbienceToggleProps {
  variant?: "navbar" | "compact" | "drawer" | "atmosphere";
  className?: string;
  onToggleComplete?: () => void;
}

export default function AmbienceToggle({
  variant = "navbar",
  className = "",
  onToggleComplete,
}: AmbienceToggleProps) {
  const { isEvening, setAmbience, toggleAmbience } = useAmbience();
  const prefersReducedMotion = useHydratedReducedMotion();

  // Secondary Button for the "Designed for Slow Evenings" section
  if (variant === "atmosphere") {
    return (
      <button
        type="button"
        onClick={() => {
          toggleAmbience();
          onToggleComplete?.();
        }}
        data-cursor="magnetic"
        className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-mono font-semibold tracking-wider transition-colors duration-300 shadow-md active:scale-95 cursor-pointer ${
          isEvening
            ? "bg-[#C8A97E] hover:bg-[#D9BA8F] text-[#0B1610]"
            : "bg-[#F4F3EE] hover:bg-white text-[#11261B]"
        } ${className}`}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: isEvening ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          {isEvening ? (
            <Sun className="w-4 h-4 text-[#0B1610]" />
          ) : (
            <Moon className="w-4 h-4 text-[#11261B]" />
          )}
        </motion.div>
        <span>
          {isEvening ? "Return to Daylight ☀" : "Preview Evening Ambience ☾"}
        </span>
      </button>
    );
  }

  // Compact circular / square touch button for mobile top bar (min 44x44)
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => {
          toggleAmbience();
          onToggleComplete?.();
        }}
        data-cursor="magnetic"
        aria-label={isEvening ? "Switch to daylight service" : "Switch to evening service"}
        className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border transition-colors duration-300 active:scale-90 cursor-pointer ${
          isEvening
            ? "bg-[#12241B] text-[#C8A97E] border-[#C8A97E]/30 shadow-[0_0_12px_rgba(200,169,126,0.15)]"
            : "bg-[#EAE8E0] text-[#141816] border-[#11261B]/15"
        } ${className}`}
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: isEvening ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {isEvening ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-[#1B3B2B]" />
          )}
        </motion.div>
      </button>
    );
  }

  // Full-width segmented card for the Mobile Navigation Drawer
  if (variant === "drawer") {
    return (
      <div
        className={`w-full p-1.5 rounded-2xl bg-[#070F0A]/80 border border-[#F4F3EE]/15 flex items-center justify-between text-xs font-mono select-none ${className}`}
      >
        <button
          type="button"
          onClick={() => {
            setAmbience("day");
            onToggleComplete?.();
          }}
          className={`relative flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            !isEvening
              ? "text-[#11261B] font-bold"
              : "text-[#A2ADA5] hover:text-[#F4F3EE]"
          }`}
        >
          {!isEvening && (
            <motion.div
              layoutId="drawerAmbienceThumb"
              className="absolute inset-0 rounded-xl bg-[#F4F3EE] shadow-md -z-0"
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Sun className="w-4 h-4" />
            <span>☀ Day (12–4 PM)</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAmbience("evening");
            onToggleComplete?.();
          }}
          className={`relative flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            isEvening
              ? "text-[#F4F3EE] font-bold"
              : "text-[#A2ADA5] hover:text-[#F4F3EE]"
          }`}
        >
          {isEvening && (
            <motion.div
              layoutId="drawerAmbienceThumb"
              className="absolute inset-0 rounded-xl bg-[#2D5A43] border border-[#C8A97E]/30 shadow-md -z-0"
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-[#C8A97E]" />
            <span>☾ Evening (6–11 PM)</span>
          </span>
        </button>
      </div>
    );
  }

  // Default: Sleek Dual-Pill Switcher for Desktop Navbar
  return (
    <div
      className={`inline-flex items-center p-1 rounded-full border transition-colors duration-300 select-none ${
        isEvening
          ? "bg-[#12241B] border-[#C8A97E]/25 shadow-[0_2px_12px_rgba(200,169,126,0.12)]"
          : "bg-[#EAE8E0]/90 border-[#11261B]/15"
      } ${className}`}
    >
      {/* Day Mode Pill Button */}
      <button
        type="button"
        onClick={() => setAmbience("day")}
        data-cursor="magnetic"
        className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
          !isEvening
            ? "text-[#F4F3EE] font-semibold"
            : "text-[#95A79B] hover:text-[#F4F3EE]"
        }`}
      >
        {!isEvening && (
          <motion.div
            layoutId="ambienceNavThumb"
            className="absolute inset-0 rounded-full bg-[#1B3B2B] shadow-sm -z-0"
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: isEvening ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <Sun className="w-3.5 h-3.5 text-[#F4F3EE]" />
          </motion.div>
          <span>Day</span>
        </span>
      </button>

      {/* Evening Mode Pill Button */}
      <button
        type="button"
        onClick={() => setAmbience("evening")}
        data-cursor="magnetic"
        className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
          isEvening
            ? "text-[#F4F3EE] font-semibold"
            : "text-[#5C645E] hover:text-[#141816]"
        }`}
      >
        {isEvening && (
          <motion.div
            layoutId="ambienceNavThumb"
            className="absolute inset-0 rounded-full bg-[#2D5A43] border border-[#C8A97E]/40 shadow-sm -z-0"
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: isEvening ? 0 : -180 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <Moon className="w-3.5 h-3.5 text-[#C8A97E]" />
          </motion.div>
          <span>Evening</span>
        </span>
      </button>
    </div>
  );
}
