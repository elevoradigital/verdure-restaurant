"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

function WordSpan({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.26em] will-change-[opacity,transform]">
      {word}
    </motion.span>
  );
}

function WordReveal({
  text,
  progress,
  className = "",
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min((i + 1.2) / words.length, 1);
        return <WordSpan key={i} word={word} progress={progress} range={[start, end]} />;
      })}
    </span>
  );
}

function FeatureStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useHydratedReducedMotion();

  // 1. Self-drawing top horizontal 1px hairline linked to scroll
  const { scrollYProgress: hairlineScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "start 40%"],
  });
  const topHairlineScaleX = useTransform(hairlineScrollProgress, [0, 1], [0, 1]);
  const crosshairRotate = useTransform(hairlineScrollProgress, [0, 1], [0, 180]);

  // 2. Scroll-Scrubbed Text Illumination
  const { scrollYProgress: textScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 35%"],
  });

  // 3. Continuous section scroll progression for pillar bottom bars
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  const card1Progress = useTransform(sectionProgress, [0.05, 0.45], [0, 1]);
  const card2Progress = useTransform(sectionProgress, [0.2, 0.65], [0, 1]);
  const card3Progress = useTransform(sectionProgress, [0.35, 0.85], [0, 1]);
  const pillarProgresses = [card1Progress, card2Progress, card3Progress];

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
      className="section-contain relative overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] transition-colors duration-300 ease-out"
    >
      {/* 1. Self-Drawing Top Horizontal 1px Hairline (Scroll-Linked) */}
      <motion.div
        style={{ scaleX: topHairlineScaleX, transformOrigin: "left" }}
        className="w-full h-[1px] bg-[var(--border-hairline)] will-change-transform"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Structural Header Bar with Spinning Crosshairs */}
        <div className="flex items-center justify-between py-4 border-b border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <motion.span
              style={{ rotate: crosshairRotate }}
              className="text-xs font-mono text-[var(--accent-primary)] font-bold inline-block will-change-transform"
            >
              +
            </motion.span>
            <span className="tracking-[0.18em] uppercase font-bold text-[var(--text-primary)]">
              01 — Philosophy
            </span>
          </div>
          <span className="tracking-[0.16em] uppercase hidden sm:inline-block font-semibold">
            Zero-Kilometer Sourcing
          </span>
        </div>

        {/* Scroll-Scrubbed Word-by-Word Manifesto Illumination */}
        <div className="py-6 sm:py-8 border-b border-[var(--border-hairline)]">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.25] text-[var(--text-primary)] max-w-4xl">
            <WordReveal
              text="Every course reflects the immediate earth. Zero refrigeration shortcuts, ancient stone hearths, and harvests gathered within forty kilometres."
              progress={textScrollProgress}
            />
          </h2>
        </div>

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
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold transition-colors ${
                        isHovered
                          ? "bg-[var(--accent-primary)] text-[var(--bg-canvas)]"
                          : "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-hairline)]"
                      }`}
                    >
                      {item.num}
                    </span>
                    <span className="font-semibold">{item.tag}</span>
                  </span>

                  {/* Corner Geometric Marker: Scroll-Spinning + Hover Rotate */}
                  <motion.span
                    style={{ rotate: crosshairRotate }}
                    animate={
                      !prefersReducedMotion && isHovered
                        ? { scale: 1.25 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className={`font-mono text-base font-bold select-none text-[var(--accent-primary)] will-change-transform ${
                      isHovered ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    {item.symbol}
                  </motion.span>
                </div>

                {/* Title & Subtitle */}
                <div className="relative z-10 space-y-2">
                  <h3
                    className={`font-serif text-2xl sm:text-3xl font-medium transition-colors ${
                      isHovered ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                    }`}
                  >
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

                  {/* Scroll-Scrubbed Bottom Progress Indicator */}
                  <div className="w-full h-[2px] mt-3 bg-[var(--border-hairline)] rounded-full overflow-hidden">
                    <motion.div
                      style={{
                        scaleX: isHovered ? 1 : pillarProgresses[idx],
                        transformOrigin: "left",
                      }}
                      className="h-full w-full origin-left bg-[var(--accent-primary)] will-change-transform"
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

export default React.memo(FeatureStrip);
