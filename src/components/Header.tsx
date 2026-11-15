"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Calendar, Phone, ArrowRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";
import AmbienceToggle from "./AmbienceToggle";
import { useAmbience } from "@/context/AmbienceContext";

interface HeaderProps {
  onOpenReservation: () => void;
}

function AudioEqualizerPill({
  isPlaying,
  isEvening,
  onToggle,
}: {
  isPlaying: boolean;
  isEvening: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-cursor="magnetic"
      title={isPlaying ? "Mute garden soundscape" : "Listen to live garden soundscape"}
      className={`h-9 px-2.5 rounded-full border transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
        isEvening
          ? isPlaying
            ? "bg-[#C8A97E]/15 text-[#C8A97E] border-[#C8A97E]/30"
            : "bg-[#12241B] text-[#95A79B] hover:text-[#F4F3EE] border-[#F4F3EE]/10"
          : isPlaying
          ? "bg-[#1B3B2B]/10 text-[#1B3B2B] border-[#1B3B2B]/20"
          : "bg-[#EAE8E0]/70 text-[#5C645E] hover:text-[#141816] border-[#11261B]/10 hover:bg-[#EAE8E0]"
      }`}
      aria-label="Toggle live sound equalizer"
    >
      <div className="flex items-center gap-[2px] h-3.5 w-3.5 justify-center">
        {[
          { duration: 0.9, delay: 0 },
          { duration: 1.2, delay: 0.15 },
          { duration: 0.8, delay: 0.3 },
          { duration: 1.05, delay: 0.2 },
        ].map((bar, i) => (
          <motion.span
            key={i}
            animate={
              isPlaying
                ? {
                    scaleY: [0.2, 1, 0.35, 0.85, 0.2],
                    transition: {
                      duration: bar.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: bar.delay,
                    },
                  }
                : { scaleY: 0.2 }
            }
            style={{ transformOrigin: "bottom" }}
            className={`w-[2px] h-3 rounded-full transition-colors ${
              isEvening
                ? isPlaying
                  ? "bg-[#C8A97E]"
                  : "bg-[#95A79B]"
                : isPlaying
                ? "bg-[#1B3B2B]"
                : "bg-[#5C645E]"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[9px] uppercase tracking-wider font-semibold hidden xl:inline-block">
        {isPlaying ? "LIVE" : "MUTE"}
      </span>
    </button>
  );
}

export default function Header({ onOpenReservation }: HeaderProps) {
  const { isEvening } = useAmbience();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("plates");

  // Top 2px Scroll Progress Bar with luxury spring physics
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let lastCheckedPos = 0;
    let ticking = false;

    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 40);

      // Throttled section spy: run only when scrolled >= 60px to prevent mobile layout thrashing
      if (Math.abs(latest - lastCheckedPos) < 60) return;
      lastCheckedPos = latest;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sectionMapping = [
            { id: "plates", alias: "menu" },
            { id: "atmosphere", alias: "space" },
            { id: "pillars", alias: "story" },
            { id: "reserve", alias: "reserve" },
          ];

          for (const sec of sectionMapping) {
            const el = document.getElementById(sec.id) || document.getElementById(sec.alias);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 260 && rect.bottom >= 180) {
                setActiveSection(sec.id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }, [scrollY]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: "plates", index: "01", label: "Menu", href: "#plates", subtitle: "Curated Autumn Tasting" },
    { id: "atmosphere", index: "02", label: "Space", href: "#atmosphere", subtitle: "The Candlelit Dining Room" },
    { id: "pillars", index: "03", label: "Story", href: "#pillars", subtitle: "Philosophies & Reserve" },
  ];

  const toggleAmbience = () => {
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  return (
    <>
      {/* 1. Top Fixed 2px Scroll Progress Bar in Botanical Sage #2D5A43 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#2D5A43] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* 2. Smart Architectural Structural Grid Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
          isEvening
            ? isScrolled
              ? "border-[#F4F3EE]/15 bg-[#0B1610]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
              : "border-[#F4F3EE]/10 bg-[#0B1610]/85 backdrop-blur-sm"
            : isScrolled
            ? "border-[#11261B]/15 bg-[#F4F3EE]/95 backdrop-blur-md shadow-[0_8px_30px_rgba(17,38,27,0.06)]"
            : "border-[#11261B]/10 bg-[#F4F3EE]/85 backdrop-blur-sm"
        }`}
      >
        <div className="w-full">
          {/* Desktop 4-Cell Structural Grid (>=md) */}
          <div className="hidden md:grid md:grid-cols-12 items-stretch h-16">
            
            {/* Cell 1: Wordmark + Live Status Dot (Cols 1-4) */}
            <div className={`col-span-3 xl:col-span-4 flex items-center justify-between px-4 lg:px-6 xl:px-8 border-r transition-colors duration-700 ${
              isEvening ? "border-[#F4F3EE]/12" : "border-[#11261B]/12"
            }`}>
              <Link
                href="#"
                data-cursor="magnetic"
                className="group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3B2B] rounded-sm shrink-0"
              >
                <span className={`font-serif text-2xl lg:text-3xl font-bold tracking-[0.18em] transition-colors duration-300 ${
                  isEvening ? "text-[#F4F3EE] group-hover:text-[#C8A97E]" : "text-[#141816] group-hover:text-[#1B3B2B]"
                }`}>
                  VERDURE
                </span>
                <span className={`inline-block w-1.5 h-1.5 rounded-full self-baseline mt-1 ml-0.5 opacity-80 ${
                  isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"
                }`} />
              </Link>

              {/* Monospace Live Status Pill */}
              <div className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-colors ${
                isEvening
                  ? "bg-[#12241B] border-[#C8A97E]/30 text-[#C8A97E]"
                  : "bg-[#EAE8E0] border-[#11261B]/15 text-[#1B3B2B]"
              }`}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"
                  }`} />
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                    isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                  }`} />
                </span>
                <span>OPEN TODAY — 12 PM – 11 PM</span>
              </div>
            </div>

            {/* Cell 2: Architectural Navigation Links with 01, 02, 03 */}
            <div className={`col-span-4 xl:col-span-3 flex items-center justify-center gap-4 lg:gap-6 xl:gap-8 px-2 lg:px-4 border-r transition-colors duration-700 ${
              isEvening ? "border-[#F4F3EE]/12" : "border-[#11261B]/12"
            }`}>
              <nav className="flex items-center gap-4 lg:gap-6 xl:gap-8 h-full">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      data-cursor="magnetic"
                      className="relative h-full flex items-center gap-1.5 px-1.5 lg:px-2 group cursor-pointer"
                    >
                      <span className={`font-mono text-[10px] opacity-50 group-hover:opacity-100 transition-opacity ${
                        isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                      }`}>
                        {link.index}
                      </span>
                      <span className={`text-xs lg:text-sm font-medium tracking-wide relative inline-block overflow-hidden h-[1.3em] leading-none ${
                        isActive
                          ? isEvening ? "text-[#F4F3EE] font-semibold" : "text-[#141816] font-semibold"
                          : isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                      }`}>
                        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                          {link.label}
                        </span>
                        <span className={`absolute top-full left-0 block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full font-medium ${
                          isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                        }`}>
                          {link.label}
                        </span>
                      </span>

                      {/* Active Section Underline Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSectionNav"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                            isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                          }`}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Cell 3: Ambience Mode Toggle + Live Audio Equalizer (Cols 8-10) */}
            <div className={`col-span-3 xl:col-span-3 flex items-center justify-center gap-2 lg:gap-3 px-2 lg:px-4 border-r transition-colors duration-700 ${
              isEvening ? "border-[#F4F3EE]/12" : "border-[#11261B]/12"
            }`}>
              <AmbienceToggle variant="navbar" className="shrink-0" />

              <AudioEqualizerPill
                isPlaying={isAmbientPlaying}
                isEvening={isEvening}
                onToggle={toggleAmbience}
              />
            </div>

            {/* Cell 4: High-Contrast Magnetic CTA Button (Cols 11-12) */}
            <div className="col-span-2 xl:col-span-2 flex items-center justify-center px-2 lg:px-4">
              <MagneticButton
                onClick={onOpenReservation}
                data-cursor="magnetic"
                className={`group w-full max-w-[155px] py-2 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-1.5 ${
                  isEvening
                    ? "bg-[#C8A97E] hover:bg-[#D9BA8F] text-[#0B1610]"
                    : "bg-[#1B3B2B] hover:bg-[#142E21] text-[#F4F3EE]"
                }`}
              >
                <span>Book a Table</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-current" />
              </MagneticButton>
            </div>

          </div>

          {/* Mobile Structural Header (<md) */}
          <div className="flex md:hidden items-center justify-between px-4 sm:px-6 h-14">
            <Link
              href="#"
              data-cursor="magnetic"
              className="flex items-center gap-2"
            >
              <span className={`font-serif text-xl font-bold tracking-[0.16em] ${
                isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
              }`}>
                VERDURE
              </span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"
              }`} />
            </Link>

            <div className="flex items-center gap-2">
              <AmbienceToggle variant="compact" />

              <button
                onClick={onOpenReservation}
                type="button"
                className={`text-xs font-semibold px-3 py-1.5 rounded-full text-[#F4F3EE] tracking-wide active:scale-95 transition-colors shadow-sm ${
                  isEvening ? "bg-[#2D5A43]" : "bg-[#1B3B2B]"
                }`}
              >
                Reserve
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className={`p-2 rounded-full border active:scale-90 transition-transform ${
                  isEvening
                    ? "bg-[#12241B] text-[#F4F3EE] border-[#F4F3EE]/15"
                    : "bg-[#EAE8E0] text-[#141816] border-[#11261B]/10"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 3. Choreographed Full-Screen Deep Forest Green Mobile Menu Drawer (#11261B, 100dvh) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-50 md:hidden flex flex-col justify-between p-6 h-[100dvh] pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isEvening ? "bg-[#070F0A] text-[#F4F3EE]" : "bg-[#11261B] text-[#F4F3EE]"
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#F4F3EE]/15">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-[0.18em] text-[#F4F3EE]">
                  VERDURE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E78]" />
              </div>
              <div className="flex items-center gap-2">
                <AudioEqualizerPill
                  isPlaying={isAmbientPlaying}
                  isEvening={isEvening}
                  onToggle={toggleAmbience}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-full bg-[#1B3B2B] text-[#F4F3EE] border border-[#F4F3EE]/20 active:scale-90 transition-transform"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Staggered Large Editorial Serif Nav Links */}
            <nav className="my-auto py-4 flex flex-col gap-3">
              {/* Mobile Drawer Ambience Switcher Card */}
              <div className="pb-2">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A2ADA5] mb-2 font-semibold">
                  Service Ambience Atmosphere
                </span>
                <AmbienceToggle variant="drawer" />
              </div>

              {navLinks.map((link, idx) => (
                <div key={link.id} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ y: "115%", rotateZ: 2 }}
                    animate={{ y: "0%", rotateZ: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.12 + idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-center justify-between py-2 border-b border-[#F4F3EE]/10"
                  >
                    <div>
                      <div className="font-serif text-3xl sm:text-4xl text-[#F4F3EE] group-active:text-[#6B8E78] transition-colors">
                        {link.label}
                      </div>
                      <div className="text-[11px] font-mono text-[#A2ADA5] tracking-wider uppercase mt-0.5">
                        {link.subtitle}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6B8E78] group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              ))}

              {/* Direct Booking Link in Navigation */}
              <div className="overflow-hidden pt-2">
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReservation();
                  }}
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full py-4 px-6 rounded-full bg-[#F4F3EE] text-[#11261B] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform mt-2"
                >
                  <Calendar className="w-4 h-4 text-[#1B3B2B]" />
                  <span>Reserve Table</span>
                </motion.button>
              </div>
            </nav>

            {/* Bottom Info Strip & Social */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="pt-6 border-t border-[#F4F3EE]/15 space-y-3"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#A2ADA5]">
                <span>Hours: Tue – Sun 12:30 – 23:30</span>
                <span>Bengaluru</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A2ADA5]">
                <a
                  href="tel:+919845012844"
                  className="flex items-center gap-1.5 hover:text-[#F4F3EE]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#6B8E78]" />
                  <span>+91 98450 12844</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B8E78] hover:text-[#F4F3EE]"
                >
                  @verdure.culinary
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
