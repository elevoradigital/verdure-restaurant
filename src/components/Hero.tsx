"use client";

import React, { useState, useRef, MouseEvent, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useSpring,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { ArrowRight, Flame, X, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

// Isolated Leaf Component for Live Hearth Temperature: Prevents Hero component re-renders
const LiveHearthTemp = React.memo(function LiveHearthTemp({
  baseTemp,
  isEvening,
}: {
  baseTemp: string;
  isEvening: boolean;
}) {
  const isChilled = baseTemp.toLowerCase().includes("chilled");
  const temps = isChilled
    ? ["-4.0°C", "-3.8°C", "-4.2°C", "-3.9°C"]
    : ["418°C", "420°C", "421°C", "419°C"];

  const [tempIdx, setTempIdx] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempIdx((prev) => (prev + 1) % temps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [temps.length]);

  return (
    <div className="flex items-center gap-1.5 font-bold tracking-wider tabular-nums font-mono">
      <span>{isChilled ? "❄ Chilled:" : "🔥 Wood Hearth:"}</span>
      <span className={`px-1.5 py-0.5 rounded transition-colors duration-500 ${
        isEvening ? "text-[#C8A97E] bg-[#C8A97E]/10" : "text-[#11261B] bg-white/40"
      }`}>
        {temps[tempIdx]}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
    </div>
  );
});

// Scroll-Velocity Reactive Marquee Ticker
function VelocityMarquee({
  isHeroInView,
  prefersReducedMotion,
}: {
  isHeroInView: boolean;
  prefersReducedMotion: boolean;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    if (!isHeroInView || prefersReducedMotion) return;

    let moveBy = directionFactor.current * -0.015 * (delta / 16);

    const vFactor = velocityFactor.get();
    if (vFactor < -0.1) {
      directionFactor.current = 1;
    } else if (vFactor > 0.1) {
      directionFactor.current = 1;
    }

    if (Math.abs(vFactor) > 0.05) {
      moveBy += -1 * Math.abs(vFactor) * 0.035 * (delta / 16);
    }

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div
      style={{ x }}
      className="flex items-center gap-8 whitespace-nowrap text-xs font-mono font-medium tracking-wider uppercase opacity-85 will-change-transform"
    >
      <span>✦ ORGANIC SOURCING</span>
      <span>✦ OPEN-FIRE HEARTH</span>
      <span>✦ BOTANICAL CELLAR</span>
      <span>✦ PRIVATE CHEF COUNTER</span>
      <span>✦ SOIL-HEALTH GASTRONOMY</span>
      <span>✦ ZERO-WASTE HARVEST</span>
      <span>✦ ORGANIC SOURCING</span>
      <span>✦ OPEN-FIRE HEARTH</span>
      <span>✦ BOTANICAL CELLAR</span>
      <span>✦ PRIVATE CHEF COUNTER</span>
      <span>✦ SOIL-HEALTH GASTRONOMY</span>
      <span>✦ ZERO-WASTE HARVEST</span>
    </motion.div>
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
  badgeTag: string;
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
    badgeTag: "OBJECT NO. 01 // HEARTH",
    hotspots: [
      {
        id: "01",
        tag: "01 / HARVEST",
        title: "Heirloom Micro-Herbs",
        subline: "Picked at dawn daily.",
        metric: "Zero-Kilometer Farm",
        top: "42%",
        left: "38%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 / EXTRACTION",
        title: "Cold-Pressed Basil Oil",
        subline: "Infused over 48 hours.",
        metric: "100% Wild Botanical",
        top: "52%",
        left: "56%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 / VESSEL",
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
    badgeTag: "OBJECT NO. 02 // FORAGED",
    hotspots: [
      {
        id: "01",
        tag: "01 / FORAGE",
        title: "Wild Forest Chanterelles",
        subline: "Hand-foraged in Nilgiri mist.",
        metric: "Alpine Forest Sourced",
        top: "38%",
        left: "48%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 / REDUCTION",
        title: "Aged Black Garlic Glaze",
        subline: "Fermented over 60 days.",
        metric: "House Fermentation",
        top: "56%",
        left: "58%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 / CRUST",
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
    badgeTag: "OBJECT NO. 03 // CELLAR",
    hotspots: [
      {
        id: "01",
        tag: "01 / ROAST",
        title: "Sicilian Bronte Pistachio",
        subline: "Slow-roasted stone paste.",
        metric: "D.O.P. Origin",
        top: "40%",
        left: "44%",
        cardPlacement: "bottom-right",
      },
      {
        id: "02",
        tag: "02 / INFUSION",
        title: "Ember-Smoked Matcha",
        subline: "Shizuoka ceremonial grade.",
        metric: "Single-Origin Uji",
        top: "55%",
        left: "60%",
        cardPlacement: "bottom-right",
      },
      {
        id: "03",
        tag: "03 / FINISH",
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

export default function Hero({ onOpenReservation, isReady = true }: HeroProps) {
  const { isEvening } = useAmbience();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(sectionRef, { margin: "100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedDishIdx, setSelectedDishIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>("01");
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = useHydratedReducedMotion();

  const currentDish = heroDishObjects[selectedDishIdx];

  // Desktop Mouse Tilt: Damped spring physics tuned for 60-120fps (instant settle, zero dragging)
  const springConfig = {
    stiffness: 220,
    damping: 28,
    mass: 0.5,
    restDelta: 0.005,
    restSpeed: 0.005,
  };
  const mouseRotateX = useSpring(0, springConfig);
  const mouseRotateY = useSpring(0, springConfig);

  // Direct Hardware-accelerated Sheen coordinates (Zero React Re-Renders)
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);
  const sheenBackground = useMotionTemplate`radial-gradient(circle 350px at ${sheenX}% ${sheenY}%, ${
    isEvening ? "rgba(200,169,126,0.32)" : "rgba(255,255,255,0.45)"
  }, transparent ${isEvening ? "65%" : "60%"})`;

  // Scroll-Linked Hero Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textColY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textColOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const bowlScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const bowlParallaxY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  // Mobile scroll-linked 3D perspective tilt
  const mobileRotateX = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const mobileRotateY = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -9;
    const rY = ((x - centerX) / centerX) * 9;

    mouseRotateX.set(rX);
    mouseRotateY.set(rY);

    sheenX.set((x / rect.width) * 100);
    sheenY.set((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice && !prefersReducedMotion) setIsHovered(true);
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
      className={`relative pt-20 sm:pt-24 lg:pt-28 pb-0 overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        isEvening
          ? "bg-[#0B1610] border-[#F4F3EE]/10"
          : "bg-[#F4F3EE] border-[#11261B]/10"
      }`}
    >
      {/* ======================================================== */}
      {/* 1. EXPOSED 1PX ARCHITECTURAL BLUEPRINT GRID & CROSSHAIRS */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Subtle Vertical Blueprint Hairlines */}
        <div className={`absolute top-0 bottom-0 left-8 sm:left-12 lg:left-16 w-[1px] border-l ${
          isEvening ? "border-[#F4F3EE]/[0.07]" : "border-[#11261B]/[0.07]"
        }`} />
        <div className={`absolute top-0 bottom-0 right-8 sm:right-12 lg:right-16 w-[1px] border-r ${
          isEvening ? "border-[#F4F3EE]/[0.07]" : "border-[#11261B]/[0.07]"
        }`} />
        <div className={`hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] border-l ${
          isEvening ? "border-[#F4F3EE]/[0.05]" : "border-[#11261B]/[0.05]"
        }`} />

        {/* Subtle Horizontal Grid Hairlines */}
        <div className={`absolute top-28 left-0 right-0 h-[1px] border-t ${
          isEvening ? "border-[#F4F3EE]/[0.07]" : "border-[#11261B]/[0.07]"
        }`} />
        <div className={`absolute bottom-13 left-0 right-0 h-[1px] border-t ${
          isEvening ? "border-[#F4F3EE]/[0.07]" : "border-[#11261B]/[0.07]"
        }`} />

        {/* Specular Light Pulse Gliding along Hairlines (Every 6s) */}
        {isHeroInView && !prefersReducedMotion && (
          <div className="absolute top-28 left-0 right-0 h-[1px] pointer-events-none overflow-hidden z-20">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "250%" }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 3.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-72 h-full bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent opacity-60 will-change-transform"
            />
          </div>
        )}

        {/* Real-Time Sun / Leaf Caustic Shadow Sweep (Daylight: Swaying Olive Canopy) */}
        {!isEvening && isHeroInView && !prefersReducedMotion && (
          <motion.div
            animate={{
              x: ["-2%", "2%", "-2%"],
              y: ["1%", "-1%", "1%"],
              rotate: [0, 0.5, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.07] z-0 will-change-transform overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(ellipse 60% 40% at 30% 20%, rgba(17,38,27,0.8), transparent 70%),
                                radial-gradient(ellipse 45% 35% at 75% 65%, rgba(17,38,27,0.7), transparent 60%),
                                radial-gradient(circle 250px at 50% 50%, rgba(17,38,27,0.6), transparent 70%)`,
              filter: "blur(28px)",
            }}
          />
        )}

        {/* Real-Time Candlelight / Ember Breathing Glow (Evening: Beeswax Candlelight Halo) */}
        {isEvening && isHeroInView && !prefersReducedMotion && (
          <motion.div
            animate={{
              scale: [0.96, 1.05, 0.98],
              opacity: [0.12, 0.22, 0.14],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none z-0 will-change-transform"
            style={{
              background: "radial-gradient(circle 460px at 65% 45%, rgba(200, 169, 126, 0.25), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}

        {/* Architectural Crosshair (+) Intersections */}
        <span className={`absolute top-26 left-6 sm:left-10 lg:left-14 font-mono text-xs ${
          isEvening ? "text-[#C8A97E]/40" : "text-[#1B3B2B]/40"
        }`}>+</span>
        <span className={`absolute top-26 right-6 sm:right-10 lg:right-14 font-mono text-xs ${
          isEvening ? "text-[#C8A97E]/40" : "text-[#1B3B2B]/40"
        }`}>+</span>
        <span className={`absolute bottom-15 left-6 sm:left-10 lg:left-14 font-mono text-xs ${
          isEvening ? "text-[#C8A97E]/40" : "text-[#1B3B2B]/40"
        }`}>+</span>
        <span className={`absolute bottom-15 right-6 sm:right-10 lg:right-14 font-mono text-xs ${
          isEvening ? "text-[#C8A97E]/40" : "text-[#1B3B2B]/40"
        }`}>+</span>

        {/* Far-Left Rotated Monospace Coordinate Label */}
        <div className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-3 [writing-mode:vertical-lr] rotate-180">
          <span className={`font-mono text-[9px] tracking-[0.28em] uppercase ${
            isEvening ? "text-[#C8A97E]/50" : "text-[#1B3B2B]/50"
          }`}>
            VERDURE ARCHIVE — 12.9716° N, 77.5946° E
          </span>
          <span className={`w-8 h-[1px] ${isEvening ? "bg-[#C8A97E]/30" : "bg-[#1B3B2B]/30"}`} />
        </div>
      </div>

      {/* Main Structural Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN (COLS 1–7): OVERSIZED EDITORIAL TYPOGRAPHY   */}
          {/* ======================================================== */}
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : {
                    y: textColY,
                    opacity: textColOpacity,
                  }
            }
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-1 p-6 sm:p-8 lg:p-12 xl:p-14"
          >
            {/* 1. Architectural Index Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease: easeCurve }}
              className="inline-flex items-center justify-center lg:justify-start mb-4 sm:mb-6"
            >
              <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[10px] sm:text-xs font-mono tracking-widest uppercase font-semibold transition-colors ${
                isEvening
                  ? "bg-[#12241B] border-[#C8A97E]/30 text-[#C8A97E]"
                  : "bg-[#EAE8E0] border-[#11261B]/15 text-[#1B3B2B]"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                  isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                }`} />
                <span>[ ARCHIVE 01 // MODERN BOTANICAL KITCHEN ]</span>
              </div>
            </motion.div>

            {/* 2. Oversized Mixed-Serif Display Headline */}
            <h1 className="font-serif text-[clamp(3.75rem,7vw,7rem)] leading-[0.92] tracking-[-0.03em] font-normal">
              <span className="block overflow-hidden py-1">
                <motion.span
                  initial={{ y: "105%", rotateZ: 1.5 }}
                  animate={isReady ? { y: "0%", rotateZ: 0 } : {}}
                  transition={{ duration: 0.85, delay: 0.16, ease: easeCurve }}
                  className={`block transition-colors duration-700 ${
                    isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                  }`}
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
                  <em className={`font-serif italic font-normal transition-colors duration-700 pr-2 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                  }`}>
                    Pure
                  </em>
                  <span className={`transition-colors duration-700 ${
                    isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                  }`}>
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
              className={`w-full max-w-xl h-[1px] my-5 sm:my-6 origin-left ${
                isEvening ? "bg-[#F4F3EE]/15" : "bg-[#11261B]/15"
              }`}
            />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: easeCurve }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl"
            >
              <p className={`text-sm sm:text-base leading-relaxed text-center sm:text-left max-w-sm transition-colors duration-700 ${
                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
              }`}>
                Seasonal botanical plates sculpted over open fruitwood embers.
              </p>

              {/* Action Buttons: Primary Magnetic + Secondary with Rotating Arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <MagneticButton
                  onClick={onOpenReservation}
                  data-cursor="magnetic"
                  className={`group px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-md ${
                    isEvening
                      ? "bg-[#C8A97E] hover:bg-[#D9BA8F] text-[#0B1610]"
                      : "bg-[#1B3B2B] hover:bg-[#142E21] text-[#F4F3EE]"
                  }`}
                >
                  <span>Reserve Table</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>

                <a
                  href="#plates"
                  data-cursor="magnetic"
                  className={`group inline-flex items-center gap-2 px-5 py-3 rounded-full border text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                    isEvening
                      ? "border-[#F4F3EE]/20 hover:border-[#C8A97E] text-[#F4F3EE] hover:text-[#C8A97E] bg-[#12241B]"
                      : "border-[#11261B]/15 hover:border-[#1B3B2B] text-[#141816] hover:text-[#1B3B2B] bg-[#EAE8E0]"
                  }`}
                  aria-label="Explore menu"
                >
                  <span>Explore Menu</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>

            {/* 4. Interactive 3-Plate Switcher Dock (SELECT TASTING OBJECT) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55, ease: easeCurve }}
              className={`mt-8 sm:mt-10 pt-5 sm:pt-6 border-t max-w-xl transition-colors duration-700 ${
                isEvening ? "border-[#F4F3EE]/10" : "border-[#11261B]/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3 text-left">
                <span className={`text-[10px] font-mono tracking-[0.25em] uppercase font-bold flex items-center gap-1.5 ${
                  isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"}`} />
                  SELECT TASTING OBJECT
                </span>
                <span className={`text-[10px] font-mono ${isEvening ? "text-[#95A79B]" : "text-[#5C645E]"}`}>
                  Interactive Model
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
                      className={`relative p-2 sm:p-2.5 rounded-2xl border text-left transition-colors duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? isEvening
                            ? "bg-[#12241B] border-[#C8A97E]/80 shadow-[0_6px_20px_rgba(200,169,126,0.18)]"
                            : "bg-[#EAE8E0] border-[#1B3B2B]/80 shadow-[0_6px_20px_rgba(27,59,43,0.12)]"
                          : isEvening
                          ? "bg-[#070F0A]/60 border-white/5 hover:border-white/20 text-[#95A79B]"
                          : "bg-white/60 border-black/5 hover:border-black/20 text-[#5C645E]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-current/10">
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
                            <span className={`font-bold ${isSelected ? (isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]") : "opacity-60"}`}>
                              {dish.num}
                            </span>
                            <span className="font-semibold">{dish.price}</span>
                          </div>
                          <div className={`font-serif text-[12px] sm:text-[13px] leading-tight font-medium ${
                            isSelected
                              ? isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                              : isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                          }`}>
                            {dish.name}
                          </div>
                        </div>
                      </div>

                      {/* Active indicator dot and border */}
                      {isSelected && (
                        <>
                          <motion.div
                            layoutId="activeDockPillBorder"
                            className={`absolute inset-0 rounded-2xl border-2 pointer-events-none ${
                              isEvening ? "border-[#C8A97E]" : "border-[#1B3B2B]"
                            }`}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          />
                          <motion.div
                            layoutId="activeDishIndicator"
                            className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                              isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                            }`}
                          />
                        </>
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
              data-cursor-label="✢ TILT 3D"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={isReady ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.25, ease: easeCurve }}
              style={{
                rotateX: prefersReducedMotion
                  ? 0
                  : isTouchDevice
                  ? mobileRotateX
                  : mouseRotateX,
                rotateY: prefersReducedMotion
                  ? 0
                  : isTouchDevice
                  ? mobileRotateY
                  : mouseRotateY,
                scale: prefersReducedMotion ? 1 : bowlScale,
                y: prefersReducedMotion ? 0 : bowlParallaxY,
                transformStyle: "preserve-3d",
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none aspect-[4/4.2] sm:aspect-[4/3.8] select-none preserve-3d"
            >
              {/* ---------------------------------------------------- */}
              {/* LAYER 0: ROTATING BOTANICAL COMPASS RING (translateZ: -25px) */}
              {/* ---------------------------------------------------- */}
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(-25px)",
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
              >
                {/* Slow Rotating Astronomical Ring (360deg over 45s) - Paused off-screen */}
                <motion.div
                  animate={isHeroInView && !prefersReducedMotion ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className={`w-[122%] h-[122%] rounded-full border border-dashed transition-colors duration-700 ${
                    isEvening ? "border-[#C8A97E]/20" : "border-[#1B3B2B]/20"
                  }`}
                >
                  {/* Cardinal Degree Ticks (0°, 90°, 180°, 270°) */}
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold ${
                    isEvening ? "text-[#C8A97E]/60" : "text-[#1B3B2B]/60"
                  }`}>0°</span>
                  <span className={`absolute top-1/2 -right-4 -translate-y-1/2 font-mono text-[9px] font-bold ${
                    isEvening ? "text-[#C8A97E]/60" : "text-[#1B3B2B]/60"
                  }`}>90°</span>
                  <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold ${
                    isEvening ? "text-[#C8A97E]/60" : "text-[#1B3B2B]/60"
                  }`}>180°</span>
                  <span className={`absolute top-1/2 -left-4 -translate-y-1/2 font-mono text-[9px] font-bold ${
                    isEvening ? "text-[#C8A97E]/60" : "text-[#1B3B2B]/60"
                  }`}>270°</span>
                </motion.div>

                {/* Deep Offset Architectural Backdrop Slab */}
                <div className={`absolute -right-4 -bottom-4 w-full h-full rounded-t-[140px] rounded-b-[28px] -z-20 transition-colors duration-700 ${
                  isEvening ? "bg-[#070F0A]/70" : "bg-[#11261B]/12"
                }`} />
              </div>

              {/* ---------------------------------------------------- */}
              {/* LAYER 1: ASYMMETRIC SCULPTED GALLERY FRAME (translateZ: 0px) */}
              {/* Continuous vertical levitation (y: [0, -8, 0]) - Paused off-screen */}
              {/* ---------------------------------------------------- */}
              <motion.div
                animate={isHeroInView && !prefersReducedMotion ? { y: [0, -8, 0] } : { y: 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(0px)",
                  boxShadow: isEvening
                    ? "0 24px 48px -12px rgba(0, 0, 0, 0.7)"
                    : "0 20px 40px -15px rgba(17, 38, 27, 0.2)",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
                className={`relative w-full h-full rounded-t-[140px] rounded-b-[28px] overflow-hidden border p-1.5 transition-colors duration-700 ${
                  isEvening ? "bg-[#12241B] border-[#C8A97E]/30" : "bg-[#EAE8E0] border-[#11261B]/20"
                }`}
              >
                {/* Inner Inset Beveled Frame */}
                <div className="relative w-full h-full rounded-t-[132px] rounded-b-[22px] overflow-hidden bg-black/5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentDish.id}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                      opacity: isHovered ? 1 : 0.4,
                    }}
                  />

                  {/* Soft Vignette */}
                  <div className={`absolute inset-0 pointer-events-none ${
                    isEvening
                      ? "bg-gradient-to-t from-[#0B1610]/70 via-transparent to-transparent"
                      : "bg-gradient-to-t from-[#11261B]/40 via-transparent to-transparent"
                  }`} />
                </div>
              </motion.div>

              {/* ---------------------------------------------------- */}
              {/* LAYER 1.5: LIVE ORGANIC STEAM / AROMA WISPS (translateZ: 20px) */}
              {/* ---------------------------------------------------- */}
              {isHeroInView && !prefersReducedMotion && (
                <>
                  {/* Rising steam for hot hearth dishes (Dish 0 and 1) */}
                  {(selectedDishIdx === 0 || selectedDishIdx === 1) && (
                    <div
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(20px)",
                      }}
                      className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-48 h-36 pointer-events-none z-20 overflow-visible"
                    >
                      {[0, 1, 2].map((wisp) => (
                        <motion.svg
                          key={`steam-wisp-${selectedDishIdx}-${wisp}`}
                          viewBox="0 0 40 100"
                          className="absolute top-0 w-8 h-28"
                          style={{ left: `${25 + wisp * 25}%` }}
                          initial={{ y: 0, opacity: 0, scale: 0.9 }}
                          animate={{
                            y: [0, -38],
                            x: wisp === 1 ? [-4, 6, -2] : [3, -5, 2],
                            opacity: [0, 0.35, 0],
                            scale: [0.9, 1.15],
                          }}
                          transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: wisp * 1.3,
                          }}
                        >
                          <path
                            d="M 20 100 Q 12 70 24 50 T 16 10"
                            fill="none"
                            stroke={isEvening ? "rgba(244, 243, 238, 0.65)" : "rgba(17, 38, 27, 0.45)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            filter="blur(1.5px)"
                          />
                        </motion.svg>
                      ))}
                    </div>
                  )}

                  {/* Downward cool mist halo for Chilled Gelato (Dish 2) */}
                  {selectedDishIdx === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        y: [0, 14, 0],
                        opacity: [0.12, 0.32, 0.12],
                        scale: [0.96, 1.08, 0.96],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full pointer-events-none z-10 blur-xl will-change-transform"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(10px)",
                        background: isEvening
                          ? "radial-gradient(ellipse at center, rgba(162, 173, 165, 0.4), transparent 70%)"
                          : "radial-gradient(ellipse at center, rgba(45, 90, 67, 0.28), transparent 70%)",
                      }}
                    />
                  )}
                </>
              )}

              {/* ---------------------------------------------------- */}
              {/* LAYER 2: INTERACTIVE PULSING 3D HOTSPOTS (translateZ: 35px) */}
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
                        {/* Dual-ring pulse (paused off-screen) */}
                        {!prefersReducedMotion && (
                          <motion.span
                            animate={
                              isHeroInView && !isActive
                                ? { scale: [1, 1.8], opacity: [0.6, 0] }
                                : { opacity: 0 }
                            }
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                            className={`absolute w-6 h-6 rounded-full border pointer-events-none ${
                              isEvening ? "border-[#C8A97E]" : "border-[#1B3B2B]"
                            }`}
                          />
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
                            isEvening
                              ? isActive
                                ? "bg-[#C8A97E] text-[#0B1610] border-white"
                                : "bg-[#12241B] text-[#C8A97E] border-[#C8A97E]/50"
                              : isActive
                              ? "bg-[#1B3B2B] text-[#F4F3EE] border-white"
                              : "bg-[#F4F3EE] text-[#1B3B2B] border-[#1B3B2B]/40"
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
                              className={`absolute pointer-events-none ${
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
                                stroke={isEvening ? "rgba(200, 169, 126, 0.4)" : "rgba(27, 59, 43, 0.4)"}
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                            </svg>

                            <div className={`w-[200px] p-3 rounded-2xl border shadow-xl text-left ${
                              isEvening
                                ? "bg-[#12241B]/[0.98] text-[#F4F3EE] border-[#C8A97E]/30 shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
                                : "bg-[#F4F3EE]/[0.98] text-[#141816] border-[#11261B]/15 shadow-[0_12px_32px_rgba(17,38,27,0.2)]"
                            }`}>
                              <div className="flex items-center justify-between pb-1 border-b border-current/10">
                                <span className={`text-[9px] font-mono tracking-widest uppercase font-bold ${
                                  isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                                }`}>
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
                              <div className={`text-[11px] mt-0.5 leading-snug ${
                                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                              }`}>
                                {spot.subline}
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between text-[9px] font-mono">
                                <span className={`px-1.5 py-0.5 rounded-full ${
                                  isEvening ? "bg-[#C8A97E]/15 text-[#C8A97E]" : "bg-[#1B3B2B]/10 text-[#1B3B2B]"
                                }`}>
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

              {/* ---------------------------------------------------- */}
              {/* LAYER 3: OVERLAPPING FLOATING 3D CARDS (translateZ: 55px) */}
              {/* ---------------------------------------------------- */}
              
              {/* Top-Left Overlapping Frosted Card (-top-4 -left-3 sm:-left-6 max-w-[230px]) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(55px)",
                }}
                className={`absolute -top-4 -left-3 sm:-left-6 z-20 max-w-[230px] pointer-events-auto transition-[opacity,transform] duration-300 ${
                  activeHotspot !== null
                    ? "opacity-20 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                }`}
              >
                <div className={`p-3 sm:p-3.5 rounded-2xl border shadow-xl transition-colors duration-500 text-left ${
                  isEvening
                    ? "bg-[#12241B]/[0.98] text-[#F4F3EE] border-[#C8A97E]/30 shadow-[0_12px_28px_rgba(0,0,0,0.6)]"
                    : "bg-[#F4F3EE]/[0.98] text-[#141816] border-[#11261B]/15 shadow-[0_12px_28px_rgba(17,38,27,0.18)]"
                }`}>
                  <div className={`text-[9px] font-mono tracking-widest uppercase font-bold ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}>
                    {currentDish.badgeTag}
                  </div>
                  <div className="font-serif text-xs sm:text-sm font-semibold mt-0.5">
                    {currentDish.name} • {currentDish.price}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                    <span className="opacity-70">{currentDish.prep}</span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom-Left Overlapping Dark Forest Card (-left-6 bottom-12) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(50px)",
                }}
                className="absolute -left-2 sm:-left-6 bottom-10 sm:bottom-12 z-30 pointer-events-auto"
              >
                <div className={`px-3.5 py-2.5 rounded-2xl shadow-2xl border text-left flex items-center gap-2.5 transition-colors duration-500 ${
                  isEvening
                    ? "bg-[#070F0A] text-[#F4F3EE] border-[#C8A97E]/30"
                    : "bg-[#11261B] text-[#F4F3EE] border-white/10"
                }`}>
                  <div className="p-1.5 rounded-xl bg-white/10">
                    <Flame className="w-3.5 h-3.5 text-[#C8A97E]" />
                  </div>
                  <div className="text-[10px] font-mono">
                    <LiveHearthTemp baseTemp={currentDish.hearthTemp} isEvening={isEvening} />
                    <div className="opacity-70">Zero-Kilometer Harvest</div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom-Right Floating Action Pill (right-4 bottom-4) */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  transform: "translateZ(45px)",
                }}
                className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 z-30 pointer-events-auto"
              >
                <button
                  type="button"
                  data-cursor="magnetic"
                  onClick={onOpenReservation}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border shadow-md text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                    isEvening
                      ? "bg-[#12241B]/[0.98] border-[#C8A97E]/30 text-[#F4F3EE] hover:bg-[#C8A97E] hover:text-[#0B1610]"
                      : "bg-[#F4F3EE]/[0.98] border-[#11261B]/15 text-[#141816] hover:bg-[#1B3B2B] hover:text-[#F4F3EE]"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"
                  }`} />
                  <span>{isEvening ? "● Candlelit Tasting • 6 PM – 11 PM" : "● Daylight Tasting • 12 PM – 4 PM"}</span>
                  <span className="font-bold underline ml-1">Book →</span>
                </button>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FULL-WIDTH 52PX BOTTOM ARCHITECTURAL MARQUEE BAR       */}
      {/* ======================================================== */}
      <div className={`w-full h-[52px] border-t border-b transition-colors duration-700 select-none ${
        isEvening
          ? "border-[#F4F3EE]/10 bg-[#070F0A]/90 text-[#F4F3EE]"
          : "border-[#11261B]/10 bg-[#EAE8E0]/90 text-[#141816]"
      }`}>
        <div className="w-full grid grid-cols-1 md:grid-cols-12 h-full items-center divide-y md:divide-y-0 md:divide-x divide-current/10">
          
          {/* Left Cell: Scroll To Explore Indicator (Cols 1-3) */}
          <div className="md:col-span-3 flex items-center justify-between px-6 h-full">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold opacity-75">
              SCROLL TO EXPLORE
            </span>
            <motion.div
              animate={isHeroInView && !prefersReducedMotion ? { y: [0, 4, 0] } : { y: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs font-mono"
            >
              ↓
            </motion.div>
          </div>

          {/* Center Cell: Velocity-Sensitive Smooth Kinetic Marquee Ticker (Cols 4-8) - Paused off-screen */}
          <div className="md:col-span-6 overflow-hidden h-full flex items-center relative px-4 sm:px-6">
            <VelocityMarquee isHeroInView={isHeroInView} prefersReducedMotion={prefersReducedMotion} />
          </div>

          {/* Right Cell: Live Booking Trigger (Cols 9-12) */}
          <div className="md:col-span-3 flex items-center justify-between px-6 h-full">
            <a
              href="#reserve"
              data-cursor="magnetic"
              className="w-full flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  isEvening ? "bg-[#C8A97E] animate-pulse" : "bg-[#2D5A43] animate-pulse"
                }`} />
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
