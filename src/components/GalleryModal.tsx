"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const galleryImages = [
  {
    src: "/images/atmosphere-dining.jpg",
    title: "The Main Dining Room",
    subtitle: "Low candlelight, acoustic plaster, hand-finished oak tables.",
    location: "Sanctuary Enclave",
  },
  {
    src: "/images/gallery-hearth.jpg",
    title: "The Fruitwood Hearth",
    subtitle: "Live fire cooking over cured white oak and applewood coals.",
    location: "Kitchen Theater",
  },
  {
    src: "/images/gallery-cellar.jpg",
    title: "Natural Wine Vault",
    subtitle: "Over 350 low-intervention, biodynamic labels and house fermentations.",
    location: "Subterranean Cellar",
  },
  {
    src: "/images/gallery-table.jpg",
    title: "Intimate Banquette Corner",
    subtitle: "Private alcoves designed for deep conversation and lingering evenings.",
    location: "East Wing",
  },
  {
    src: "/images/gallery-garden.jpg",
    title: "The Botanical Courtyard",
    subtitle: "Living herb walls, olive trees, and open-air aperitif lounge.",
    location: "Garden Terrace",
  },
];

export default function GalleryModal({
  isOpen,
  onClose,
  initialIndex = 0,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen) return null;

  const current = galleryImages[currentIndex];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#0B1711]/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 450) {
              onClose();
            }
          }}
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 26,
            stiffness: 240,
          }}
          className="relative w-full max-w-5xl bg-[#11261B] rounded-t-[2rem] sm:rounded-3xl overflow-hidden border-t sm:border border-[#F4F3EE]/15 shadow-2xl flex flex-col max-h-[95dvh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Swipe Down Drag Handle */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-[#F4F3EE]/25" />
          </div>

          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#F4F3EE]/10 bg-[#11261B]/80">
            <div className="flex items-center gap-3">
              <span className="font-serif text-base sm:text-lg text-[#F4F3EE] tracking-wider">
                VERDURE ARCHITECTURE
              </span>
              <span className="font-mono text-xs text-[#6B8E78] px-2 py-0.5 rounded-full bg-[#1B3B2B]">
                {currentIndex + 1} / {galleryImages.length}
              </span>
            </div>

            <button
              onClick={onClose}
              data-cursor="magnetic"
              className="p-2 rounded-full bg-[#1B3B2B] text-[#F4F3EE] hover:bg-[#2D5A43] transition-colors active:scale-90"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Frame with Touch Swipe & Prev/Next Controls */}
          <div className="relative aspect-[16/11] sm:aspect-[16/9] w-full bg-black/40 overflow-hidden">
            <Image
              src={current.src}
              alt={current.title}
              fill
              className="object-cover object-center transition-all duration-300"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              data-cursor="magnetic"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#11261B]/70 hover:bg-[#11261B] text-[#F4F3EE] backdrop-blur-md transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              data-cursor="magnetic"
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#11261B]/70 hover:bg-[#11261B] text-[#F4F3EE] backdrop-blur-md transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Bottom Caption and Thumbnail Strip */}
          <div className="p-4 sm:p-6 bg-[#0E2016] border-t border-[#F4F3EE]/10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h4 className="font-serif text-lg sm:text-xl text-[#F4F3EE] font-medium">
                {current.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#A2ADA5] mt-0.5">
                {current.subtitle}
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.title}
                  data-cursor="magnetic"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 sm:w-14 h-8 sm:h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    currentIndex === idx
                      ? "border-[#6B8E78] scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
