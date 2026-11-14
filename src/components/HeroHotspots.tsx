"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { ArrowRight, X } from "lucide-react";

export interface HotspotData {
  id: string;
  tag: string;
  title: string;
  shortName: string;
  subline: string;
  metric: string;
  top: string;
  left: string;
  cardPlacement: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  pulseDelay: number;
}

export const heroHotspots: HotspotData[] = [
  {
    id: "01",
    tag: "01 / HARVEST",
    title: "Heirloom Micro-Herbs",
    shortName: "01 Herbs",
    subline: "Picked at dawn daily.",
    metric: "Zero-Kilometer Farm",
    top: "42%",
    left: "38%",
    cardPlacement: "bottom-right",
    pulseDelay: 0,
  },
  {
    id: "02",
    tag: "02 / EXTRACTION",
    title: "Cold-Pressed Basil Oil",
    shortName: "02 Basil Oil",
    subline: "Infused over 48 hours.",
    metric: "100% Wild Botanical",
    top: "52%",
    left: "56%",
    cardPlacement: "top-left",
    pulseDelay: 0.6,
  },
  {
    id: "03",
    tag: "03 / VESSEL",
    title: "Hand-Thrown Stoneware",
    shortName: "03 Stoneware",
    subline: "Custom matte forest glaze.",
    metric: "Artisan Fired",
    top: "66%",
    left: "34%",
    cardPlacement: "top-right",
    pulseDelay: 1.2,
  },
  {
    id: "04",
    tag: "04 / PAIRING",
    title: "Distilled Leaf Steep",
    shortName: "04 Steep",
    subline: "Clarified garden herb tonic.",
    metric: "Zero-Proof Cellar",
    top: "28%",
    left: "78%",
    cardPlacement: "bottom-left",
    pulseDelay: 1.8,
  },
];

interface HeroHotspotsProps {
  isHoveredCard?: boolean;
  activeHotspot?: string | null;
  onSelectHotspot?: (id: string | null) => void;
}

