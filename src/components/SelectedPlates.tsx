"use client";

import React, { useState, useRef, MouseEvent, UIEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useScroll, useTransform, MotionValue } from "framer-motion";
import { DishItem } from "./DishModal";
import { ArrowRight, LayoutGrid, List, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useAmbience } from "@/context/AmbienceContext";
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

interface SelectedPlatesProps {
  onSelectDish: (dish: DishItem) => void;
  onOpenReservation: () => void;
}

const dishPairings: Record<string, { day: string; evening: string }> = {
  "avocado-herb": {
    day: "Cold-Pressed Pairing",
    evening: "Cellar Pour",
  },
  "mushroom-tart": {
    day: "Botanical Tea",
    evening: "Reserve Vintage",
  },
  "pistachio-gelato": {
    day: "Orange Blossom Nectar",
    evening: "Late Harvest Digestif",
  },
  "beet-stracciatella": {
    day: "Garden Infusion",
    evening: "Smoked Elixir",
  },
  "maitake-hearth": {
    day: "Woodland Herbal Brew",
    evening: "Pinot Noir Amphora",
  },
  "botanical-cellar": {
    day: "Sparkling Quince Tonic",
    evening: "Aged Cellar Cordial",
  },
};

const dishesData: DishItem[] = [
  {
    id: "avocado-herb",
    name: "Charred Avocado & Herb Oil",
    category: "Small Plates",
    price: "₹650",
    description: "Heirloom Hass avocado flame-seared over cherry embers, cold-pressed holy basil oil, pickled shallot pearls, toasted coriander crisps.",
    ingredients: ["Heirloom Avocado", "Cold-Pressed Basil Oil", "Pickled Shallot", "Crispy Seed Wafers"],
    pairing: "2023 Gruner Veltliner, Kamptal",
    tags: ["Organic", "Gluten-Free", "Vegan"],
    image: "/images/avocado-herb.jpg",
    preparation: "Open-flame flash sear (30 seconds) over white oak embers",
  },
  {
    id: "mushroom-tart",
    name: "Wild Mushroom Truffle Tart",
    category: "Mains",
    price: "₹950",
    description: "Foraged chanterelles and pine forest morels, aged black garlic purée, fermented cashew cream, laminated sourdough crust.",
    ingredients: ["Foraged Chanterelles", "Black Garlic", "Cashew Crème", "Sourdough Pastry"],
    pairing: "2021 Pinot Noir, Willamette Valley",
    tags: ["Foraged", "Hearth Baked", "House Classic"],
    image: "/images/mushroom-tart.jpg",
    preparation: "Slow wood-fired hearth bake with winter black truffle infusion",
  },
  {
    id: "pistachio-gelato",
    name: "Smoked Pistachio Gelato",
    category: "Cellar",
    price: "₹550",
    description: "Cold-smoked Sicilian bronte pistachio, stone-ground Uji ceremonial matcha dust, fleur de sel, preserved elderflower syrup.",
    ingredients: ["Bronte Pistachio", "Ceremonial Matcha", "Oat-Silk Base", "Fleur de Sel"],
    pairing: "Sparkling Elderberry Botanical Pet-Nat",
    tags: ["Signature Dessert", "Vegan", "Botanical"],
    image: "/images/pistachio-gelato.jpg",
    preparation: "Applewood cold-smoke churned daily at 4°C",
  },
  {
    id: "beet-stracciatella",
    name: "Heirloom Beet & Fig Oil",
    category: "Small Plates",
    price: "₹720",
    description: "Salt-crusted golden and Chioggia beets, whipped almond stracciatella, compressed muskmelon, wild purslane leaves.",
    ingredients: ["Chioggia Beets", "Almond Curd", "Fig Leaf Essence", "Purslane"],
    pairing: "2022 Natural Orange Skin-Contact Malvasia",
    tags: ["Regenerative Farm", "Raw Botanical", "Seasonal"],
    image: "/images/beet-stracciatella.jpg",
    preparation: "Salt-bake in embers followed by ice-shock peeling",
  },
  {
    id: "maitake-hearth",
    name: "Ember-Roasted Maitake Steak",
    category: "Mains",
    price: "₹1,150",
    description: "Cluster maitake mushroom basted in smoked cedar butter, roasted pine nut cream, charred leek ash, wild elderberry reduction glaze.",
    ingredients: ["Wild Maitake", "Pine Nut Cream", "Leek Ash", "Elderberry Glaze"],
    pairing: "2019 Syrah, Northern Rhone",
    tags: ["Hearth Special", "Rich Umami", "Gluten-Free"],
    image: "/images/maitake-hearth.jpg",
    preparation: "Cast-iron sear directly over glowing fruitwood coals",
  },
  {
    id: "botanical-cellar",
    name: "Wild Juniper & Quince Infusion",
    category: "Cellar",
    price: "₹680",
    description: "House-fermented botanical cordial crafted with wild juniper berries, cold-pressed quince, lemon verbena, sparkling spring tonic.",
    ingredients: ["Wild Juniper", "Poached Quince", "Lemon Verbena", "Spring Tonic"],
    pairing: "Served cellar-temperature with rosemary mist",
    tags: ["Cellar Fermentation", "Zero Alcohol", "Botanical"],
    image: "/images/botanical-cellar.jpg",
    preparation: "30-day slow cellar fermentation with mountain herbs",
  },
];

