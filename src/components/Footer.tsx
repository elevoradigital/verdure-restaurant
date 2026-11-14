"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Send,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Sun,
  Moon,
  Clock,
  Car,
} from "lucide-react";
import { useAmbience } from "@/context/AmbienceContext";

export default function Footer() {
  const { isEvening, toggleAmbience } = useAmbience();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-60px 0px" });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isArrowHovered, setIsArrowHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const prefersReducedMotion = useReducedMotion();

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const istString = now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setCurrentTime(istString);
      } catch {
        const now = new Date();
        setCurrentTime(now.toTimeString().split(" ")[0]);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const easeCurve = [0.22, 1, 0.36, 1] as const;

  return (
    <footer
      ref={footerRef}
      className={`relative pt-12 pb-8 overflow-hidden transition-colors duration-700 ${
        isEvening ? "bg-[#070F0A] text-[#F4F3EE]" : "bg-[#EAE8E0] text-[#141816]"
      }`}
    >
      {/* Top Self-Drawing 1px Architectural Border with Crosshairs */}
      <div className="relative w-full">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.95, ease: easeCurve }}
          className={`w-full h-[1px] origin-left transition-colors duration-700 ${
            isEvening ? "bg-white/10" : "bg-[#11261B]/15"
          }`}
        />
        <span
          className={`absolute left-4 -top-2.5 font-mono text-[10px] select-none pointer-events-none transition-colors duration-700 ${
            isEvening ? "text-white/30" : "text-[#11261B]/30"
          }`}
        >
          +
        </span>
        <span
          className={`absolute right-4 -top-2.5 font-mono text-[10px] select-none pointer-events-none transition-colors duration-700 ${
            isEvening ? "text-white/30" : "text-[#11261B]/30"
          }`}
        >
          +
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Section Header Tag */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10px] uppercase tracking-widest font-semibold transition-colors duration-700 ${
                isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
              }`}
            >
              [ 01 // BOTANICAL ARCHITECTURE & ARCHIVE ]
            </span>
          </div>
          <span
            className={`hidden sm:inline font-mono text-[10px] tracking-wider transition-colors duration-700 ${
              isEvening ? "text-white/40" : "text-[#11261B]/40"
            }`}
          >
            LAT 12.9716° N • LON 77.5946° E
          </span>
        </div>

        {/* Main 4-Column Architectural Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b transition-colors duration-700 ${
            isEvening ? "border-white/10" : "border-[#11261B]/10"
          }`}
        >
          {/* Column 1: Identity & Ethos & Gazette */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-serif text-3xl sm:text-4xl font-bold tracking-[0.14em] transition-colors duration-700 ${
                  isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                }`}
              >
                VERDURE
              </span>
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-700 ${
                  isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"
                }`}
              />
            </div>

            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-sm transition-colors duration-700 ${
                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
              }`}
            >
              A multisensory botanical sanctuary where soil microbiology, wild foraging, and open-hearth embers convene in quiet architectural serenity.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span
                className={`block text-[10px] font-mono uppercase tracking-widest font-semibold mb-2 transition-colors duration-700 ${
                  isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                }`}
              >
                Seasonal Botanical Gazette
              </span>
              {subscribed ? (
                <div
                  className={`flex items-center gap-2 text-xs font-mono p-3 rounded-full transition-colors ${
                    isEvening ? "text-[#C8A97E] bg-[#C8A97E]/10" : "text-[#1B3B2B] bg-[#1B3B2B]/10"
                  }`}
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Welcome to the seasonal circle. Confirmation sent.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setSubscribed(false);
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter your email for private cellar tastings"
                    className={`flex-1 px-4 py-2.5 text-xs rounded-l-full border focus:outline-none transition-colors ${
                      isEvening
                        ? "bg-[#12241B] border-white/15 text-[#F4F3EE] placeholder-[#95A79B]/60 focus:ring-1 focus:ring-[#C8A97E]"
                        : "bg-[#F4F3EE] border-[#11261B]/15 text-[#141816] placeholder-[#5C645E]/60 focus:ring-1 focus:ring-[#1B3B2B]"
                    }`}
                  />
                  <button
                    type="submit"
                    data-cursor="magnetic"
                    className={`px-4 py-2.5 rounded-r-full text-xs font-medium transition-colors flex items-center justify-center cursor-pointer ${
                      isEvening
                        ? "bg-[#C8A97E] hover:bg-[#D8BE96] text-[#0B1610]"
                        : "bg-[#1B3B2B] hover:bg-[#142E21] text-[#F4F3EE]"
                    }`}
                    aria-label="Subscribe to Gazette"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Column 2: Service Hours */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.08, ease: easeCurve }}
            className="lg:col-span-3 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] uppercase tracking-widest font-bold transition-colors duration-700 ${
                  isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                }`}
              >
                [ 02 // SERVICE HOURS ]
              </span>
            </div>
            <div
              className={`space-y-3 text-xs font-mono transition-colors duration-700 ${
                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
              }`}
            >
              <div className="p-3 rounded-lg border transition-colors duration-700 bg-white/5 border-white/5">
                <span
                  className={`block font-semibold transition-colors duration-700 ${
                    isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                  }`}
                >
                  Lunch Tasting Menu
                </span>
                <span className="text-[11px]">Thursday – Sunday</span>
                <span
                  className={`block pt-0.5 font-bold transition-colors duration-700 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                  }`}
                >
                  12:30 PM — 3:30 PM
                </span>
              </div>
              <div className="p-3 rounded-lg border transition-colors duration-700 bg-white/5 border-white/5">
                <span
                  className={`block font-semibold transition-colors duration-700 ${
                    isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                  }`}
                >
                  Evening Hearth & Embers
                </span>
                <span className="text-[11px]">Tuesday – Sunday</span>
                <span
                  className={`block pt-0.5 font-bold transition-colors duration-700 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                  }`}
                >
                  7:00 PM — 11:30 PM
                </span>
              </div>
              <div
                className={`text-[11px] leading-relaxed transition-colors duration-700 ${
                  isEvening ? "text-[#95A79B]/80" : "text-[#5C645E]/80"
                }`}
              >
                * Monday: Kitchen and grounds closed for bio-dynamic soil feeding & wild yeast fermentation.
              </div>
            </div>
          </motion.div>

          {/* Column 3: Location & Concierge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.16, ease: easeCurve }}
            className="lg:col-span-3 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] uppercase tracking-widest font-bold transition-colors duration-700 ${
                  isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                }`}
              >
                [ 03 // LOCATION & DESK ]
              </span>
            </div>
            <div
              className={`space-y-3 text-xs transition-colors duration-700 ${
                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <MapPin
                  className={`w-4 h-4 shrink-0 mt-0.5 transition-colors duration-700 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
                <span className="leading-snug">
                  14 Olive Lane, Sanctuary Enclave,<br />
                  Bengaluru, Karnataka 560001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone
                  className={`w-4 h-4 shrink-0 transition-colors duration-700 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
                <a
                  href="tel:+919845012844"
                  className={`font-mono transition-colors ${
                    isEvening ? "hover:text-[#C8A97E]" : "hover:text-[#1B3B2B]"
                  }`}
                >
                  +91 98450 12844
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail
                  className={`w-4 h-4 shrink-0 transition-colors duration-700 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
                <a
                  href="mailto:reservations@verdure.in"
                  className={`font-mono transition-colors ${
                    isEvening ? "hover:text-[#C8A97E]" : "hover:text-[#1B3B2B]"
                  }`}
                >
                  reservations@verdure.in
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-1 text-[11px] font-mono">
                <Car
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
                <span>EV Valet Concierge at North Gate</span>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Recognition & Press */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.24, ease: easeCurve }}
            className="lg:col-span-2 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] uppercase tracking-widest font-bold transition-colors duration-700 ${
                  isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"
                }`}
              >
                [ 04 // RECOGNITION ]
              </span>
            </div>
            <ul
              className={`space-y-2.5 text-xs transition-colors duration-700 ${
                isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
              }`}
            >
              <li className="flex items-center justify-between group cursor-default">
                <span>Michelin Green Star 2026</span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span>Architectural Digest SOTY</span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
              </li>
              <li className="flex items-center justify-between group cursor-default">
                <span>Awwwards Site of the Day</span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}
                />
              </li>
              <li className="pt-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 transition-colors font-mono text-[11px] ${
                    isEvening ? "hover:text-[#F4F3EE]" : "hover:text-[#141816]"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${
                      isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>@verdure.culinary</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Center Interactive Bar: Live Clock, Ambience Switcher & Back to Top */}
        <div
          className={`py-5 border-b flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono transition-colors duration-700 ${
            isEvening
              ? "border-white/10 text-[#95A79B]"
              : "border-[#11261B]/10 text-[#5C645E]"
          }`}
        >
          {/* Live IST Restaurant Clock & Status */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-60" />
              <span className="font-semibold tracking-wider">
                BENGALURU • {currentTime || "19:30:00"} IST
              </span>
              <span className="opacity-40">|</span>
              <span
                className={`font-semibold tracking-wide ${
                  isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                }`}
              >
                SERVICE STATUS: OPEN
              </span>
            </div>
          </div>

          {/* Quick Ambience Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-70">AMBIENCE:</span>
            <button
              type="button"
              onClick={toggleAmbience}
              data-cursor="pointer"
              aria-label="Toggle Lighting Ambience"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider transition-all duration-300 ${
                isEvening
                  ? "bg-[#12241B] border-[#C8A97E]/30 text-[#C8A97E] hover:border-[#C8A97E]"
                  : "bg-[#F4F3EE] border-[#11261B]/20 text-[#1B3B2B] hover:border-[#11261B]"
              }`}
            >
              {isEvening ? (
                <>
                  <Moon className="w-3 h-3 text-[#C8A97E]" />
                  <span>EVENING HEARTH (ACTIVE)</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-[#D97706]" />
                  <span>DAYLIGHT BOTANICAL (ACTIVE)</span>
                </>
              )}
            </button>
          </div>

          {/* Kinetic Back to Top Button */}
          <button
            type="button"
            onClick={scrollToTop}
            data-cursor="magnetic"
            onMouseEnter={() => setIsArrowHovered(true)}
            onMouseLeave={() => setIsArrowHovered(false)}
            className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 shadow-sm active:scale-95 cursor-pointer ${
              isEvening
                ? "bg-[#12241B] hover:bg-[#C8A97E] text-[#F4F3EE] hover:text-[#0B1610] border-white/15"
                : "bg-[#F4F3EE] hover:bg-[#1B3B2B] text-[#141816] hover:text-[#F4F3EE] border-[#11261B]/15"
            }`}
          >
            <span>Back to Top</span>
            <div className="relative w-3.5 h-3.5 overflow-hidden">
              <motion.div
                animate={
                  isArrowHovered && !prefersReducedMotion
                    ? { y: [-14, 0] }
                    : { y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </button>
        </div>

        {/* Monumental Edge-to-Edge VERDURE Watermark */}
        <div className="relative w-full pt-6 pb-2 overflow-hidden flex justify-center items-center pointer-events-none select-none">
          <span
            className={`font-serif text-[16vw] leading-[0.75] font-light tracking-[-0.04em] uppercase transition-colors duration-700 ${
              isEvening ? "text-white/[0.04]" : "text-[#11261B]/[0.05]"
            }`}
          >
            VERDURE
          </span>
        </div>

        {/* Bottom Studio Credit Bar & Legal Links */}
        <div
          className={`pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono border-t transition-colors duration-700 ${
            isEvening
              ? "border-white/10 text-[#95A79B]"
              : "border-[#11261B]/10 text-[#5C645E]"
          }`}
        >
          <div>
            © 2026 VERDURE Botanical Kitchen — Concept Portfolio Project
          </div>

          {/* Mandatory Attribution (PRESERVED ACCURATELY) */}
          <div
            className={`flex items-center gap-1.5 font-medium transition-colors duration-700 ${
              isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
            }`}
          >
            <span className="opacity-70">Designed & Developed by</span>
            <span
              className={`font-bold tracking-widest uppercase transition-colors duration-700 ${
                isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
              }`}
            >
              ELEVORA
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="#"
              className={`transition-colors ${
                isEvening ? "hover:text-[#F4F3EE]" : "hover:text-[#141816]"
              }`}
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="#"
              className={`transition-colors ${
                isEvening ? "hover:text-[#F4F3EE]" : "hover:text-[#141816]"
              }`}
            >
              Allergen Protocol
            </a>
            <span>•</span>
            <a
              href="#"
              className={`transition-colors ${
                isEvening ? "hover:text-[#F4F3EE]" : "hover:text-[#141816]"
              }`}
            >
              Terms of Table
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
