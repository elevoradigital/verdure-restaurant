"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAmbience } from "@/context/AmbienceContext";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureStrip from "@/components/FeatureStrip";
import SelectedPlates from "@/components/SelectedPlates";
import Atmosphere from "@/components/Atmosphere";
import ReservationBar from "@/components/ReservationBar";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import DishModal, { DishItem } from "@/components/DishModal";
import ReservationModal from "@/components/ReservationModal";

export default function Home() {
  const { isEvening } = useAmbience();
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [preferredDishNote, setPreferredDishNote] = useState<string | undefined>(undefined);
  const prefersReducedMotion = useReducedMotion();

  const handleOpenReservation = (dishName?: string) => {
    setPreferredDishNote(dishName);
    setIsReservationOpen(true);
  };

  return (
    <>
      {/* 1. Custom Full-Screen Editorial Loader */}
      <Preloader onComplete={() => setIsPreloaderDone(true)} />

      {/* Main Application Container with Curtain Scale Entrance */}
      <motion.main
        initial={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 0.9, scale: 1.03 }
        }
        animate={
          isPreloaderDone || prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.9, scale: 1.03 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`relative min-h-screen transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-x-hidden ${
          isEvening ? "bg-[#0B1610] text-[#F4F3EE]" : "bg-[#F4F3EE] text-[#141816]"
        }`}
      >
        {/* 2. Top Scroll Progress Line & Smart Architectural Navbar */}
        <Header onOpenReservation={() => handleOpenReservation()} />

        {/* 3. Hero Section Choreography & 3D Floating Levitation */}
        <Hero
          onOpenReservation={() => handleOpenReservation()}
          isReady={isPreloaderDone || !!prefersReducedMotion}
        />

        {/* 4. Self-Drawing Hairline Grid & Counter Reveal */}
        <FeatureStrip />

        {/* 5. "Selected Plates" FLIP Filter Morphing & 3D Plate Lift */}
        <SelectedPlates
          onSelectDish={(dish) => setSelectedDish(dish)}
          onOpenReservation={() => handleOpenReservation("Eight-Course Autumn Symphony")}
        />

        {/* 6. Curtain Mask Reveal & Scroll Parallax Atmosphere Section */}
        <Atmosphere />

        {/* 7. Interactive Reservation Bar with Outward Expansion */}
        <ReservationBar />

        {/* 8. Minimal 4-Column Footer with Parallax Stagger & Kinetic Back-to-Top */}
        <Footer />

        {/* 9. Mobile Bottom Sticky Booking Action Bar */}
        <MobileStickyBar
          onOpenReservation={() => handleOpenReservation()}
          isModalActive={isReservationOpen || selectedDish !== null}
        />

        {/* Interactive Dish Detail Preview Modal */}
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onBookDish={(name) => handleOpenReservation(name)}
        />

        {/* Global Interactive Table Reservation Modal */}
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={() => {
            setIsReservationOpen(false);
            setPreferredDishNote(undefined);
          }}
          initialDetails={{
            guests: "2 Guests",
            dateTime: "Today, 8:00 PM",
            seating: "Indoor Dining",
            dishPreference: preferredDishNote,
          }}
        />
      </motion.main>
    </>
  );
}
