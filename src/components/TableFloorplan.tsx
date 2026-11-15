"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

// Isolated Concierge Status Ticker: Prevents parent floorplan re-renders
const LiveConciergeTicker = React.memo(function LiveConciergeTicker({
  isEvening,
}: {
  isEvening: boolean;
}) {
  const messages = [
    "Dining Room Plan Active",
    "Table T-03 Checked In",
    "Hearth Counter: 2 Seats Open",
    "Cellar Vault Reserved",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % messages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-wider transition-colors duration-200 select-none ${
        isEvening
          ? "bg-[#C8A97E]/10 border-[#C8A97E]/25 text-[#C8A97E]"
          : "bg-[#2D5A43]/20 border-[#2D5A43]/35 text-[#88B297]"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="font-semibold">{messages[idx]}</span>
    </div>
  );
});

export interface TableNode {
  id: string;
  number: string;
  name: string;
  zone: "Indoor Dining" | "Chef's Fire Counter" | "Botanical Courtyard";
  capacity: number;
  capacityLabel: string;
  specs: string;
  feature: string;
  x: number;
  y: number;
  shape: "circle" | "rect" | "booth" | "counter" | "large-rect";
  width: number;
  height: number;
  unavailableTimes: string[];
}

export const floorplanTables: TableNode[] = [
  {
    id: "T-01",
    number: "01",
    name: "Window 2-Top",
    zone: "Indoor Dining",
    capacity: 2,
    capacityLabel: "2 Guests",
    specs: "2 Seats — Garden Glass",
    feature: "Unobstructed garden views & acoustic quiet",
    x: 130,
    y: 110,
    shape: "circle",
    width: 44,
    height: 44,
    unavailableTimes: ["Today, 7:30 PM", "Tomorrow, 8:30 PM"],
  },
  {
    id: "T-02",
    number: "02",
    name: "Quiet Corner 2-Top",
    zone: "Indoor Dining",
    capacity: 2,
    capacityLabel: "2 Guests",
    specs: "2 Seats — Intimate Alcove",
    feature: "Tucked behind lime-wash stone pillar",
    x: 270,
    y: 110,
    shape: "circle",
    width: 44,
    height: 44,
    unavailableTimes: ["Today, 8:30 PM", "Saturday, 8:00 PM"],
  },
  {
    id: "T-03",
    number: "03",
    name: "Center Dining Table",
    zone: "Indoor Dining",
    capacity: 4,
    capacityLabel: "4 Guests",
    specs: "4 Seats — Main Room",
    feature: "Direct sightline to culinary kitchen pass",
    x: 180,
    y: 240,
    shape: "rect",
    width: 64,
    height: 44,
    unavailableTimes: ["Today, 8:00 PM", "Today, 7:30 PM", "Tomorrow, 7:30 PM"],
  },
  {
    id: "T-04",
    number: "04",
    name: "Botanical Window Booth",
    zone: "Indoor Dining",
    capacity: 4,
    capacityLabel: "4 Guests",
    specs: "4 Seats — Olive Tree Booth",
    feature: "Curved plush banquette framed by live olive trees",
    x: 330,
    y: 240,
    shape: "booth",
    width: 72,
    height: 48,
    unavailableTimes: ["Tomorrow, 1:00 PM"],
  },
  {
    id: "T-05",
    number: "05",
    name: "Hearth Counter North",
    zone: "Chef's Fire Counter",
    capacity: 2,
    capacityLabel: "2 Guests",
    specs: "2 Seats — Live Embers View",
    feature: "Front-row seats to fruitwood open-fire embers",
    x: 520,
    y: 125,
    shape: "counter",
    width: 80,
    height: 40,
    unavailableTimes: ["Saturday, 8:00 PM", "Today, 8:30 PM"],
  },
  {
    id: "T-06",
    number: "06",
    name: "Plating Station Counter",
    zone: "Chef's Fire Counter",
    capacity: 2,
    capacityLabel: "2 Guests",
    specs: "2 Seats — Plating Theater",
    feature: "Watch head chef plate delicate botanical sauces",
    x: 520,
    y: 225,
    shape: "counter",
    width: 80,
    height: 40,
    unavailableTimes: ["Tomorrow, 7:30 PM"],
  },
  {
    id: "T-07",
    number: "07",
    name: "Courtyard Pergola",
    zone: "Botanical Courtyard",
    capacity: 4,
    capacityLabel: "4 Guests",
    specs: "4 Seats — Open-Air Flora",
    feature: "Surrounded by night-blooming jasmine & herb wall",
    x: 210,
    y: 395,
    shape: "rect",
    width: 66,
    height: 46,
    unavailableTimes: ["Today, 7:30 PM"],
  },
  {
    id: "T-08",
    number: "08",
    name: "Private Cellar Vault",
    zone: "Indoor Dining",
    capacity: 8,
    capacityLabel: "6+ Guests",
    specs: "8 Seats — Vault Chamber",
    feature: "Acoustic private cellar surrounded by 350 natural wines",
    x: 530,
    y: 385,
    shape: "large-rect",
    width: 96,
    height: 52,
    unavailableTimes: ["Sunday, 1:30 PM"],
  },
];

interface TableFloorplanProps {
  selectedTableId: string;
  onSelectTable: (table: TableNode) => void;
  guestCountFilter?: string; // "2 Guests", "4 Guests", etc.
  currentDateTime?: string; // "Today, 8:00 PM"
  onConfirmSelection?: () => void;
}

function TableFloorplan({
  selectedTableId,
  onSelectTable,
  guestCountFilter = "2 Guests",
  currentDateTime = "Today, 8:00 PM",
}: TableFloorplanProps) {
  const { isEvening } = useAmbience();
  const floorplanRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const [activeZone, setActiveZone] = useState<string>("All Spaces");
  const [hoveredTable, setHoveredTable] = useState<TableNode | null>(null);

  // 3D Blueprint Perspective Flattening linked to scroll
  const { scrollYProgress: blueprintScrollProgress } = useScroll({
    target: floorplanRef,
    offset: ["start 90%", "start 35%"],
  });
  const blueprintRotateX = useTransform(
    blueprintScrollProgress,
    [0, 1],
    isTouchDevice ? [0, 0] : [14, 0]
  );
  const blueprintScale = useTransform(blueprintScrollProgress, [0, 1], [0.94, 1]);
  const blueprintY = useTransform(blueprintScrollProgress, [0, 1], [40, 0]);

  const zones = [
    "All Spaces",
    "Indoor Dining",
    "Chef's Fire Counter",
    "Botanical Courtyard",
  ];

  // Number of numeric guests for capacity filtering
  const guestNum = parseInt(guestCountFilter) || 2;

  // Filter tables by Zone
  const visibleTables = floorplanTables.filter((t) => {
    if (activeZone === "All Spaces") return true;
    return t.zone === activeZone;
  });

  // Currently selected table object
  const activeTable =
    floorplanTables.find((t) => t.id === selectedTableId) || floorplanTables[3]; // default T-04

  // Check if a table is booked at current date/time
  const isTableBooked = (table: TableNode) => {
    return table.unavailableTimes.includes(currentDateTime);
  };

  // Check if table fits selected guest count
  const isTableCapacityMatch = (table: TableNode) => {
    if (guestNum <= 2) return table.capacity >= 2;
    if (guestNum <= 4) return table.capacity >= 4;
    return table.capacity >= 6;
  };

  return (
    <motion.div
      ref={floorplanRef}
      style={{
        perspective: 1200,
        rotateX: blueprintRotateX,
        scale: blueprintScale,
        y: blueprintY,
        transformStyle: "preserve-3d",
      }}
      className={`w-full rounded-3xl sm:rounded-[2rem] p-4 sm:p-7 md:p-9 text-[#F4F3EE] border shadow-2xl relative overflow-hidden select-none transition-colors duration-200 will-change-transform ${
        isEvening
          ? "bg-[#0B1610] border-[#C8A97E]/30 [box-shadow:0_24px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(200,169,126,0.12)]"
          : "bg-[#11261B] border-[#F4F3EE]/15 shadow-2xl"
      }`}
    >
      
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F4F3EE 1px, transparent 1px),
            linear-gradient(to bottom, #F4F3EE 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Blueprint Header with Zone Selector Pill Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F4F3EE]/10">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isEvening ? "bg-[#C8A97E]" : "bg-[#6B8E78]"}`} />
              <span className={`font-mono text-xs uppercase tracking-widest font-semibold ${
                isEvening ? "text-[#C8A97E]" : "text-[#6B8E78]"
              }`}>
                {isEvening ? "Candlelit Service — Evening Focus" : "Daylight Service — Afternoon Focus"}
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F4F3EE] font-normal tracking-wide">
              Sanctuary Floorplan
            </h3>
          </div>
          <LiveConciergeTicker isEvening={isEvening} />
        </div>

        {/* Zone Tabs with Framer Motion sliding layoutId pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {zones.map((zone) => {
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                type="button"
                onClick={() => setActiveZone(zone)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? isEvening
                      ? "text-[#0B1610] font-bold"
                      : "text-[#11261B] font-semibold"
                    : "text-[#A2ADA5] hover:text-[#F4F3EE] bg-[#F4F3EE]/5 hover:bg-[#F4F3EE]/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeZonePill"
                    className={`absolute inset-0 rounded-full shadow-sm -z-10 ${
                      isEvening ? "bg-[#C8A97E]" : "bg-[#F4F3EE]"
                    }`}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{zone}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Floorplan Blueprint Canvas Area */}
      <div className={`relative z-10 my-4 w-full aspect-[4/3] sm:aspect-[16/9.5] max-h-[520px] rounded-2xl border overflow-hidden flex items-center justify-center transition-colors duration-200 ${
        isEvening ? "bg-[#070F0A] border-[#C8A97E]/20" : "bg-[#0E1F16] border-[#F4F3EE]/10"
      }`}>
        
        {/* Scalable SVG Floorplan Vector Graphic */}
        <svg
          viewBox="0 0 740 470"
          className="w-full h-full object-contain p-2 sm:p-4 touch-manipulation"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid pattern definition */}
            <pattern
              id="archGrid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(244, 243, 238, 0.05)"
                strokeWidth="1"
              />
            </pattern>
            {/* Hearth Glow Filter */}
            <filter id="emberGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation={isEvening ? "6" : "4"} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Sunlit Sage Glow Filter */}
            <filter id="sunlitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* SVG Background Grid */}
          <rect width="740" height="470" fill="url(#archGrid)" />

          {/* OUTER ARCHITECTURAL PERIMETER WALLS */}
          <rect
            x="40"
            y="35"
            width="660"
            height="400"
            rx="20"
            fill="none"
            stroke="rgba(244, 243, 238, 0.22)"
            strokeWidth="2"
          />

          {/* 1. NORTH: Botanical Glass Wall with Glazing Mullions */}
          <line
            x1="55"
            y1="40"
            x2="430"
            y2="40"
            stroke={!isEvening ? "#88B297" : "#6B8E78"}
            strokeWidth={!isEvening ? "4.5" : "3.5"}
            strokeDasharray="16 4"
            filter={!isEvening ? "url(#sunlitGlow)" : undefined}
          />
          <text
            x="240"
            y="26"
            fill={!isEvening ? "#88B297" : "#6B8E78"}
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="2.5"
            fontWeight={!isEvening ? "bold" : "normal"}
          >
            {!isEvening ? "BOTANICAL GLASS WALL — SUNLIT GARDEN SERVICE" : "BOTANICAL GLASS WALL — NORTH GARDEN VIEW"}
          </text>

          {/* 2. EAST: Open Fire Hearth with Glowing Embers Accent */}
          <motion.path
            d="M 695 80 L 695 280"
            stroke={isEvening ? "#C8A97E" : "#E27D60"}
            strokeWidth={isEvening ? "5.5" : "4"}
            filter="url(#emberGlow)"
            animate={{
              opacity: [0.75, 1, 0.75],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <text
            x="675"
            y="185"
            fill={isEvening ? "#C8A97E" : "#E27D60"}
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
            transform="rotate(90, 675, 185)"
            letterSpacing="2.5"
            fontWeight={isEvening ? "bold" : "normal"}
          >
            {isEvening ? "OPEN FIRE HEARTH — CANDLELIT EMBERS" : "OPEN FIRE HEARTH — LIVE EMBERS"}
          </text>

          {/* Chef's Hearth Counter Divider Wall */}
          <path
            d="M 460 70 L 460 280"
            stroke={isEvening ? "rgba(200, 169, 126, 0.35)" : "rgba(244, 243, 238, 0.2)"}
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* 3. SOUTH-EAST: Wine Cellar Vault Arch */}
          <path
            d="M 440 330 L 685 330"
            stroke={isEvening ? "rgba(200, 169, 126, 0.45)" : "rgba(244, 243, 238, 0.25)"}
            strokeWidth="1.5"
          />
          <path
            d="M 440 330 A 24 24 0 0 1 440 378"
            fill="none"
            stroke={isEvening ? "#C8A97E" : "rgba(244, 243, 238, 0.35)"}
            strokeWidth="2"
          />
          <text
            x="560"
            y="322"
            fill={isEvening ? "#C8A97E" : "#A2ADA5"}
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="2"
            fontWeight={isEvening ? "bold" : "normal"}
          >
            {isEvening ? "NATURAL WINE CELLAR VAULT — SOMMELIER ARCH" : "NATURAL WINE CELLAR VAULT"}
          </text>

          {/* 4. SOUTH-WEST: Courtyard Pergola Boundary */}
          <rect
            x="80"
            y="335"
            width="280"
            height="90"
            rx="12"
            fill={!isEvening ? "rgba(107, 142, 120, 0.08)" : "none"}
            stroke={!isEvening ? "#88B297" : "rgba(107, 142, 120, 0.25)"}
            strokeWidth={!isEvening ? "2" : "1.5"}
            strokeDasharray="4 4"
          />
          <text
            x="220"
            y="326"
            fill={!isEvening ? "#88B297" : "#6B8E78"}
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="2"
            fontWeight={!isEvening ? "bold" : "normal"}
          >
            {!isEvening ? "COURTYARD PERGOLA — OPEN-AIR SUNLIGHT" : "COURTYARD PERGOLA & LIVING HERB WALL"}
          </text>

          {/* 5. SOUTH-CENTER: Main Entrance with Door Swing Arc */}
          <path
            d="M 370 435 A 40 40 0 0 0 410 395"
            fill="none"
            stroke="rgba(244, 243, 238, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <line
            x1="370"
            y1="435"
            x2="410"
            y2="395"
            stroke="rgba(244, 243, 238, 0.6)"
            strokeWidth="2"
          />
          <text
            x="390"
            y="455"
            fill="#A2ADA5"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="2"
          >
            MAIN ENTRANCE
          </text>

          {/* TABLE NODES (T-01 to T-08) */}
          {floorplanTables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isBooked = isTableBooked(table);
            const isVisible = visibleTables.some((vt) => vt.id === table.id);
            const capacityMatch = isTableCapacityMatch(table);
            const isHovered = hoveredTable?.id === table.id;
            const isRecommendedDayTable = !isEvening && (table.id === "T-01" || table.id === "T-07");
            const isRecommendedEveningTable = isEvening && (table.id === "T-04" || table.id === "T-05");

            // Opacity logic
            let nodeOpacity = 1;
            if (!isVisible) nodeOpacity = 0.15;
            else if (isBooked) nodeOpacity = 0.35;
            else if (!capacityMatch) nodeOpacity = 0.5;

            // Fill color
            let fillColor = "#1B3B2B";
            let strokeColor = "rgba(244, 243, 238, 0.2)";
            if (isSelected) {
              fillColor = isEvening ? "#2D5A43" : "#2D5A43";
              strokeColor = isEvening ? "#C8A97E" : "#F4F3EE";
            } else if (isHovered && !isBooked) {
              fillColor = isEvening ? "#2A4535" : "#234C37";
              strokeColor = isEvening ? "#C8A97E" : "#6B8E78";
            } else if (isBooked) {
              fillColor = "#1B221E";
              strokeColor = "rgba(244, 243, 238, 0.1)";
            } else if (isRecommendedEveningTable) {
              fillColor = "#1D3A2C";
              strokeColor = "#C8A97E";
            } else if (isRecommendedDayTable) {
              fillColor = "#1B3B2B";
              strokeColor = "#88B297";
            }

            return (
              <motion.g
                key={table.id}
                initial={{ scale: 0.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: nodeOpacity }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 24,
                  delay: (parseInt(table.number, 10) || 1) * 0.05,
                }}
                data-cursor="tablePin"
                data-cursor-label={isBooked ? "BOOKED" : `SELECT ${table.id}`}
                style={{
                  cursor: isBooked ? "not-allowed" : "pointer",
                  transformOrigin: `${table.x}px ${table.y}px`,
                }}
                onClick={() => {
                  if (!isBooked) {
                    onSelectTable(table);
                  }
                }}
                onMouseEnter={() => setHoveredTable(table)}
                onMouseLeave={() => setHoveredTable(null)}
              >
                {/* 44x44 Minimum Invisible Touch Hitbox Target */}
                <rect
                  x={table.x - 40}
                  y={table.y - 35}
                  width="80"
                  height="70"
                  fill="transparent"
                />

                {/* Gentle breathing halo on available table nodes */}
                {!isBooked && (
                  <motion.circle
                    cx={table.x}
                    cy={table.y}
                    r={table.width / 2 + 5}
                    fill="none"
                    stroke={isEvening ? "#C8A97E" : "#88B297"}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.35, 0.05, 0.35],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (parseInt(table.number, 10) || 0) * 0.3,
                    }}
                    style={{ transformOrigin: `${table.x}px ${table.y}px` }}
                  />
                )}

                {/* Table Shape Representation */}
                {table.shape === "circle" && (
                  <>
                    {/* Surrounding 2 Chairs */}
                    <circle cx={table.x - 28} cy={table.y} r="6" fill="#A2ADA5" opacity="0.4" />
                    <circle cx={table.x + 28} cy={table.y} r="6" fill="#A2ADA5" opacity="0.4" />
                    {/* Main Table */}
                    <circle
                      cx={table.x}
                      cy={table.y}
                      r={table.width / 2}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                  </>
                )}

                {table.shape === "rect" && (
                  <>
                    {/* Surrounding 4 Chairs */}
                    <rect x={table.x - 24} y={table.y - 30} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x + 8} y={table.y - 30} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x - 24} y={table.y + 25} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x + 8} y={table.y + 25} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    {/* Main Table */}
                    <rect
                      x={table.x - table.width / 2}
                      y={table.y - table.height / 2}
                      width={table.width}
                      height={table.height}
                      rx="10"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                  </>
                )}

                {table.shape === "booth" && (
                  <>
                    {/* Curved Booth Backrest Silhouette */}
                    <path
                      d={`M ${table.x - table.width / 2 - 8} ${table.y + table.height / 2 + 4} 
                          C ${table.x - table.width / 2 - 8} ${table.y - table.height / 2 - 12}, 
                            ${table.x + table.width / 2 + 8} ${table.y - table.height / 2 - 12}, 
                            ${table.x + table.width / 2 + 8} ${table.y + table.height / 2 + 4}`}
                      fill="none"
                      stroke="#6B8E78"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                    {/* Main Table */}
                    <rect
                      x={table.x - table.width / 2}
                      y={table.y - table.height / 2}
                      width={table.width}
                      height={table.height}
                      rx="12"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                  </>
                )}

                {table.shape === "counter" && (
                  <>
                    {/* 2 Hearth Stools */}
                    <circle cx={table.x - 20} cy={table.y + 26} r="7" fill="#E27D60" opacity="0.5" />
                    <circle cx={table.x + 20} cy={table.y + 26} r="7" fill="#E27D60" opacity="0.5" />
                    {/* Counter Bar Top */}
                    <rect
                      x={table.x - table.width / 2}
                      y={table.y - table.height / 2}
                      width={table.width}
                      height={table.height}
                      rx="8"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                  </>
                )}

                {table.shape === "large-rect" && (
                  <>
                    {/* 6+ Chairs */}
                    <rect x={table.x - 38} y={table.y - 34} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x - 8} y={table.y - 34} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x + 22} y={table.y - 34} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x - 38} y={table.y + 29} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x - 8} y={table.y + 29} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    <rect x={table.x + 22} y={table.y + 29} width="16" height="5" rx="2" fill="#A2ADA5" opacity="0.4" />
                    {/* Main Table */}
                    <rect
                      x={table.x - table.width / 2}
                      y={table.y - table.height / 2}
                      width={table.width}
                      height={table.height}
                      rx="12"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                    />
                  </>
                )}

                {/* Table Code Label inside Table */}
                <text
                  x={table.x}
                  y={table.y + 4}
                  fill="#F4F3EE"
                  fontSize="12"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {table.id}
                </text>

                {/* Selection Ring Indicator */}
                {isSelected && (
                  <circle
                    cx={table.x}
                    cy={table.y}
                    r={table.width / 2 + 10}
                    fill="none"
                    stroke={isEvening ? "#C8A97E" : "#F4F3EE"}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Day Spotlight Badge (T-01, T-07) */}
                {isRecommendedDayTable && !isSelected && (
                  <g pointerEvents="none">
                    <circle
                      cx={table.x}
                      cy={table.y}
                      r={table.width / 2 + 6}
                      fill="none"
                      stroke="#88B297"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={table.x}
                      y={table.y - 25}
                      fill="#88B297"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      DAYLIGHT
                    </text>
                  </g>
                )}

                {/* Evening Signature Badge (T-04, T-05) */}
                {isRecommendedEveningTable && !isSelected && (
                  <g pointerEvents="none">
                    <circle
                      cx={table.x}
                      cy={table.y}
                      r={table.width / 2 + 6}
                      fill="none"
                      stroke="#C8A97E"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={table.x}
                      y={table.y - 25}
                      fill="#C8A97E"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      EVENING
                    </text>
                  </g>
                )}

                {/* Booked / Reserved Mini Stamp */}
                {isBooked && (
                  <text
                    x={table.x}
                    y={table.y + 17}
                    fill="#E27D60"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    letterSpacing="1"
                  >
                    BOOKED
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Floating Desktop Inspector Card (Appears on Hover) */}
        <AnimatePresence>
          {hoveredTable && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="hidden sm:block absolute z-30 pointer-events-none"
              style={{
                left: `${Math.min(Math.max((hoveredTable.x / 740) * 100, 16), 84)}%`,
                top: `${Math.min(Math.max((hoveredTable.y / 470) * 100 - 22, 10), 75)}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className={`p-3 rounded-2xl backdrop-blur-md border shadow-2xl text-left space-y-1 min-w-[200px] transition-colors duration-200 ${
                isEvening
                  ? "bg-[#070F0A]/95 border-[#C8A97E]/30 text-[#F4F3EE]"
                  : "bg-[#11261B]/95 border-[#F4F3EE]/20 text-[#F4F3EE]"
              }`}>
                <div className="flex items-center justify-between gap-3 pb-1 border-b border-[#F4F3EE]/10">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    isEvening ? "text-[#C8A97E]" : "text-[#6B8E78]"
                  }`}>
                    TABLE {hoveredTable.id}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isEvening ? "bg-[#2D5A43] text-[#F4F3EE]" : "bg-[#1B3B2B] text-[#F4F3EE]"
                  }`}>
                    {hoveredTable.capacityLabel}
                  </span>
                </div>
                <div className="font-serif text-sm text-[#F4F3EE] font-medium leading-snug">
                  {hoveredTable.name}
                </div>
                <div className="text-[11px] text-[#A2ADA5] font-mono">
                  {hoveredTable.specs}
                </div>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                  {isTableBooked(hoveredTable) ? (
                    <span className="text-[#E27D60] font-semibold">Reserved at {currentDateTime.split(", ")[1]}</span>
                  ) : (
                    <span className={`font-semibold flex items-center gap-1 ${
                      isEvening ? "text-[#C8A97E]" : "text-[#6B8E78]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E]" : "bg-[#6B8E78]"}`} />
                      {hoveredTable.id === "T-04" || hoveredTable.id === "T-05"
                        ? isEvening ? "Signature Evening Table" : "Available"
                        : hoveredTable.id === "T-01" || hoveredTable.id === "T-07"
                        ? !isEvening ? "Sunlit Garden Table" : "Available"
                        : "Available"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Table Architectural Summary & Quick Status Bar */}
      <div className="relative z-10 pt-4 pb-2 sm:pb-1 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F4F3EE]/10">
        <div className="flex items-center gap-3 w-full sm:w-auto text-left">
          <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center shrink-0 border transition-colors duration-200 ${
            isEvening
              ? "bg-[#2D5A43] text-[#F4F3EE] border-[#C8A97E]/30"
              : "bg-[#1B3B2B] text-[#F4F3EE] border-[#F4F3EE]/20"
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-tighter opacity-80">TBL</span>
            <span className="font-mono text-sm font-bold leading-none">{activeTable.id}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base text-[#F4F3EE] font-medium">
                {activeTable.name}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isEvening
                  ? "bg-[#12241B] text-[#C8A97E] border-[#C8A97E]/30"
                  : "bg-[#1B3B2B] text-[#6B8E78] border-[#6B8E78]/30"
              }`}>
                {activeTable.zone}
              </span>
            </div>
            <div className="text-xs text-[#A2ADA5] mt-0.5">
              {activeTable.specs} — {activeTable.feature}
            </div>
          </div>
        </div>

        {/* Selected Table Status Badge (Replaces Duplicate Confirm Button) */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-mono uppercase text-[#A2ADA5] tracking-wider leading-tight">
              {isEvening ? "Candlelit Service" : "Daylight Service"}
            </span>
            <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 mt-0.5 ${
              isEvening ? "text-[#C8A97E]" : "text-[#6B8E78]"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E] animate-pulse" : "bg-[#6B8E78] animate-pulse"}`} />
              Locked for {currentDateTime}
            </span>
          </div>

          <div className={`px-4 py-2 rounded-full border text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-2 shrink-0 ${
            isEvening
              ? "bg-[#12241B] border-[#C8A97E]/40 text-[#C8A97E]"
              : "bg-[#11261B] border-[#6B8E78]/40 text-[#EAE8E0]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E]" : "bg-emerald-400"}`} />
            <span>SELECTED: TABLE {activeTable.id}</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Inspector Strip for Touch Screens (<768px) */}
      <div className="block sm:hidden mt-3 pt-3 border-t border-[#F4F3EE]/10 text-center">
        <span className="text-[11px] font-mono text-[#A2ADA5]">
          Tap any table node above to change your exact table
        </span>
      </div>

    </motion.div>
  );
}

export default React.memo(TableFloorplan);
