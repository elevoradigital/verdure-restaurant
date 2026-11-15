"use client";

import React, { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import {
  motion,
  useSpring,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { ArrowRight, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useAmbience } from "@/context/AmbienceContext";

// Non-Stop Infinite Scrolling Marquee Bar (Rock-solid GPU loop, zero gaps)
function ContinuousMarquee() {
  const items = [
    "ORGANIC SOURCING",
    "OPEN-FIRE HEARTH",
    "BOTANICAL CELLAR",
    "PRIVATE CHEF COUNTER",
    "SOIL-HEALTH GASTRONOMY",
    "ZERO-WASTE HARVEST",
  ];

  const renderTrack = () => (
    <div className="flex items-center gap-8 shrink-0 pr-8">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span>{item}</span>
          <span className="opacity-40">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden flex w-full">
      <div className="animate-marquee-scroll flex shrink-0 items-center whitespace-nowrap text-xs font-mono font-medium tracking-wider uppercase opacity-85">
        {renderTrack()}
        {renderTrack()}
      </div>
    </div>
  );
}

export interface HeroDishObject {
  id: string;
  num: string;
  shortName: string;
  name: string;
  category: string;
  price: string;
  image: string;
  hearthTemp: string;
  prep: string;
  badgeTag?: string;
  hotspots: {
    id: string;
    tag: string;
    title: string;
    subline: string;
    metric: string;
    top: string;
    left: string;
    cardPlacement: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  }[];
}

export const heroDishObjects: HeroDishObject[] = [
  {
    id: "hearth-bowl",
    num: "01",
    shortName: "Hearth Bowl",
    name: "Charred Botanical Bowl",
    category: "HEARTH",
    price: "₹650",
    image: "/images/hero-bowl.jpg",
    hearthTemp: "420°C",
    prep: "Charred Botanical & Herb Oil",
    hotspots: [
      {
        id: "01",
        tag: "01 — Harvest",
        title: "Heirloom Micro-Herbs",
        subline: "Picked at dawn daily.",
        metric: "Zero-Kilometer Farm",
        top: "42%",
        left: "38%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 — Extraction",
        title: "Cold-Pressed Basil Oil",
        subline: "Infused over 48 hours.",
        metric: "100% Wild Botanical",
        top: "52%",
        left: "56%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 — Vessel",
        title: "Hand-Thrown Stoneware",
        subline: "Custom matte forest glaze.",
        metric: "Artisan Fired",
        top: "66%",
        left: "34%",
        cardPlacement: "top-right",
      },
    ],
  },
  {
    id: "truffle-tart",
    num: "02",
    shortName: "Truffle Tart",
    name: "Wild Chanterelle Tart",
    category: "FORAGED",
    price: "₹950",
    image: "/images/mushroom-tart.jpg",
    hearthTemp: "380°C",
    prep: "Wild Chanterelle & Black Garlic",
    hotspots: [
      {
        id: "01",
        tag: "01 — Forage",
        title: "Wild Forest Chanterelles",
        subline: "Hand-foraged in Nilgiri mist.",
        metric: "Alpine Forest Sourced",
        top: "38%",
        left: "48%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 — Reduction",
        title: "Aged Black Garlic Glaze",
        subline: "Fermented over 60 days.",
        metric: "House Fermentation",
        top: "56%",
        left: "58%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 — Crust",
        title: "Spelt & Walnut Shell",
        subline: "Stone-ground ancient grains.",
        metric: "Single-Estate Grain",
        top: "68%",
        left: "36%",
        cardPlacement: "top-right",
      },
    ],
  },
  {
    id: "pistachio-gelato",
    num: "03",
    shortName: "Pistachio Gelato",
    name: "Smoked Matcha Gelato",
    category: "CELLAR",
    price: "₹550",
    image: "/images/pistachio-gelato.jpg",
    hearthTemp: "CHILLED",
    prep: "Smoked Matcha & Olive Drop",
    hotspots: [
      {
        id: "01",
        tag: "01 — Roast",
        title: "Sicilian Bronte Pistachio",
        subline: "Slow-roasted stone paste.",
        metric: "D.O.P. Origin",
        top: "40%",
        left: "44%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 — Infusion",
        title: "Ember-Smoked Matcha",
        subline: "Shizuoka ceremonial grade.",
        metric: "Single-Origin Uji",
        top: "55%",
        left: "60%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 — Finish",
        title: "Cold-Pressed Olive Drop",
        subline: "Early harvest pepper note.",
        metric: "First Harvest EVOO",
        top: "66%",
        left: "38%",
        cardPlacement: "top-right",
      },
    ],
  },
];

interface HeroProps {
  onOpenReservation: () => void;
  isReady?: boolean;
}

function Hero({ onOpenReservation, isReady = true }: HeroProps) {
  const { isEvening } = useAmbience();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedDishIdx, setSelectedDishIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>("01");

  const currentDish = heroDishObjects[selectedDishIdx];

  // Desktop Mouse Tilt: spring physics (stiffness: 150, damping: 20)
  const springConfig = {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  };
  const mouseRotateX = useSpring(0, springConfig);
  const mouseRotateY = useSpring(0, springConfig);

  // Direct Hardware-accelerated Sheen coordinates (Zero React Re-Renders)
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);
  const sheenBackground = useMotionTemplate`radial-gradient(circle 350px at ${sheenX}% ${sheenY}%, var(--sheen-light), transparent 60%)`;

  // Scroll-Linked Hero Parallax & Depth Recession
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textColY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textColOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  // Right 3D Stage Scroll-Tilt & Zoom
  const stageScrollY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const stageScrollRotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const stageScrollRotateZ = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const stageScrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const compassScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const crosshairRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const combinedRotateX = useTransform(
    [mouseRotateX, stageScrollRotateX],
    ([mX, sX]) => (isHovered ? (mX as number) : (sX as number))
  );
  const combinedRotateY = useTransform(mouseRotateY, (mY) => (isHovered ? (mY as number) : 0));

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 12;

    mouseRotateX.set(rX);
    mouseRotateY.set(rY);

    sheenX.set((x / rect.width) * 100);
    sheenY.set((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseRotateX.set(0);
    mouseRotateY.set(0);
    sheenX.set(50);
    sheenY.set(50);
  };

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 sm:pt-24 lg:pt-28 pb-0 overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] transition-colors duration-300 ease-out"
    >
      {/* ======================================================== */}
      {/* 1. EXPOSED 1PX ARCHITECTURAL BLUEPRINT GRID & CROSSHAIRS */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Subtle Vertical Blueprint Hairlines */}
        <div className="absolute top-0 bottom-0 left-8 sm:left-12 lg:left-16 w-[1px] border-l border-[var(--border-hairline)] opacity-70" />
        <div className="absolute top-0 bottom-0 right-8 sm:right-12 lg:right-16 w-[1px] border-r border-[var(--border-hairline)] opacity-70" />
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] border-l border-[var(--border-hairline)] opacity-50" />

        {/* Subtle Horizontal Grid Hairlines */}
        <div className="absolute top-28 left-0 right-0 h-[1px] border-t border-[var(--border-hairline)] opacity-70" />
        <div className="absolute bottom-13 left-0 right-0 h-[1px] border-t border-[var(--border-hairline)] opacity-70" />

        {/* Specular Light Pulse Gliding along Hairlines (Native CSS GPU Keyframe) */}
        <div className="absolute top-28 left-0 right-0 h-[1px] pointer-events-none overflow-hidden z-20">
          <div className="animate-hairline-glide w-72 h-full bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent opacity-60" />
        </div>

        {/* Real-Time Sun / Leaf Caustic Shadow Sweep (Zero-CPU Native CSS GPU Keyframe) */}
        <div
          className="ambient-day-only animate-dappled-sweep absolute inset-0 pointer-events-none opacity-[0.08] z-0 overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(ellipse 60% 40% at 30% 20%, rgba(17,38,27,0.85) 0%, transparent 70%),
                              radial-gradient(ellipse 45% 35% at 75% 65%, rgba(17,38,27,0.75) 0%, transparent 60%),
                              radial-gradient(circle 260px at 50% 50%, rgba(17,38,27,0.65) 0%, transparent 70%)`,
          }}
        />

        {/* Real-Time Candlelight / Ember Breathing Glow (Zero-CPU Native CSS GPU Keyframe) */}
        <div
          className="ambient-evening-only animate-hearth-breathe absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle 500px at 65% 45%, rgba(200, 169, 126, 0.35) 0%, transparent 70%)",
          }}
        />

        {/* Architectural Crosshair (+) Intersections — Scroll-Spinning */}
        <motion.span style={{ rotate: crosshairRotate }} className="absolute top-26 left-6 sm:left-10 lg:left-14 font-mono text-xs text-[var(--accent-primary)] opacity-40 inline-block will-change-transform">+</motion.span>
        <motion.span style={{ rotate: crosshairRotate }} className="absolute top-26 right-6 sm:right-10 lg:right-14 font-mono text-xs text-[var(--accent-primary)] opacity-40 inline-block will-change-transform">+</motion.span>
        <motion.span style={{ rotate: crosshairRotate }} className="absolute bottom-15 left-6 sm:left-10 lg:left-14 font-mono text-xs text-[var(--accent-primary)] opacity-40 inline-block will-change-transform">+</motion.span>
        <motion.span style={{ rotate: crosshairRotate }} className="absolute bottom-15 right-6 sm:right-10 lg:right-14 font-mono text-xs text-[var(--accent-primary)] opacity-40 inline-block will-change-transform">+</motion.span>

        {/* Far-Left Rotated Monospace Coordinate Label */}
        <div className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-3 [writing-mode:vertical-lr] rotate-180">
          <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[var(--accent-primary)] opacity-50">
            VERDURE ARCHIVE — 12.9716° N, 77.5946° E
          </span>
          <span className="w-8 h-[1px] bg-[var(--accent-primary)] opacity-30" />
        </div>
      </div>

      {/* Main Structural Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN (COLS 1–7): OVERSIZED EDITORIAL TYPOGRAPHY   */}
          {/* ======================================================== */}
          <motion.div
            style={{
              y: textColY,
              opacity: textColOpacity,
            }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-1 p-6 sm:p-8 lg:p-12 xl:p-14"
          >
            {/* 1. Architectural Index Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease: easeCurve }}
              className="inline-flex items-center justify-center lg:justify-start mb-4 sm:mb-6"
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border-hairline)] text-[10px] sm:text-xs font-mono tracking-widest uppercase font-semibold bg-[var(--bg-surface)] text-[var(--accent-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                <span>No. 01 — Modern Botanical Kitchen</span>
              </div>
            </motion.div>

            {/* 2. Oversized Mixed-Serif Display Headline */}
            <h1 className="font-serif text-[clamp(3.75rem,7vw,7rem)] leading-[0.92] tracking-[-0.03em] font-normal">
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: "105%", rotateZ: 1.5 }}
                  animate={isReady ? { y: "0%", rotateZ: 0 } : {}}
                  transition={{ duration: 0.85, delay: 0.16, ease: easeCurve }}
                  className="block text-[var(--text-primary)]"
                >
                  Taste in
                </motion.span>
              </span>
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: "105%", rotateZ: 1.5 }}
                  animate={isReady ? { y: "0%", rotateZ: 0 } : {}}
                  transition={{ duration: 0.85, delay: 0.28, ease: easeCurve }}
                  className="block"
                >
                  <em className="font-serif italic font-normal text-[var(--accent-primary)] pr-2">
                    Pure
                  </em>
                  <span className="text-[var(--text-primary)]">
                    Form.
                  </span>
                </motion.span>
              </span>
            </h1>

            {/* 3. Refined Editorial Sub-Row with Horizontal Hairline Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isReady ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: easeCurve }}
              className="w-full max-w-xl h-[1px] my-5 sm:my-6 origin-left bg-[var(--border-hairline)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: easeCurve }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl"
            >
              <p className="text-sm sm:text-base leading-relaxed text-center sm:text-left max-w-sm text-[var(--text-muted)]">
                Leaves, roots, and wild mushrooms cooked over applewood embers.
              </p>

              {/* Action Buttons: Primary Magnetic + Secondary with Rotating Arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <MagneticButton
                  onClick={onOpenReservation}
                  data-cursor="magnetic"
                  className="group px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 shadow-md bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary)] text-[var(--bg-canvas)]"
                >
                  <span>Reserve Table</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <a
                  href="#plates"
                  data-cursor="magnetic"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--border-hairline)] hover:border-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] bg-[var(--bg-surface)] text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                  aria-label="Explore menu"
                >
                  <span>Explore Menu</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* 4. Refined Signature Courses Print Index */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55, ease: easeCurve }}
              className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[var(--border-hairline)] max-w-xl"
            >
              <div className="flex items-center justify-between mb-3 text-left">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold flex items-center gap-1.5 text-[var(--accent-primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                  Signature Courses
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Wood-Fired Tasting
                </span>
              </div>

              {/* 3-Plate Horizontal Switcher Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {heroDishObjects.map((dish, idx) => {
                  const isSelected = selectedDishIdx === idx;
                  return (
                    <button
                      key={dish.id}
                      type="button"
                      data-cursor="magnetic"
                      onClick={() => {
                        setSelectedDishIdx(idx);
                        setActiveHotspot(dish.hotspots[0].id);
                      }}
                      className={`relative p-2.5 rounded-lg border text-left transition-colors duration-200 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-[var(--bg-surface)] border-[var(--accent-primary)] shadow-sm"
                          : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-hairline)]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-current/10">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[10px] font-mono leading-none mb-1">
                            <span className={`font-bold ${isSelected ? "text-[var(--accent-primary)]" : "opacity-60"}`}>
                              {dish.num}
                            </span>
                            <span className="font-semibold">{dish.price}</span>
                          </div>
                          <div className={`font-serif text-[12px] sm:text-[13px] leading-tight font-medium truncate ${
                            isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                          }`}>
                            {dish.name}
                          </div>
                        </div>
                      </div>

                      {/* Active indicator border */}
                      {isSelected && (
                        <motion.div
                          layoutId="activeDockPillBorder"
                          className="absolute inset-0 rounded-lg border-2 pointer-events-none border-[var(--accent-primary)]"
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

          </motion.div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN (COLS 8–12): MULTI-PLANE 3D SPATIAL STAGE   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center perspective-[1200px] order-2 my-4 sm:my-0">
            <motion.div
              ref={cardRef}
              data-cursor="hero3d"
              data-cursor-label="TILT VIEW"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={isReady ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.25, ease: easeCurve }}
              style={{
                y: stageScrollY,
                rotateZ: stageScrollRotateZ,
                scale: stageScrollScale,
                rotateX: combinedRotateX,
                rotateY: combinedRotateY,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none aspect-[4/4.2] sm:aspect-[4/3.8] select-none preserve-3d"
            >
              {/* Inner Continuous Idle Ambient Stage (Decoupled from Framer Motion transform) */}
              <div className={`relative w-full h-full preserve-3d ${!isHovered ? "animate-stage-idle" : ""}`}>
                {/* ---------------------------------------------------- */}
                {/* LAYER 0: ROTATING ARCHITECTURAL COMPASS & ORBITAL RINGS */}
                {/* ---------------------------------------------------- */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-25px)",
                  rotate: compassScrollRotate,
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 will-change-transform"
              >
                {/* Outer Ring: Rotating Clockwise (Native CSS Keyframe) */}
                <div
                  className="animate-ring-cw absolute w-[118%] h-[118%] rounded-full border border-[var(--border-hairline)] text-[var(--accent-primary)] opacity-50 pointer-events-none flex items-center justify-center"
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold">0°</span>
                  <span className="absolute top-1/2 -right-4 -translate-y-1/2 font-mono text-[9px] font-bold">90°</span>
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold">180°</span>
                  <span className="absolute top-1/2 -left-4 -translate-y-1/2 font-mono text-[9px] font-bold">270°</span>
                  <span className="absolute top-[14%] right-[14%] font-mono text-[7px] opacity-60">45°</span>
                  <span className="absolute bottom-[14%] right-[14%] font-mono text-[7px] opacity-60">135°</span>
                  <span className="absolute bottom-[14%] left-[14%] font-mono text-[7px] opacity-60">225°</span>
                  <span className="absolute top-[14%] left-[14%] font-mono text-[7px] opacity-60">315°</span>
                </div>

                {/* Inner Dashed Ring: Rotating Counter-Clockwise (Native CSS Keyframe) */}
                <div
                  className="animate-ring-ccw absolute w-[105%] h-[105%] rounded-full border border-dashed border-[var(--border-hairline)] opacity-40 pointer-events-none"
                />

                {/* Deep Offset Architectural Backdrop Slab */}
                <div className="absolute -right-3 -bottom-3 w-full h-full rounded-t-[140px] rounded-b-[28px] -z-20 bg-[var(--bg-surface)] opacity-80" />
              </motion.div>

              {/* ---------------------------------------------------- */}
              {/* LAYER 1: DISH LEVITATION & SCULPTED FRAME            */}
              {/* ---------------------------------------------------- */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: "0 28px 56px -12px rgba(0, 0, 0, 0.45)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="animate-bowl-float relative w-full h-full rounded-t-[140px] rounded-b-[28px] overflow-hidden border border-[var(--border-hairline)] p-1.5 bg-[var(--bg-surface)]"
              >
                {/* Inner Inset Beveled Frame */}
                <div className="relative w-full h-full rounded-t-[132px] rounded-b-[22px] overflow-hidden bg-black/5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDish.id}
                      initial={{ rotateY: 90, scale: 0.88, opacity: 0 }}
                      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                      exit={{ rotateY: -90, scale: 0.88, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.8 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={currentDish.image}
                        alt={currentDish.name}
                        fill
                        priority
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Specular Ambient Sheen (Direct GPU Motion Value) */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: sheenBackground,
                      opacity: isHovered ? 1 : 0.45,
                    }}
                  />

                  {/* Soft Vignette */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Synchronized Pedestal Shadow beneath bowl (Native CSS Keyframe, Zero Blur Matrix) */}
              <div
                className="animate-shadow-breathe absolute -bottom-5 left-1/2 w-4/5 h-8 rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, transparent 70%)",
                }}
              />

              {/* ---------------------------------------------------- */}
              {/* LAYER 1.5: VISIBLE RISING BOTANICAL STEAM (Zero-CPU) */}
              {/* ---------------------------------------------------- */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(20px)",
                }}
                className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-48 h-36 pointer-events-none z-20 overflow-visible"
              >
                {[
                  { id: "1", cls: "animate-steam-1", left: "25%" },
                  { id: "2", cls: "animate-steam-2", left: "50%" },
                  { id: "3", cls: "animate-steam-3", left: "75%" },
                ].map((wisp) => (
                  <svg
                    key={`steam-wisp-${selectedDishIdx}-${wisp.id}`}
                    viewBox="0 0 40 100"
                    className={`absolute top-0 w-8 h-28 ${wisp.cls}`}
                    style={{ left: wisp.left }}
                  >
                    <defs>
                      <linearGradient id={`steam-grad-${selectedDishIdx}-${wisp.id}`} x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor={isEvening ? "#F4F3EE" : "#11261B"} stopOpacity="0" />
                        <stop offset="30%" stopColor={isEvening ? "#F4F3EE" : "#11261B"} stopOpacity="0.5" />
                        <stop offset="70%" stopColor={isEvening ? "#F4F3EE" : "#11261B"} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={isEvening ? "#F4F3EE" : "#11261B"} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 100 Q 12 70 24 50 T 16 10"
                      fill="none"
                      stroke={`url(#steam-grad-${selectedDishIdx}-${wisp.id})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ))}
              </div>

              {/* ---------------------------------------------------- */}
              {/* LAYER 2: INTERACTIVE PULSING 3D HOTSPOTS             */}
              {/* ---------------------------------------------------- */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(35px)",
                }}
                className="absolute inset-0 pointer-events-none z-20"
              >
                {currentDish.hotspots.map((spot) => {
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
                      <div className="relative flex items-center justify-center w-10 h-10">
                        {/* Outer & Inner Sonar Ripple Rings (Native CSS Keyframes) */}
                        {!isActive && (
                          <>
                            <span
                              className="animate-pin-sonar absolute w-6 h-6 rounded-full border border-[var(--accent-primary)] pointer-events-none"
                            />
                            <span
                              className="animate-pin-sonar-inner absolute w-6 h-6 rounded-full border border-[var(--accent-primary)] opacity-70 pointer-events-none"
                            />
                          </>
                        )}

                        <motion.button
                          type="button"
                          data-cursor="magnetic"
                          onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                          animate={{
                            scale: isActive ? 1.15 : isDimmed ? 0.85 : 1,
                            opacity: isDimmed ? 0.4 : 1,
                          }}
                          className={`relative w-6 h-6 rounded-full flex items-center justify-center border shadow-md cursor-pointer transition-colors ${
                            isActive
                              ? "bg-[var(--accent-primary)] text-[var(--bg-canvas)] border-white"
                              : "bg-[var(--bg-surface)] text-[var(--accent-primary)] border-[var(--border-hairline)]"
                          }`}
                        >
                          <motion.span
                            animate={{ rotate: isActive ? 45 : 0 }}
                            className="font-mono text-xs font-bold leading-none block"
                          >
                            +
                          </motion.span>
                        </motion.button>
                      </div>

                      {/* Desktop Callout Card + 1px SVG Leader Line */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            key={`spot-${spot.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                              transformStyle: "preserve-3d",
                              transform: "translateZ(45px)",
                            }}
                            className={`hidden sm:block absolute z-50 pointer-events-auto select-none ${
                              spot.cardPlacement === "bottom-right"
                                ? "top-8 left-8"
                                : spot.cardPlacement === "top-left"
                                ? "bottom-8 right-8"
                                : spot.cardPlacement === "top-right"
                                ? "bottom-8 left-8"
                                : "top-8 right-8"
                            }`}
                          >
                            {/* SVG Leader Line connecting pin to card */}
                            <svg
                              className={`absolute pointer-events-none text-[var(--accent-primary)] opacity-40 ${
                                spot.cardPlacement === "bottom-right"
                                  ? "-top-8 -left-8 w-8 h-8"
                                  : spot.cardPlacement === "top-left"
                                  ? "-bottom-8 -right-8 w-8 h-8"
                                  : spot.cardPlacement === "top-right"
                                  ? "-bottom-8 -left-8 w-8 h-8"
                                  : "-top-8 -right-8 w-8 h-8"
                              }`}
                            >
                              <line
                                x1={spot.cardPlacement.includes("right") ? "0" : "32"}
                                y1={spot.cardPlacement.includes("bottom") ? "0" : "32"}
                                x2={spot.cardPlacement.includes("right") ? "32" : "0"}
                                y2={spot.cardPlacement.includes("bottom") ? "32" : "0"}
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                            </svg>

                            <div className="w-[200px] p-3 rounded-lg border border-[var(--border-hairline)] shadow-md text-left bg-[var(--bg-card)] text-[var(--text-primary)]">
                              <div className="flex items-center justify-between pb-1 border-b border-current/10">
                                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[var(--accent-primary)]">
                                  {spot.tag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveHotspot(null)}
                                  className="opacity-50 hover:opacity-100 cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="font-serif text-xs font-semibold mt-1">
                                {spot.title}
                              </div>
                              <div className="text-[11px] mt-0.5 leading-snug text-[var(--text-muted)]">
                                {spot.subline}
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between text-[9px] font-mono">
                                <span className="px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                                  {spot.metric}
                                </span>
                                <a href="#plates" className="font-semibold underline">Menu →</a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              </div>
            </motion.div>

            {/* Museum-style Caption Strip tucked neatly below the frame */}
            <div className="w-full mt-3.5 pt-2.5 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs font-mono tracking-wide text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                <span className="font-medium text-[var(--text-primary)]">
                  Plate {currentDish.num} — {currentDish.name}, {currentDish.prep} ({currentDish.price})
                </span>
              </div>
              <span className="text-[10px] uppercase opacity-75 hidden sm:inline-block">Wood-Fired Service</span>
            </div>

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FULL-WIDTH 52PX BOTTOM ARCHITECTURAL MARQUEE BAR       */}
      {/* ======================================================== */}
      <div className="w-full h-[52px] border-t border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/90 text-[var(--text-primary)] select-none transition-colors duration-200">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 h-full items-center divide-y md:divide-y-0 md:divide-x divide-[var(--border-hairline)]">
          
          {/* Left Cell: Scroll To Explore Indicator with sliding 1px line (Cols 1-3) */}
          <div className="md:col-span-3 flex items-center justify-between px-6 h-full">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold opacity-75">
              SCROLL TO EXPLORE
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-[1.5px] h-5 bg-current/20 overflow-hidden rounded-full">
                <div className="animate-scroll-line w-full h-full bg-[var(--accent-primary)]" />
              </div>
              <span className="text-xs font-mono">↓</span>
            </div>
          </div>

          {/* Center Cell: Non-Stop Infinite Scrolling Marquee Ticker (Cols 4-8) */}
          <div className="md:col-span-6 overflow-hidden h-full flex items-center relative px-4 sm:px-6">
            <ContinuousMarquee />
          </div>

          {/* Right Cell: Live Booking Trigger (Cols 9-12) */}
          <div className="md:col-span-3 flex items-center justify-between px-6 h-full">
            <a
              href="#reserve"
              data-cursor="magnetic"
              className="w-full flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase">
                  {isEvening ? "TONIGHT: 3 TABLES REMAINING" : "LUNCH: 5 TABLES REMAINING"}
                </span>
              </div>
              <span className="text-xs font-mono inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>RESERVE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}

export default React.memo(Hero);
