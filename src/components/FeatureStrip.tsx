"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function FeatureStrip() {
  const { isEvening } = useAmbience();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  const features = [
    {
      num: "01",
      tag: "HARVEST",
      symbol: "+",
      title: "Organic Sourcing",
      subtitle: "Regenerative local harvests.",
      desc: "Harvested at dawn from partner farms within forty kilometres of our kitchen.",
    },
    {
      num: "02",
      tag: "EMBER",
      symbol: "+",
      title: "Open Fire Craft",
      subtitle: "Charred over fruitwood embers.",
      desc: "No gas, no induction. Every course is finished over aged applewood and white oak coals.",
    },
    {
      num: "03",
      tag: "INTIMATE",
      symbol: "+",
      title: "Private Dining",
      subtitle: "Intimate chef-led tables.",
      desc: "An eight-seat limestone table behind the cellar arch for unhurried evening tastings.",
    },
  ];

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="pillars"
      ref={sectionRef}
      className={`relative overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        isEvening
          ? "bg-[#0B1610] border-[#F4F3EE]/10"
          : "bg-[#F4F3EE] border-[#11261B]/10"
      }`}
    >
      {/* 1. Self-Drawing Top Horizontal 1px Hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: easeCurve }}
        className={`w-full h-[1px] origin-left transition-colors duration-700 ${
          isEvening ? "bg-[#F4F3EE]/15" : "bg-[#11261B]/15"
        }`}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Structural Header Bar */}
        <div className={`flex items-center justify-between py-4 border-b text-xs font-mono transition-colors duration-700 ${
          isEvening
            ? "border-[#F4F3EE]/10 text-[#95A79B]"
            : "border-[#11261B]/10 text-[#5C645E]"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"}`} />
            <span className="tracking-[0.18em] uppercase font-bold">
              01 — Philosophy
            </span>
          </div>
          <span className="tracking-[0.16em] uppercase hidden sm:inline-block font-semibold">
            Zero-Kilometer Sourcing
          </span>
        </div>

        {/* Interactive Expanding Architectural Strip */}
        <div className="flex flex-col md:flex-row relative divide-y md:divide-y-0 md:divide-x divide-current/10">
          {features.map((item, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.75,
                  delay: 0.15 + idx * 0.12,
                  ease: easeCurve,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex-1 p-6 sm:p-8 lg:p-10 transition-colors duration-500 flex flex-col justify-between cursor-pointer overflow-hidden will-change-transform ${
                  isEvening
                    ? isHovered ? "bg-[#12241B]" : "hover:bg-[#12241B]/60"
                    : isHovered ? "bg-[#EAE8E0]" : "hover:bg-[#EAE8E0]/40"
                }`}
              >
                {/* Subtle Botanical/Hearth Vignette Glow on Hover */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-700 -z-0 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  } ${
                    isEvening
                      ? "bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,169,126,0.12),transparent_70%)]"
                      : "bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,90,67,0.08),transparent_70%)]"
                  }`}
                />

                {/* Header metadata row */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span className={`font-mono text-xs tracking-widest uppercase flex items-center gap-2 transition-colors duration-700 ${
                    isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                  }`}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold transition-colors duration-700 ${
                      isEvening
                        ? isHovered ? "bg-[#C8A97E] text-[#0B1610]" : "bg-[#12241B] text-[#F4F3EE] border border-white/10"
                        : isHovered ? "bg-[#1B3B2B] text-[#F4F3EE]" : "bg-[#EAE8E0] text-[#141816] border border-black/10"
                    }`}>
                      {item.num}
                    </span>
                    <span className="font-semibold">{item.tag}</span>
                  </span>

                  {/* Corner Geometric Marker: Smooth 90deg rotation on hover */}
                  <motion.span
                    animate={
                      !prefersReducedMotion && isHovered
                        ? { rotate: 90, scale: 1.25 }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`font-mono text-base font-bold select-none transition-colors duration-500 ${
                      isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                    } ${isHovered ? "opacity-100" : "opacity-40"}`}
                  >
                    {item.symbol}
                  </motion.span>
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 space-y-2">
                  <h3 className={`font-serif text-2xl sm:text-3xl font-medium transition-colors duration-500 ${
                    isEvening
                      ? isHovered ? "text-[#C8A97E]" : "text-[#F4F3EE]"
                      : isHovered ? "text-[#1B3B2B]" : "text-[#141816]"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm font-medium transition-colors duration-500 ${
                    isEvening ? "text-[#C8A97E]/90" : "text-[#2D5A43]"
                  }`}>
                    {item.subtitle}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed pt-2 transition-colors duration-500 ${
                    isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                  }`}>
                    {item.desc}
                  </p>
                </div>

                {/* Footer metadata & animated progress bar */}
                <div className="relative z-10 mt-6 pt-4 border-t border-current/10">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`opacity-70 ${isEvening ? "text-[#95A79B]" : "text-[#5C645E]"}`}>
                      Autumn Service
                    </span>
                    <span className="font-semibold opacity-60 group-hover:opacity-100 transition-opacity">
                      Read More
                    </span>
                  </div>

                  {/* Animated Bottom Indicator Bar */}
                  <div className="w-full h-[2px] mt-3 bg-current/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full w-full origin-left ${
                        isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
