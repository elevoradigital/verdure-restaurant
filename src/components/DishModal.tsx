"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, Flame, Wine } from "lucide-react";
import { useAmbience } from "@/context/AmbienceContext";

export interface DishItem {
  id: string;
  name: string;
  category: "Small Plates" | "Mains" | "Cellar";
  price: string;
  description: string;
  ingredients: string[];
  pairing: string;
  tags: string[];
  image: string;
  preparation: string;
}

interface DishModalProps {
  dish: DishItem | null;
  onClose: () => void;
  onBookDish: (dishName: string) => void;
}

export default function DishModal({ dish, onClose, onBookDish }: DishModalProps) {
  const { isEvening } = useAmbience();
  if (!dish) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm ${
          isEvening ? "bg-[#070F0A]/80" : "bg-[#11261B]/70"
        }`}
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
          className={`relative w-full max-w-2xl rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl border-t sm:border max-h-[92dvh] sm:max-h-none overflow-y-auto transition-colors duration-500 ${
            isEvening
              ? "bg-[#12241B] text-[#F4F3EE] border-[#F4F3EE]/15"
              : "bg-[#F4F3EE] text-[#141816] border-[#11261B]/15"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Swipe Down Pill Drag Handle */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
            <div className={`w-12 h-1.5 rounded-full ${isEvening ? "bg-[#F4F3EE]/20" : "bg-[#11261B]/20"}`} />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            data-cursor="magnetic"
            className={`absolute top-4 right-4 z-20 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-colors active:scale-90 cursor-pointer ${
              isEvening
                ? "bg-[#070F0A]/80 text-[#F4F3EE] hover:bg-[#070F0A]"
                : "bg-[#11261B]/70 text-[#F4F3EE] hover:bg-[#11261B]"
            }`}
            aria-label="Close dish preview"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Dish Image */}
            <div className={`relative aspect-[4/3] sm:aspect-square md:aspect-auto md:h-full min-h-[220px] sm:min-h-[260px] ${
              isEvening ? "bg-[#0B1610]" : "bg-[#EAE8E0]"
            }`}>
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-[#F4F3EE] text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-semibold ${
                  isEvening ? "bg-[#2D5A43] border border-[#C8A97E]/30" : "bg-[#1B3B2B]"
                }`}>
                  {dish.category}
                </span>
              </div>
            </div>

            {/* Details Column */}
            <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-serif text-xl sm:text-2xl font-semibold ${
                    isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
                  }`}>
                    {dish.name}
                  </h3>
                  <span className={`font-mono text-lg sm:text-xl font-bold shrink-0 ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}>
                    {dish.price}
                  </span>
                </div>

                <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                  isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
                }`}>
                  {dish.description}
                </p>

                {/* Botanical Tags */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {dish.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium ${
                        isEvening
                          ? "bg-[#070F0A] text-[#C8A97E] border border-[#C8A97E]/20"
                          : "bg-[#EAE8E0] text-[#1B3B2B]"
                      }`}
                    >
                      <Sprout className="w-3 h-3 text-[#2D5A43]" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hearth & Harvest Notes */}
                <div className={`mt-4 pt-3.5 border-t space-y-2 text-xs ${
                  isEvening ? "border-[#F4F3EE]/10 text-[#95A79B]" : "border-[#11261B]/10 text-[#5C645E]"
                }`}>
                  <div className="flex items-center gap-2">
                    <Flame className={`w-3.5 h-3.5 ${isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"}`} />
                    <span><strong>Craft:</strong> {dish.preparation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wine className={`w-3.5 h-3.5 ${isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"}`} />
                    <span><strong>Pairing:</strong> {dish.pairing} ({isEvening ? "Cellar Selection" : "Daylight Selection"})</span>
                  </div>
                </div>
              </div>

              {/* CTA in Modal */}
              <div className={`pt-3 sm:pt-4 border-t ${isEvening ? "border-[#F4F3EE]/10" : "border-[#11261B]/10"}`}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookDish(dish.name);
                  }}
                  data-cursor="magnetic"
                  className={`w-full py-3.5 px-4 rounded-full text-[#F4F3EE] text-xs font-semibold tracking-wider uppercase transition-colors duration-200 shadow-sm text-center active:scale-[0.98] cursor-pointer ${
                    isEvening
                      ? "bg-[#2D5A43] hover:bg-[#234C37]"
                      : "bg-[#1B3B2B] hover:bg-[#142E21]"
                  }`}
                >
                  Reserve Table for this Dish
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
