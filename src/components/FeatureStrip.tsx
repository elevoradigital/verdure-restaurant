"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function FeatureStrip() {
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
      className="relative overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] transition-colors duration-300 ease-out"
    >
      {/* 1. Self-Drawing Top Horizontal 1px Hairline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: easeCurve }}
        className="w-full h-[1px] origin-left bg-[var(--border-hairline)]"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Structural Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: easeCurve }}
          className="flex items-center justify-between py-4 border-b border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)]"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="tracking-[0.18em] uppercase font-bold text-[var(--text-primary)]">
              01 — Philosophy
            </span>
          </div>
          <span className="tracking-[0.16em] uppercase hidden sm:inline-block font-semibold">
            Zero-Kilometer Sourcing
          </span>
        </motion.div>

        {/* Interactive Expanding Architectural Strip */}
        <div className="flex flex-col md:flex-row relative divide-y md:divide-y-0 md:divide-x divide-[var(--border-hairline)]">
          {features.map((item, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.75,
                  delay: 0.1 + idx * 0.12,
                  ease: easeCurve,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex-1 p-6 sm:p-8 lg:p-10 transition-colors duration-200 flex flex-col justify-between cursor-pointer overflow-hidden will-change-transform ${
                  isHovered ? "bg-[var(--bg-card-hover)]" : "bg-transparent hover:bg-[var(--bg-card-hover)]/50"
                }`}
              >
                {/* Subtle Botanical/Hearth Vignette Glow on Hover */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 -z-0 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  } bg-[radial-gradient(ellipse_at_bottom_left,var(--amber-glow),transparent_70%)]`}
                />

                {/* Header metadata row */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-widest uppercase flex items-center gap-2 text-[var(--text-muted)]">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      isHovered
                        ? "bg-[var(--accent-primary)] text-[var(--bg-canvas)]"
                        : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-hairline)]"
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
                    className={`font-mono text-base font-bold select-none text-[var(--accent-primary)] ${
                      isHovered ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    {item.symbol}
                  </motion.span>
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 space-y-2">
                  <h3 className={`font-serif text-2xl sm:text-3xl font-medium transition-colors ${
                    isHovered ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--accent-primary)]">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed pt-2 text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </div>

                {/* Footer metadata & animated progress bar */}
                <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-hairline)]">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="opacity-70 text-[var(--text-muted)]">
                      Autumn Service
                    </span>
                    <span className="font-semibold opacity-60 group-hover:opacity-100 transition-opacity text-[var(--text-primary)]">
                      Read More
                    </span>
                  </div>

                  {/* Animated Bottom Indicator Bar */}
                  <div className="w-full h-[2px] mt-3 bg-[var(--border-hairline)] rounded-full overflow-hidden">
                    <motion.div
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full origin-left bg-[var(--accent-primary)]"
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
