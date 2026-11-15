"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Eye, ArrowUpRight } from "lucide-react";
import GalleryModal from "./GalleryModal";
import MagneticButton from "./MagneticButton";
import AmbienceToggle from "./AmbienceToggle";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function Atmosphere() {
  const { isEvening } = useAmbience();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = useHydratedReducedMotion();

  const zones = [
    { id: "dining", num: "01", label: "Main Dining", image: "/images/atmosphere-dining.jpg", caption: "Main Dining • Hand-cut limestone" },
    { id: "hearth", num: "02", label: "Hearth Counter", image: "/images/gallery-hearth.jpg", caption: "Hearth Counter • 420°C Fruitwood" },
    { id: "courtyard", num: "03", label: "Courtyard", image: "/images/gallery-garden.jpg", caption: "Botanical Courtyard • Living flora" },
  ];

  const currentZone = zones[activeZoneIdx];

  // Internal Scroll Parallax Window
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    isTouchDevice ? ["-3%", "3%"] : ["-7%", "7%"]
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <section
        id="atmosphere"
        ref={containerRef}
        className={`py-16 sm:py-20 lg:py-28 overflow-hidden scroll-mt-10 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
          isEvening
            ? "bg-[#070F0A] border-[#F4F3EE]/10"
            : "bg-[#11261B] border-[#11261B]"
        }`}
      >
        {/* Anchor alias for #space */}
        <div id="space" className="absolute -top-10 left-0 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 border border-[#F4F3EE]/12 bg-[#0B1610] text-[#F4F3EE] shadow-2xl">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D5A43]/20 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C8A97E]/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* ======================================================== */}
              {/* LEFT COLUMN: ARCHITECTURAL SPEC SHEET + STORY (COLS 1-5) */}
              {/* ======================================================== */}
              <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left space-y-6">
                
                {/* Index Pill */}
                <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E] animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.2em] text-[#C8A97E] uppercase font-bold">
                    [ 03 // SPATIAL ARCHITECTURE ]
                  </span>
                </div>

                {/* Warm Ivory Serif Headline */}
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.08] text-[#F4F3EE] tracking-tight">
                  Designed for <em className="italic font-normal text-[#C8A97E]">Slow</em> Evenings.
                </h2>

                {/* Concise 1-Line Description */}
                <p className="text-sm sm:text-base text-[#F4F3EE]/75 font-normal leading-relaxed max-w-md">
                  Every table sculpted from salvaged timber and hand-cut limestone. Bathed in low candlelight and framed by living herb walls.
                </p>

                {/* 3-Cell Spatial Spec Grid with 1px hairlines */}
                <div className="pt-4 border-t border-[#F4F3EE]/12">
                  <div className="grid grid-cols-3 divide-x divide-[#F4F3EE]/12 border border-[#F4F3EE]/12 rounded-2xl overflow-hidden bg-white/[0.02]">
                    <div className="p-3 sm:p-4 text-left">
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        CAPACITY
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        42 Seats
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        + Cellar
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 text-left">
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        ACOUSTICS
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        Raw Timber
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        & Stone
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 text-left">
                      <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase font-bold">
                        LIGHTING
                      </div>
                      <div className="text-xs sm:text-sm font-serif font-medium text-[#F4F3EE] mt-1">
                        2200K
                      </div>
                      <div className="text-[10px] font-mono text-[#F4F3EE]/50 mt-0.5">
                        Beeswax & Hearth
                      </div>
                    </div>
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
              {/* RIGHT COLUMN: MULTI-ANGLE VIEWPORT (COLS 6-12)           */}
              {/* ======================================================== */}
              <div className="lg:col-span-7 flex justify-center">
                <div
                  className="group relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#F4F3EE]/15 shadow-2xl transition-colors duration-500 hover:border-[#C8A97E]/50 select-none"
                >
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
                        className="relative w-full h-full min-h-[114%]"
                      >
                        <Image
                          src={currentZone.image}
                          alt={currentZone.caption}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Subtle gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/85 via-transparent to-transparent pointer-events-none" />

                    {/* Top-Right Expand Cue */}
                    <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-[#0B1610]/80 backdrop-blur-md border border-white/10 text-[#F4F3EE] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-[transform,opacity] duration-300 pointer-events-none">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom-Left Room Switcher Pill (01 Main Dining | 02 Hearth Counter | 03 Courtyard) */}
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
                              ? "bg-[#C8A97E] text-[#0B1610] font-bold shadow-md"
                              : "text-[#F4F3EE]/75 hover:text-[#F4F3EE] hover:bg-white/5"
                          }`}
                        >
                          <span className={isActive ? "text-[#0B1610]" : "text-[#C8A97E]"}>
                            {zone.num}
                          </span>
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