export default function HeroHotspots({
  isHoveredCard = false,
  activeHotspot: controlledActiveHotspot,
  onSelectHotspot: controlledOnSelectHotspot,
}: HeroHotspotsProps) {
  const { isEvening } = useAmbience();
  const prefersReducedMotion = useReducedMotion();
  const [internalActiveHotspot, setInternalActiveHotspot] = useState<string | null>(null);
  const userInteractedRef = useRef(false);

  const isControlled = controlledActiveHotspot !== undefined;
  const activeHotspot = isControlled ? controlledActiveHotspot : internalActiveHotspot;

  const setActiveHotspot = useCallback(
    (nextId: string | null) => {
      userInteractedRef.current = true;
      if (!isControlled) {
        setInternalActiveHotspot(nextId);
      }
      controlledOnSelectHotspot?.(nextId);
    },
    [isControlled, controlledOnSelectHotspot]
  );

  // Auto-tour idle discovery: automatically open Hotspot 01 after 1200ms unless interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInteractedRef.current) {
        if (!isControlled) {
          setInternalActiveHotspot("01");
        }
        controlledOnSelectHotspot?.("01");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isControlled, controlledOnSelectHotspot]);

  // Keyboard accessibility: Escape key dismisses active hotspot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveHotspot(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveHotspot]);

  const handleToggleHotspot = (id: string) => {
    userInteractedRef.current = true;
    setActiveHotspot(activeHotspot === id ? null : id);
  };

  const handleHoverHotspot = (id: string) => {
    userInteractedRef.current = true;
    setActiveHotspot(id);
  };

  const activeSpotData = heroHotspots.find((h) => h.id === activeHotspot);

  return (
    <>
      {/* 3D SPATIAL PIN & DESKTOP CALLOUT LAYER (translateZ: 28px / 48px) */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: prefersReducedMotion
            ? undefined
            : isHoveredCard
            ? "translateZ(28px)"
            : "translateZ(16px)",
          transition: "transform 0.3s ease-out",
        }}
        className="absolute inset-0 pointer-events-none z-20"
      >
        {heroHotspots.map((spot) => {
          const isActive = activeHotspot === spot.id;
          const isDimmed = activeHotspot !== null && !isActive;

          return (
            <div
              key={spot.id}
              style={{
                top: spot.top,
                left: spot.left,
                transformStyle: "preserve-3d",
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              {/* Invisible 44x44 Touch / Click Target Box */}
              <div className="relative flex items-center justify-center w-11 h-11">
                {/* Dual-Ring Sonar Breathing Pulse (Idle State) */}
                {!prefersReducedMotion && (
                  <>
                    <motion.span
                      animate={
                        isActive || isDimmed
                          ? { opacity: 0, scale: 1 }
                          : {
                              scale: [1, 1.8],
                              opacity: isEvening ? [0.6, 0] : [0.45, 0],
                            }
                      }
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        delay: spot.pulseDelay,
                        ease: "easeOut",
                      }}
                      className={`absolute w-7 h-7 rounded-full border pointer-events-none ${
                        isEvening ? "border-[#C8A97E]" : "border-[#1B3B2B]"
                      }`}
                    />
                    <motion.span
                      animate={
                        isActive || isDimmed
                          ? { opacity: 0, scale: 1 }
                          : {
                              scale: [1, 1.45],
                              opacity: isEvening ? [0.4, 0] : [0.3, 0],
                            }
                      }
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        delay: spot.pulseDelay + 0.3,
                        ease: "easeOut",
                      }}
                      className={`absolute w-7 h-7 rounded-full border pointer-events-none ${
                        isEvening ? "border-[#C8A97E]" : "border-[#6B8E78]"
                      }`}
                    />
                  </>
                )}

                {/* Tactile 28x28 Center Pin Button */}
                <motion.button
                  type="button"
                  data-cursor="magnetic"
                  aria-expanded={isActive}
                  aria-label={`Hotspot ${spot.id}: ${spot.title}`}
                  onClick={() => handleToggleHotspot(spot.id)}
                  onMouseEnter={() => handleHoverHotspot(spot.id)}
                  animate={{
                    scale: isActive ? 1.15 : isDimmed ? 0.88 : 1,
                    opacity: isDimmed ? 0.45 : 1,
                  }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 350, damping: 24 }}
                  className={`relative w-7 h-7 rounded-full flex items-center justify-center border shadow-lg cursor-pointer transition-colors duration-300 focus:outline-none focus-visible:ring-2 ${
                    isEvening
                      ? isActive
                        ? "bg-[#C8A97E] text-[#0B1610] border-white shadow-[0_0_16px_rgba(200,169,126,0.6)]"
                        : "bg-[#12241B] text-[#C8A97E] border-[#C8A97E]/50 hover:bg-[#C8A97E] hover:text-[#0B1610]"
                      : isActive
                      ? "bg-[#1B3B2B] text-[#F4F3EE] border-white shadow-[0_0_16px_rgba(27,59,43,0.4)]"
                      : "bg-[#F4F3EE] text-[#1B3B2B] border-[#1B3B2B]/40 hover:bg-[#1B3B2B] hover:text-[#F4F3EE]"
                  }`}
                >
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="font-mono text-sm font-bold leading-none select-none block"
                  >
                    +
                  </motion.span>
                </motion.button>
              </div>

              {/* DESKTOP FLOATING CALLOUT CARD & LEADER LINE (hidden on mobile, rendered below instead) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={`card-${spot.id}`}
                    initial={{ opacity: 0, scale: 0.9, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: prefersReducedMotion ? undefined : "translateZ(48px)",
                    }}
                    className={`hidden md:block absolute z-50 pointer-events-auto select-none ${
                      spot.cardPlacement === "bottom-right"
                        ? "top-10 left-8"
                        : spot.cardPlacement === "top-left"
                        ? "bottom-10 right-8"
                        : spot.cardPlacement === "top-right"
                        ? "bottom-10 left-8"
                        : "top-10 right-8"
                    }`}
                  >
                    {/* SVG Orthogonal Leader Line connecting pin center to card anchor */}
                    <svg
                      className={`absolute pointer-events-none -z-10 overflow-visible ${
                        spot.cardPlacement === "bottom-right"
                          ? "-top-8 -left-6 w-10 h-10"
                          : spot.cardPlacement === "top-left"
                          ? "-bottom-8 -right-6 w-10 h-10"
                          : spot.cardPlacement === "top-right"
                          ? "-bottom-8 -left-6 w-10 h-10"
                          : "-top-8 -right-6 w-10 h-10"
                      }`}
                    >
                      <motion.line
                        x1={
                          spot.cardPlacement === "bottom-right"
                            ? "4"
                            : spot.cardPlacement === "top-left"
                            ? "36"
                            : spot.cardPlacement === "top-right"
                            ? "4"
                            : "36"
                        }
                        y1={
                          spot.cardPlacement === "bottom-right"
                            ? "4"
                            : spot.cardPlacement === "top-left"
                            ? "36"
                            : spot.cardPlacement === "top-right"
                            ? "36"
                            : "4"
                        }
                        x2={
                          spot.cardPlacement === "bottom-right"
                            ? "32"
                            : spot.cardPlacement === "top-left"
                            ? "8"
                            : spot.cardPlacement === "top-right"
                            ? "32"
                            : "8"
                        }
                        y2={
                          spot.cardPlacement === "bottom-right"
                            ? "32"
                            : spot.cardPlacement === "top-left"
                            ? "8"
                            : spot.cardPlacement === "top-right"
                            ? "8"
                            : "32"
                        }
                        stroke={isEvening ? "#C8A97E" : "#1B3B2B"}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </svg>

                    {/* Floating Editorial Card Box */}
                    <div
                      className={`w-[215px] p-3.5 rounded-2xl backdrop-blur-md border shadow-2xl transition-colors duration-500 text-left ${
                        isEvening
                          ? "bg-[#12241B]/95 text-[#F4F3EE] border-[#C8A97E]/30 shadow-[0_16px_36px_rgba(0,0,0,0.65)]"
                          : "bg-[#F4F3EE]/95 text-[#141816] border-[#11261B]/15 shadow-[0_16px_36px_rgba(17,38,27,0.22)]"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-1.5 border-b border-current/10">
                        <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${
                          isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                        }`}>
                          {spot.tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(null)}
                          className="opacity-60 hover:opacity-100 p-0.5 rounded cursor-pointer transition-opacity"
                          aria-label="Dismiss callout"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      <h4 className="font-serif text-sm font-semibold tracking-tight mt-1.5 leading-snug">
                        {spot.title}
                      </h4>
                      <p className={`text-xs mt-0.5 leading-relaxed ${
                        isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                      }`}>
                        {spot.subline}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-current/10 flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full ${
                          isEvening
                            ? "bg-[#C8A97E]/15 text-[#C8A97E]"
                            : "bg-[#1B3B2B]/10 text-[#1B3B2B]"
                        }`}>
                          {spot.metric}
                        </span>

                        <a
                          href="#plates"
                          className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold transition-colors hover:translate-x-0.5 transition-transform ${
                            isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                          }`}
                        >
                          <span>Menu</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* MOBILE FIXED BOTTOM DOCK CARD (<768px): Overlays bottom of image safely without clipping */}
      <div className="md:hidden">
        <AnimatePresence>
          {activeSpotData && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-3 right-3 bottom-3 z-30 pointer-events-auto"
            >
              <div
                className={`p-3.5 rounded-2xl backdrop-blur-md border shadow-xl text-left transition-colors duration-500 ${
                  isEvening
                    ? "bg-[#070F0A]/95 text-[#F4F3EE] border-[#C8A97E]/30"
                    : "bg-[#F4F3EE]/95 text-[#141816] border-[#11261B]/15"
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-current/10">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                    }`} />
                    <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${
                      isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                    }`}>
                      {activeSpotData.tag}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(null)}
                    className="p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Close spotlight"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <h4 className="font-serif text-sm font-semibold tracking-tight">
                    {activeSpotData.title}
                  </h4>
                  <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    isEvening ? "bg-[#C8A97E]/15 text-[#C8A97E]" : "bg-[#1B3B2B]/10 text-[#1B3B2B]"
                  }`}>
                    {activeSpotData.metric}
                  </span>
                </div>

                <p className={`text-xs mt-0.5 leading-relaxed ${
                  isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                }`}>
                  {activeSpotData.subline}
                </p>

                <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-[#A2ADA5]">
                    Tap dish pins above to explore
                  </span>
                  <a
                    href="#plates"
                    className={`inline-flex items-center gap-1 font-mono text-xs font-semibold ${
                      isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                    }`}
                  >
                    <span>Explore in Menu</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// MOBILE THUMB SELECTOR PILL STRIP (Rendered directly under the Hero image on mobile screens <768px)
export function MobileHotspotSelectorStrip({
  activeHotspot,
  onSelectHotspot,
}: {
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}) {
  const { isEvening } = useAmbience();

  return (
    <div className="md:hidden mt-3 w-full flex items-center justify-between gap-1.5 px-1 py-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 overflow-x-auto no-scrollbar">
      {heroHotspots.map((spot) => {
        const isActive = activeHotspot === spot.id;
        return (
          <button
            key={spot.id}
            type="button"
            onClick={() => onSelectHotspot(spot.id)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-mono tracking-wider font-semibold uppercase transition-all duration-300 text-center truncate ${
              isActive
                ? isEvening
                  ? "bg-[#C8A97E] text-[#0B1610] shadow-sm font-bold"
                  : "bg-[#1B3B2B] text-[#F4F3EE] shadow-sm font-bold"
                : isEvening
                ? "text-[#95A79B] hover:text-[#F4F3EE] bg-[#12241B]/60"
                : "text-[#5C645E] hover:text-[#141816] bg-[#EAE8E0]/60"
            }`}
          >
            {spot.shortName}
          </button>
        );
      })}
    </div>
  );
}
