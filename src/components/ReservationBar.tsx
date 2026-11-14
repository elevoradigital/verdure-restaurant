"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import ReservationModal from "./ReservationModal";
import MagneticButton from "./MagneticButton";
import TableFloorplan, { floorplanTables, TableNode } from "./TableFloorplan";
import { useAmbience } from "@/context/AmbienceContext";

export default function ReservationBar() {
  const { isEvening } = useAmbience();
  const [guests, setGuests] = useState("2 Guests");
  const [selectedDayTime, setSelectedDayTime] = useState("Today, 1:00 PM");
  const [selectedEveningTime, setSelectedEveningTime] = useState("Today, 8:00 PM");
  const dateTime = isEvening ? selectedEveningTime : selectedDayTime;
  const setDateTime = (val: string) => {
    if (isEvening) {
      setSelectedEveningTime(val);
    } else {
      setSelectedDayTime(val);
    }
  };
  const [selectedTable, setSelectedTable] = useState<TableNode>(floorplanTables[3]); // T-04 Botanical Window Booth
  const [isModalOpen, setIsModalOpen] = useState(false);

  const guestOptions = [
    "1 Guest",
    "2 Guests",
    "3 Guests",
    "4 Guests",
    "6 Guests",
    "8 Guests",
  ];

  const dayTimeOptions = [
    "Today, 12:30 PM",
    "Today, 1:00 PM",
    "Today, 2:15 PM",
    "Tomorrow, 1:00 PM",
    "Saturday, 1:30 PM",
  ];

  const eveningTimeOptions = [
    "Today, 7:00 PM",
    "Today, 8:00 PM",
    "Today, 8:30 PM",
    "Today, 9:30 PM",
    "Tomorrow, 8:00 PM",
  ];

  const dateTimeOptions = isEvening ? eveningTimeOptions : dayTimeOptions;

  const handleSelectTable = (table: TableNode) => {
    setSelectedTable(table);
  };

  return (
    <section
      id="reserve"
      className={`py-16 sm:py-20 lg:py-28 relative scroll-mt-10 overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        isEvening ? "bg-[#0B1610] border-[#F4F3EE]/10" : "bg-[#F4F3EE] border-[#11261B]/10"
      }`}
    >
      {/* Oversized Background Watermark */}
      <div className={`absolute -right-4 -top-8 pointer-events-none select-none font-serif text-[18vw] font-bold leading-none tracking-tighter opacity-[0.035] -z-0 ${
        isEvening ? "text-white" : "text-[#11261B]"
      }`}>
        03
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2 font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isEvening ? "bg-[#C8A97E]" : "bg-[#1B3B2B]"}`} />
            <span className={isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"}>
              [ 04 // TABLE RESERVATIONS ]
            </span>
          </div>

          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight transition-colors duration-700 ${
            isEvening ? "text-[#F4F3EE]" : "text-[#141816]"
          }`}>
            Reserve Your Sanctuary Table
          </h2>
          <p className={`mt-2.5 text-xs sm:text-sm font-normal max-w-md mx-auto transition-colors duration-700 ${
            isEvening ? "text-[#95A79B]" : "text-[#5C645E]"
          }`}>
            {isEvening
              ? "Tasting menus guided by open hearth embers and sommelier cellar pairings."
              : "Airy sunlit botanical lunch and garden terrace degustation seatings."}
          </p>
        </div>

        {/* ======================================================== */}
        {/* UNIFIED 2-COLUMN ARCHITECTURAL CONCIERGE CONSOLE         */}
        {/* ======================================================== */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x transition-colors duration-700 ${
          isEvening
            ? "bg-[#12241B] border-[#F4F3EE]/12 divide-[#F4F3EE]/10 text-[#F4F3EE] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            : "bg-[#EAE8E0] border-[#11261B]/12 divide-[#11261B]/10 text-[#141816] shadow-[0_20px_50px_rgba(17,38,27,0.08)]"
        }`}>
          
          {/* LEFT COLUMN: INTERACTIVE SVG FLOORPLAN (COLS 1-7) */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`w-2 h-2 rounded-full animate-ping ${isEvening ? "bg-[#C8A97E]" : "bg-[#2D5A43]"}`} />
                <span className="font-bold tracking-wider uppercase">Interactive Blueprint Map</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isEvening ? "border-[#C8A97E]/30 text-[#C8A97E]" : "border-[#1B3B2B]/20 text-[#1B3B2B]"
              }`}>
                Tap Pin to Select Table
              </span>
            </div>

            {/* Embedded Table Floorplan Canvas */}
            <div className="w-full">
              <TableFloorplan
                selectedTableId={selectedTable.id}
                onSelectTable={handleSelectTable}
                guestCountFilter={guests}
                currentDateTime={dateTime}
                onConfirmSelection={() => setIsModalOpen(true)}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING CONTROLS & TABLE BADGE (COLS 8-12) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            
            {/* Selected Table Hero Card */}
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-60 mb-1">
                ACTIVE TABLE ASSIGNMENT
              </div>
              <div className={`p-4 rounded-2xl border transition-colors ${
                isEvening
                  ? "bg-[#070F0A] border-[#C8A97E]/40"
                  : "bg-[#F4F3EE] border-[#1B3B2B]/20"
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-current/10">
                  <span className={`font-mono text-xs font-bold tracking-wider ${
                    isEvening ? "text-[#C8A97E]" : "text-[#1B3B2B]"
                  }`}>
                    TABLE {selectedTable.id}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isEvening ? "bg-[#C8A97E]/15 text-[#C8A97E]" : "bg-[#1B3B2B]/10 text-[#1B3B2B]"
                  }`}>
                    {selectedTable.zone}
                  </span>
                </div>
                <div className="font-serif text-lg font-medium mt-2">
                  {selectedTable.name}
                </div>
                <div className="text-xs opacity-75 mt-0.5 font-mono">
                  {selectedTable.specs}
                </div>
                <div className={`text-xs mt-2 italic ${isEvening ? "text-[#C8A97E]" : "text-[#2D5A43]"}`}>
                  &quot;{selectedTable.feature}&quot;
                </div>
              </div>
            </div>

            {/* Party Size Selector */}
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase font-semibold mb-2">
                1. Party Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {guestOptions.map((opt) => {
                  const isSelected = guests === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setGuests(opt)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                        isSelected
                          ? isEvening
                            ? "bg-[#C8A97E] text-[#0B1610] font-bold border-[#C8A97E] shadow-sm"
                            : "bg-[#1B3B2B] text-[#F4F3EE] font-bold border-[#1B3B2B] shadow-sm"
                          : isEvening
                          ? "bg-[#070F0A]/60 border-white/10 hover:border-white/20 text-[#95A79B]"
                          : "bg-white/60 border-black/10 hover:border-black/20 text-[#5C645E]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase font-semibold mb-2">
                2. Seating Time ({isEvening ? "Candlelit Tasting" : "Daylight Lunch"})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dateTimeOptions.map((time) => {
                  const isSelected = dateTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDateTime(time)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer border truncate ${
                        isSelected
                          ? isEvening
                            ? "bg-[#C8A97E] text-[#0B1610] font-bold border-[#C8A97E] shadow-sm"
                            : "bg-[#1B3B2B] text-[#F4F3EE] font-bold border-[#1B3B2B] shadow-sm"
                          : isEvening
                          ? "bg-[#070F0A]/60 border-white/10 hover:border-white/20 text-[#95A79B]"
                          : "bg-white/60 border-black/10 hover:border-black/20 text-[#5C645E]"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm & Launch Pass Modal CTA */}
            <div className="pt-2">
              <MagneticButton
                onClick={() => setIsModalOpen(true)}
                data-cursor="magnetic"
                className={`w-full py-4 rounded-2xl text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  isEvening
                    ? "bg-[#C8A97E] hover:bg-[#D9BA8F] text-[#0B1610]"
                    : "bg-[#1B3B2B] hover:bg-[#142E21] text-[#F4F3EE]"
                }`}
              >
                <span>Confirm Table {selectedTable.id}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>

              <div className="text-[10px] font-mono text-center opacity-60 mt-3 space-y-0.5">
                <div>• Instant Digital VIP Table Pass generated</div>
                <div>• Direct WhatsApp Sync & No Cancellation Fees</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Reservation Submission & Digital Table Pass Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDetails={{
          guests,
          dateTime,
          seating: selectedTable.zone,
          tableId: selectedTable.id,
          tableName: selectedTable.name,
          tableSpecs: selectedTable.specs,
          serviceMode: isEvening ? "Candlelit Evening Service" : "Daylight Botanical Service",
        }}
      />
    </section>
  );
}