// Single 3D Plate Card for Mode A (3D Grid)
function MotionPlateCard({
  dish,
  index,
  onSelectDish,
  isMobileActive = false,
  scrollShiftY,
}: {
  dish: DishItem;
  index: number;
  onSelectDish: (dish: DishItem) => void;
  isMobileActive?: boolean;
  scrollShiftY?: MotionValue<number>;
}) {
  const { isEvening } = useAmbience();
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = useHydratedReducedMotion();

  const pairingData = dishPairings[dish.id] || { day: "Garden Infusion", evening: "Cellar Pour" };
  const activePairing = isEvening ? pairingData.evening : pairingData.day;

  const springConfig = {
    stiffness: 220,
    damping: 26,
    mass: 0.5,
    restDelta: 0.005,
    restSpeed: 0.005,
  };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;
    rotateX.set(rX);
    rotateY.set(rY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      layout
      data-cursor="plate"
      data-cursor-label="VIEW DISH"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectDish(dish)}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: isTouchDevice ? 0 : rotateX,
        rotateY: isTouchDevice ? 0 : rotateY,
        y: scrollShiftY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative rounded-lg p-5 cursor-pointer flex flex-col justify-between preserve-3d transition-colors duration-200 border bg-[var(--bg-card)] ${
        isMobileActive
          ? "border-[var(--accent-primary)] shadow-sm"
          : "border-[var(--border-hairline)] hover:border-[var(--border-active)]"
      }`}
    >
      {/* 1. Top Row: Monospace number on left, price on right */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10 text-xs font-mono">
        <span className="font-bold text-[var(--accent-primary)]">
          0{index + 1}
        </span>
        <span className="font-semibold text-[var(--text-primary)]">
          {dish.price}
        </span>
      </div>

      {/* 2. Center: Crisp, uncluttered food photograph with subtle zoom & tilt on hover */}
      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden mb-4 bg-[var(--bg-surface)]">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:-rotate-[1.5deg]"
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 33vw, 380px"
        />
      </div>

      {/* 3. Bottom: Roman Serif Title + clean ingredients + plain italic pairing */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-normal tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors duration-200">
            {dish.name}
          </h3>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 ml-2 text-[var(--accent-primary)]" />
        </div>
        <p className="text-xs leading-relaxed line-clamp-1 text-[var(--text-muted)]">
          {dish.ingredients.join(", ")}
        </p>
        <p className="text-[11px] italic pt-1 text-[var(--accent-primary)] opacity-85">
          Paired with: {activePairing}
        </p>
      </div>
    </motion.div>
  );
}

export default function SelectedPlates({
  onSelectDish,
  onOpenReservation,
}: SelectedPlatesProps) {
  const { isEvening } = useAmbience();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "index">("grid");
  const [hoveredIndexDish, setHoveredIndexDish] = useState<DishItem | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Floating cursor follower coordinates for Mode B (Editorial Index)
  const springConfig = {
    stiffness: 350,
    damping: 28,
    restDelta: 0.005,
    restSpeed: 0.005,
  };
  const previewX = useSpring(0, springConfig);
  const previewY = useSpring(0, springConfig);

  const handleIndexMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (viewMode !== "index" || !hoveredIndexDish || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    previewX.set(e.clientX - rect.left + 24);
    previewY.set(e.clientY - rect.top - 80);
  };

  // Scroll Depth across the dish grid section: shifts plates y: [10, -10]
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const plateScrollShiftY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const categories = ["All", "Small Plates", "Mains", "Cellar"];

  const filteredDishes =
    activeCategory === "All"
      ? dishesData
      : dishesData.filter((d) => d.category === activeCategory);

  const handleCarouselScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const cardWidth = el.offsetWidth * 0.82;
    const scrollLeft = el.scrollLeft;
    const newIndex = Math.min(
      Math.max(Math.round(scrollLeft / (cardWidth + 16)), 0),
      filteredDishes.length - 1
    );
    if (newIndex !== activeMobileIndex) {
      setActiveMobileIndex(newIndex);
    }
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth * 0.82;
    carouselRef.current.scrollTo({
      left: index * (cardWidth + 16),
      behavior: "smooth",
    });
    setActiveMobileIndex(index);
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setActiveMobileIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="plates"
      ref={sectionRef}
      onMouseMove={handleIndexMouseMove}
      className="py-16 sm:py-20 lg:py-28 relative scroll-mt-10 overflow-hidden bg-[var(--bg-canvas)] border-b border-[var(--border-hairline)] transition-colors duration-300 ease-out"
    >
      {/* Anchor alias for #menu */}
      <div id="menu" className="absolute -top-10 left-0 pointer-events-none" />

      {/* Oversized Background Watermark */}
      <div className="absolute -right-4 -top-8 pointer-events-none select-none font-serif text-[18vw] font-bold leading-none tracking-tighter opacity-[0.035] -z-0 text-[var(--text-primary)]">
        02
      </div>

      {/* Real-Time Sun / Leaf Caustic Shadow Sweep (Zero-CPU Native CSS Keyframe) */}
      <div
        className="ambient-day-only animate-dappled-sweep absolute inset-0 pointer-events-none opacity-[0.06] z-0 overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 50% at 20% 30%, rgba(17,38,27,0.7) 0%, transparent 70%),
                            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(17,38,27,0.6) 0%, transparent 60%)`,
        }}
      />

      {/* Real-Time Candlelight / Ember Breathing Glow (Zero-CPU Native CSS Keyframe) */}
      <div
        className="ambient-evening-only animate-hearth-breathe absolute inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle 500px at 50% 40%, rgba(200, 169, 126, 0.2) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Architectural Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-8 sm:pb-10 border-b border-[var(--border-hairline)]">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              <span className="text-[var(--accent-primary)]">
                02 — Autumn / Winter Menu
              </span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--text-primary)]"
            >
              Selected Plates
            </motion.h2>
          </div>

          {/* Right Header Controls: Category Filter Pills + View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div
              ref={filterBarRef}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1"
            >
              {categories.map((cat, idx) => {
                const isActive = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.05 }}
                    onClick={() => handleCategorySelect(cat)}
                    type="button"
                    data-cursor="magnetic"
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors shrink-0 cursor-pointer ${
                      isActive
                        ? "text-[var(--bg-canvas)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-hairline)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilterPill"
                        className="absolute inset-0 rounded-full shadow-sm -z-10 bg-[var(--accent-primary)]"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    )}
                    {cat}
                  </motion.button>
                );
              })}
            </div>

            {/* View Mode Toggle: Grid | Index */}
            <div className="hidden md:inline-flex items-center p-1 rounded-full border border-[var(--border-hairline)] text-xs font-mono bg-[var(--bg-surface)] text-[var(--text-muted)]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[var(--accent-primary)] text-[var(--bg-canvas)] font-bold shadow-sm"
                    : "hover:text-current"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("index")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer ${
                  viewMode === "index"
                    ? "bg-[var(--accent-primary)] text-[var(--bg-canvas)] font-bold shadow-sm"
                    : "hover:text-current"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Index</span>
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* MODE A: 3D GRID VIEW (DESKTOP)                      */}
        {/* ---------------------------------------------------- */}
        {viewMode === "grid" ? (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish, idx) => (
                <MotionPlateCard
                  key={dish.id}
                  dish={dish}
                  index={idx}
                  onSelectDish={onSelectDish}
                  scrollShiftY={plateScrollShiftY}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* MODE B: AWWWARDS EDITORIAL INDEX LIST (DESKTOP)      */
          /* ---------------------------------------------------- */
          <div className="hidden md:block pt-8 relative">
            <div className="divide-y divide-[var(--border-hairline)]">
              {filteredDishes.map((dish, idx) => {
                const isHovered = hoveredIndexDish?.id === dish.id;

                return (
                  <div
                    key={dish.id}
                    onMouseEnter={() => setHoveredIndexDish(dish)}
                    onMouseLeave={() => setHoveredIndexDish(null)}
                    onClick={() => onSelectDish(dish)}
                    className="group relative py-6 px-4 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-[var(--bg-card-hover)]/60"
                  >
                    {/* Left: Index + Title with 16px hover shift */}
                    <div className="flex items-center gap-8">
                      <span className="font-mono text-xs font-bold w-8 text-[var(--accent-primary)]">
                        0{idx + 1}
                      </span>

                      <div className="space-y-1">
                        <motion.h3
                          animate={{ x: isHovered ? 16 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className={`font-serif text-2xl font-normal transition-colors duration-200 ${
                            isHovered ? "italic text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                          }`}
                        >
                          {dish.name}
                        </motion.h3>
                        <p className="text-xs font-mono opacity-60 text-[var(--text-muted)]">
                          {dish.ingredients.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Right: Category + Sommelier Pairing + Price */}
                    <div className="flex items-center gap-8 text-right">
                      <div className="hidden lg:block text-xs font-mono opacity-60 text-[var(--text-muted)]">
                        {dishPairings[dish.id] ? (isEvening ? dishPairings[dish.id].evening : dishPairings[dish.id].day) : "Cellar Select"}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold border border-[var(--border-hairline)] text-[var(--text-muted)]">
                        {dish.category}
                      </span>
                      <span className="font-mono text-base font-bold w-20 text-right text-[var(--accent-primary)]">
                        {dish.price}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[transform,opacity] duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cursor-Following Floating 3D Dish Preview Card (GPU-Optimized Solid Surface) */}
            <AnimatePresence>
              {hoveredIndexDish && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    x: previewX,
                    y: previewY,
                    pointerEvents: "none",
                    willChange: "transform",
                  }}
                  className="absolute z-50 w-72 rounded-3xl p-3 border border-[var(--border-hairline)] shadow-xl overflow-hidden will-change-transform bg-[var(--bg-card)]"
                >
                  <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-primary)] shadow-md">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
                      <Image
                        src={hoveredIndexDish.image}
                        alt={hoveredIndexDish.name}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="truncate pr-2">{hoveredIndexDish.name}</span>
                      <span className="text-[var(--accent-primary)]">
                        {hoveredIndexDish.price}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono opacity-70 mt-1 flex items-center gap-1">
                      <span>Click to view details</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MOBILE VIEW: HORIZONTAL SNAP CAROUSEL                */}
        {/* ---------------------------------------------------- */}
        <div className="block md:hidden pt-8">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 pb-4"
          >
            {filteredDishes.map((dish, idx) => (
              <div
                key={dish.id}
                className="w-[82vw] shrink-0 snap-center"
              >
                <MotionPlateCard
                  dish={dish}
                  index={idx}
                  onSelectDish={onSelectDish}
                  isMobileActive={activeMobileIndex === idx}
                />
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {filteredDishes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 cursor-pointer ${
                  activeMobileIndex === idx
                    ? "w-6 bg-[var(--accent-primary)]"
                    : "w-1.5 bg-current/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tasting Menu Banner Card */}
        <div className="mt-14 sm:mt-18 p-8 sm:p-10 rounded-3xl border border-[var(--border-hairline)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[var(--accent-primary)]">
              CURATED TASTING FLIGHT
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl font-medium">
              Eight-Course Autumn Symphony
            </h4>
            <p className="text-xs sm:text-sm max-w-lg text-[var(--text-muted)]">
              Available nightly at the Hearth Counter. Vegetarian, vegan, and bespoke allergic accommodation upon reservation.
            </p>
          </div>

          <MagneticButton
            onClick={onOpenReservation}
            data-cursor="magnetic"
            className="px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 shadow-lg bg-[var(--accent-secondary)] hover:bg-[var(--accent-primary)] text-[var(--bg-canvas)] transition-colors duration-200"
          >
            <span>Reserve Tasting Menu</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </MagneticButton>
        </div>

      </div>
    </section>
  );
}
