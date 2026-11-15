"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import { Eye, ArrowUpRight } from "lucide-react";
import GalleryModal from "./GalleryModal";
import MagneticButton from "./MagneticButton";
import AmbienceToggle from "./AmbienceToggle";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
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

function Atmosphere() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = useHydratedReducedMotion();

  const zones = [
    { id: "dining", num: "01", label: "Main Dining", image: "/images/atmosphere-dining.jpg", caption: "Main Dining — Hand-cut limestone" },
    { id: "hearth", num: "02", label: "Hearth Counter", image: "/images/gallery-hearth.jpg", caption: "Hearth Counter — 420°C Fruitwood" },
    { id: "courtyard", num: "03", label: "Courtyard", image: "/images/gallery-garden.jpg", caption: "Botanical Courtyard — Living flora" },
  ];

  const currentZone = zones[activeZoneIdx];

  // 1. Self-drawing top horizontal 1px hairline linked to scroll
  const { scrollYProgress: hairlineProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 40%"],
  });
  const topHairlineScaleX = useTransform(hairlineProgress, [0, 1], [0, 1]);
  const crosshairRotate = useTransform(hairlineProgress, [0, 1], [0, 180]);

  // 2. Scroll-Scrubbed Text Illumination & Spec Grid Cascade
  const { scrollYProgress: textProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "start 35%"],
  });
  const specCell1Y = useTransform(textProgress, [0.3, 0.7], isTouchDevice ? [0, 0] : [24, 0]);
  const specCell1Opacity = useTransform(textProgress, [0.3, 0.7], [0.2, 1]);
  const specCell2Y = useTransform(textProgress, [0.45, 0.85], isTouchDevice ? [0, 0] : [24, 0]);
  const specCell2Opacity = useTransform(textProgress, [0.45, 0.85], [0.2, 1]);
  const specCell3Y = useTransform(textProgress, [0.6, 1.0], isTouchDevice ? [0, 0] : [24, 0]);
  const specCell3Opacity = useTransform(textProgress, [0.6, 1.0], [0.2, 1]);

  // 3. Cinematic Curtain-Open Architectural Shutter Unmasking & Counter-Parallax
  const { scrollYProgress: unmaskProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center center"],
  });
  const shutterTopScaleY = useTransform(unmaskProgress, [0, 0.75], [1, 0]);
  const shutterBottomScaleY = useTransform(unmaskProgress, [0, 0.75], [1, 0]);
  const imageScale = useTransform(unmaskProgress, [0, 1], [1.18, 1.0]);
  const imageY = useTransform(
    unmaskProgress,
    [0, 1],
    isTouchDevice ? ["-4%", "4%"] : ["-8%", "8%"]
  );

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <section
        id="atmosphere"
        ref={containerRef}
        className="section-contain py-16 sm:py-20 lg:py-28 overflow-hidden scroll-mt-10 bg-[var(--section-dark)] border-b border-[var(--border-hairline)] transition-colors duration-300 ease-out"
      >
        {/* Self-Drawing Top Horizontal 1px Hairline (Scroll-Linked) */}
        <motion.div
          style={{ scaleX: topHairlineScaleX, transformOrigin: "left" }}
          className="w-full h-[1px] bg-[var(--border-hairline)] will-change-transform"
        />

        {/* Anchor alias for #space */}
        <div id="space" className="absolute -top-10 left-0 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-6">
          
          <div className="relative rounded-xl overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 border border-[#F4F3EE]/12 bg-[#0B1610] text-[#F4F3EE]">
            {/* Ambient decorative glow */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none -z-0"
              style={{ background: "radial-gradient(circle at center, rgba(45,90,67,0.25) 0%, transparent 70%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none -z-0"
              style={{ background: "radial-gradient(circle at center, rgba(200,169,126,0.15) 0%, transparent 70%)" }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* ======================================================== */}
              {/* LEFT COLUMN: ARCHITECTURAL SPEC SHEET + STORY (COLS 1-5) */}
              {/* ======================================================== */}
              <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left space-y-6">
                
                {/* Index Pill with Spinning Crosshair */}
                <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                  <motion.span
                    style={{ rotate: crosshairRotate }}
                    className="text-xs font-mono text-[#C8A97E] font-bold inline-block will-change-transform"
                  >
                    +
                  </motion.span>
                  <span className="font-mono text-xs tracking-[0.2em] text-[#C8A97E] uppercase font-bold">
                    03 — The Dining Room
                  </span>
                </div>

                {/* Warm Ivory Serif Headline */}
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.08] text-[#F4F3EE] tracking-tight">
                  Designed for <em className="italic font-normal text-[#C8A97E]">Slow</em> Evenings.
                </h2>

                {/* Scroll-Scrubbed Word-by-Word Description */}
                <p className="text-sm sm:text-base text-[#F4F3EE]/90 font-normal leading-relaxed max-w-md">
                  <WordReveal
                    text="Every table sculpted from salvaged timber and hand-cut limestone. Bathed in low candlelight and framed by living herb walls."
                    progress={textProgress}
                  />
                </p>

                {/* 3-Cell Spatial Spec Grid with Scroll-Linked Cascade Stagger */}
                <div className="pt-4 border-t border-[#F4F3EE]/12">
                  <div className="grid grid-cols-3 divide-x divide-[#F4F3EE]/12 border border-[#F4F3EE]/12 rounded-lg overflow-hidden bg-white/[0.02]">
                    <motion.div
                      style={{ y: specCell1Y, opacity: specCell1Opacity }}
                      className="p-3 sm:p-4 text-left will-change-[transform,opacity]"
                    >
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        CAPACITY
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        42 Seats
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        + Cellar
                      </div>
                    </motion.div>

                    <motion.div
                      style={{ y: specCell2Y, opacity: specCell2Opacity }}
                      className="p-3 sm:p-4 text-left will-change-[transform,opacity]"
                    >
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        ACOUSTICS
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        Raw Timber
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        & Stone
                      </div>
                    </motion.div>

                    <motion.div
                      style={{ y: specCell3Y, opacity: specCell3Opacity }}
                      className="p-3 sm:p-4 text-left will-change-[transform,opacity]"
                    >
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        LIGHTING
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        2200K
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        Beeswax & Hearth
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Actions: View Gallery (04) & Ambience Switcher */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <MagneticButton
                    onClick={() => setGalleryOpen(true)}
                    data-cursor="magnetic"
                    className="group w-full sm:w-auto px-6 py-3 rounded-full bg-[#C8A97E] hover:bg-[#D9BA8F] text-[#0B1610] text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Explore Space Gallery (04)</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </MagneticButton>

                  <AmbienceToggle variant="atmosphere" className="w-full sm:w-auto" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* RIGHT COLUMN: MULTI-PLANE VIEWPORT (COLS 6-12)           */}
              {/* ======================================================== */}
              <div className="lg:col-span-7 flex justify-center">
                <div
                  className="group relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-xl overflow-hidden border border-[#F4F3EE]/15 transition-colors duration-500 hover:border-[#C8A97E]/50 select-none"
                >
                  {/* Curtain-Open Mask Panels (Slide apart vertically on scroll) */}
                  <motion.div
                    style={{ scaleY: shutterTopScaleY, transformOrigin: "top" }}
                    className="absolute top-0 left-0 right-0 h-1/2 bg-[#11261B] z-20 pointer-events-none will-change-transform"
                  />
                  <motion.div
                    style={{ scaleY: shutterBottomScaleY, transformOrigin: "bottom" }}
                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#11261B] z-20 pointer-events-none will-change-transform"
                  />

                  {/* Internal Parallax Image with Smooth Crossfade */}
                  <div
                    onClick={() => setGalleryOpen(true)}
                    className="relative w-full h-full cursor-pointer"
                    data-cursor="gallery"
                    data-cursor-label="+ EXPAND"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentZone.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: easeCurve }}
                        style={
                          prefersReducedMotion
                            ? {}
                            : {
                                y: imageY,
                                scale: imageScale,
                              }
                        }
                        className="relative w-full h-full min-h-[114%] will-change-transform"
                      >
                        <Image
                          src={currentZone.image}
                          alt={currentZone.caption}
                          fill
                          loading="lazy"
                          decoding="async"
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtle gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/85 via-transparent to-transparent pointer-events-none z-10" />

                    {/* Top-Right Expand Cue */}
                    <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#0B1610]/80 backdrop-blur-md border border-white/10 text-[#F4F3EE] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-[transform,opacity] duration-300 pointer-events-none">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom-Left Room Switcher Pill */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-20 flex items-center gap-1.5 p-1 rounded-full bg-[#0B1610]/90 backdrop-blur-md border border-[#F4F3EE]/20 shadow-xl overflow-x-auto no-scrollbar">
                    {zones.map((zone, idx) => {
                      const isActive = activeZoneIdx === idx;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setActiveZoneIdx(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                            isActive
                              ? "bg-[#C8A97E] text-[#0B1610] font-bold"
                              : "text-[#F4F3EE]/70 hover:text-[#F4F3EE]"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{zone.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Interactive Lightbox Bottom Sheet / Modal */}
      <GalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  );
}

export default React.memo(Atmosphere);
