"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  Users,
  MapPin,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAmbience } from "@/context/AmbienceContext";

export interface ReservationDetails {
  guests: string;
  dateTime: string;
  seating: string;
  dishPreference?: string;
  tableId?: string;
  tableName?: string;
  tableSpecs?: string;
  serviceMode?: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetails?: ReservationDetails;
}

export default function ReservationModal({
  isOpen,
  onClose,
  initialDetails,
}: ReservationModalProps) {
  const { isEvening } = useAmbience();
  const [step, setStep] = useState<"form" | "loading" | "confirmed">("form");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    guests: initialDetails?.guests || "2 Guests",
    dateTime: initialDetails?.dateTime || (isEvening ? "Today, 8:00 PM" : "Today, 1:00 PM"),
    seating: initialDetails?.seating || "Indoor Dining",
    tableId: initialDetails?.tableId || "T-04",
    tableName: initialDetails?.tableName || "Botanical Window Booth",
    serviceMode: initialDetails?.serviceMode || (isEvening ? "Candlelit Evening Service" : "Daylight Botanical Service"),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingRef, setBookingRef] = useState("");

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please provide your full name";
    if (!formData.phone.trim()) {
      errs.phone = "Phone or WhatsApp number is required";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStep("loading");
    const randomRef = "VRD-" + Math.floor(10000 + Math.random() * 90000);
    setBookingRef(randomRef);

    setTimeout(() => {
      setStep("confirmed");
    }, 1100);
  };

  const handleReset = () => {
    setStep("form");
    setFormData({
      name: "",
      phone: "",
      email: "",
      notes: "",
      guests: initialDetails?.guests || "2 Guests",
      dateTime: initialDetails?.dateTime || (isEvening ? "Today, 8:00 PM" : "Today, 1:00 PM"),
      seating: initialDetails?.seating || "Indoor Dining",
      tableId: initialDetails?.tableId || "T-04",
      tableName: initialDetails?.tableName || "Botanical Window Booth",
      serviceMode: initialDetails?.serviceMode || (isEvening ? "Candlelit Evening Service" : "Daylight Botanical Service"),
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#11261B]/75 backdrop-blur-sm"
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
          className="relative w-full max-w-lg bg-[#F4F3EE] rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl border-t sm:border border-[#11261B]/15 max-h-[95dvh] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Swipe Down Drag Handle */}
          <div className="sm:hidden pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-[#11261B]/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 pb-3 sm:pb-4 border-b border-[#11261B]/10 bg-[#EAE8E0]/50">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#5C645E] uppercase font-semibold">
                Table Reservation
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#141816]">
                {step === "confirmed" ? "Table Confirmed" : "Complete Your Booking"}
              </h3>
            </div>
            <button
              onClick={onClose}
              data-cursor="magnetic"
              className="p-2 rounded-full bg-[#EAE8E0] hover:bg-[#DDD9CE] text-[#141816] transition-colors active:scale-90"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content body */}
          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {step === "form" && (
                <motion.form
                  key="form-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Selected Reservation Summary Pill */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-[#EAE8E0] border border-[#11261B]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#141816]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#1B3B2B]" />
                      {formData.guests}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#1B3B2B]" />
                      {formData.dateTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#1B3B2B]" />
                      {formData.seating}
                    </span>
                    {formData.tableId && (
                      <span className="flex items-center gap-1 font-semibold text-[#1B3B2B] bg-[#1B3B2B]/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-[#1B3B2B]" />
                        Table {formData.tableId}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-semibold text-[#2D5A43] bg-[#2D5A43]/10 px-2 py-0.5 rounded-full">
                      {formData.serviceMode?.includes("Evening") ? "☾ Evening Service" : "☀ Daylight Service"}
                    </span>
                  </div>

                  {initialDetails?.dishPreference && (
                    <div className="text-xs text-[#2D5A43] bg-[#2D5A43]/10 px-3 py-1.5 rounded-lg font-medium">
                      Plating Note: Preference for {initialDetails.dishPreference} noted.
                    </div>
                  )}

                  {/* Guest Name (Font size >= 16px to prevent iOS auto-zoom) */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-[#141816] mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C645E]" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Radhika Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#11261B]/15 text-base sm:text-sm text-[#141816] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent transition-colors duration-150 placeholder:text-[#5C645E]/50"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone / WhatsApp (Font size >= 16px) */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-[#141816] mb-1.5 uppercase tracking-wider">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl bg-[#EAE8E0] border border-r-0 border-[#11261B]/15 text-xs font-mono text-[#141816]">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="98450 12345"
                        className="w-full px-3.5 py-2.5 rounded-r-xl bg-white border border-[#11261B]/15 text-base sm:text-sm text-[#141816] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent transition-colors duration-150 placeholder:text-[#5C645E]/50"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email (Font size >= 16px) */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-[#141816] mb-1.5 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C645E]" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="radhika@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#11261B]/15 text-base sm:text-sm text-[#141816] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent transition-colors duration-150 placeholder:text-[#5C645E]/50"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Special Requests (Font size >= 16px) */}
                  <div>
                    <label className="block text-xs font-mono font-medium text-[#141816] mb-1.5 uppercase tracking-wider">
                      Dietary / Occasion Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Allergies, anniversary, quiet table, etc."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#11261B]/15 text-base sm:text-sm text-[#141816] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B] focus:border-transparent transition-colors duration-150 placeholder:text-[#5C645E]/50"
                    />
                  </div>

                  {/* Confirmation CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      data-cursor="magnetic"
                      className="w-full py-3.5 px-6 rounded-full bg-[#1B3B2B] hover:bg-[#142E21] text-[#F4F3EE] font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow-md active:scale-[0.98]"
                    >
                      <span>Confirm Reservation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-[#5C645E]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                      <span>Instant confirmation via WhatsApp & Email. Zero booking deposit.</span>
                    </div>
                  </div>
                </motion.form>
              )}

              {step === "loading" && (
                <motion.div
                  key="loading-step"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-10 sm:py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <svg className="w-12 h-12 animate-spin text-[#1B3B2B]" viewBox="0 0 50 50">
                    <circle
                      className="opacity-20"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <circle
                      className="text-[#1B3B2B]"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="80"
                      strokeDashoffset="60"
                    />
                  </svg>

                  <h4 className="font-serif text-xl text-[#141816]">
                    {formData.tableId
                      ? `Securing Table ${formData.tableId} (${formData.tableName})...`
                      : "Securing Your Sanctuary Table..."}
                  </h4>
                  <p className="text-xs text-[#5C645E] max-w-xs font-mono">
                    Matching seating availability with the culinary hearth team.
                  </p>
                </motion.div>
              )}

              {step === "confirmed" && (
                <motion.div
                  key="confirmed-step"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="py-2 text-center space-y-4"
                >
                  {/* VIP Digital Table Pass Card */}
                  <div className={`p-5 rounded-3xl border shadow-2xl text-left relative overflow-hidden transition-colors ${
                    isEvening
                      ? "bg-[#070F0A] border-[#C8A97E]/30 text-[#F4F3EE]"
                      : "bg-[#11261B] border-white/10 text-[#F4F3EE]"
                  }`}>
                    {/* Header: Pass Branding & Reference */}
                    <div className="flex items-start justify-between pb-3 border-b border-white/15">
                      <div>
                        <div className="text-[9px] font-mono tracking-[0.25em] text-[#C8A97E] uppercase font-bold">
                          VERDURE CULINARY PASS // 2026
                        </div>
                        <div className="font-serif text-lg font-bold tracking-wider mt-0.5">
                          VIP TABLE PASS
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#C8A97E] bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        {bookingRef || `VRD-2026-${formData.tableId ? formData.tableId.replace("-", "") : "T04"}`}
                      </span>
                    </div>

                    {/* Middle: Grid Details + Stylized SVG QR Code */}
                    <div className="grid grid-cols-12 gap-3 py-3 items-center">
                      <div className="col-span-8 space-y-1.5 text-xs font-mono">
                        <div>
                          <span className="text-white/50 block text-[9px] uppercase">Guest</span>
                          <span className="font-semibold text-white">{formData.name || "Distinguished Guest"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-white/50 block text-[9px] uppercase">Table</span>
                            <span className="font-bold text-[#C8A97E]">{formData.tableId || "T-04"}</span>
                          </div>
                          <div>
                            <span className="text-white/50 block text-[9px] uppercase">Party</span>
                            <span className="text-white">{formData.guests}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-white/50 block text-[9px] uppercase">Time & Service</span>
                          <span className="text-white font-medium">{formData.dateTime}</span>
                        </div>
                      </div>

                      {/* Stylized SVG QR Code */}
                      <div className="col-span-4 flex flex-col items-center justify-center p-2 rounded-xl bg-white text-[#11261B]">
                        <svg className="w-16 h-16" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="0" y="0" width="30" height="30" rx="4" />
                          <rect x="70" y="0" width="30" height="30" rx="4" />
                          <rect x="0" y="70" width="30" height="30" rx="4" />
                          <rect x="40" y="10" width="20" height="20" rx="2" />
                          <rect x="40" y="40" width="20" height="20" rx="2" />
                          <rect x="10" y="40" width="20" height="20" rx="2" />
                          <rect x="70" y="40" width="20" height="20" rx="2" />
                          <rect x="40" y="70" width="20" height="20" rx="2" />
                          <rect x="70" y="70" width="30" height="30" rx="4" />
                          {/* Inner cutout squares */}
                          <rect x="7" y="7" width="16" height="16" fill="white" />
                          <rect x="11" y="11" width="8" height="8" fill="currentColor" />
                          <rect x="77" y="7" width="16" height="16" fill="white" />
                          <rect x="81" y="11" width="8" height="8" fill="currentColor" />
                          <rect x="7" y="77" width="16" height="16" fill="white" />
                          <rect x="11" y="81" width="8" height="8" fill="currentColor" />
                        </svg>
                        <span className="text-[8px] font-mono tracking-wider uppercase mt-1 font-bold">
                          SCAN PASS
                        </span>
                      </div>
                    </div>

                    {/* Bottom Pass Footer */}
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/60">
                      <span>VERDURE • 14 Olive Lane</span>
                      <span className="text-[#C8A97E] font-semibold">Priority Entry</span>
                    </div>
                  </div>

                  {/* WhatsApp Direct Share & Calendar Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      data-cursor="magnetic"
                      onClick={() => {
                        const passId = bookingRef || `VRD-2026-${formData.tableId ? formData.tableId.replace("-", "") : "T04"}`;
                        const summary = `🍽️ *VERDURE Table Confirmation*\nPass ID: ${passId}\nGuest: ${formData.name}\nTable: ${formData.tableId} (${formData.tableName})\nParty: ${formData.guests}\nTime: ${formData.dateTime}\n\nPresent this digital pass upon arrival at 14 Olive Lane, Bengaluru.`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank");
                      }}
                      className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold text-xs tracking-wider uppercase transition-colors duration-200 shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send Pass to WhatsApp ↗</span>
                    </button>

                    <button
                      type="button"
                      data-cursor="magnetic"
                      onClick={() => {
                        const text = `VERDURE Reservation: ${formData.guests} at ${formData.dateTime}, Table ${formData.tableId}`;
                        window.open(
                          `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                            "Dinner at VERDURE Modern Botanical"
                          )}&details=${encodeURIComponent(text)}&location=14+Olive+Lane+Bengaluru`,
                          "_blank"
                        );
                      }}
                      className="w-full py-2.5 px-4 rounded-full bg-[#EAE8E0] hover:bg-[#DDD9CE] text-[#141816] text-xs font-semibold tracking-wider uppercase transition-colors active:scale-95 cursor-pointer"
                    >
                      Add to Google Calendar
                    </button>

                    <button
                      type="button"
                      data-cursor="magnetic"
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-full bg-black/10 hover:bg-black/20 text-[#141816] text-xs font-semibold tracking-wider uppercase transition-colors active:scale-95 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
