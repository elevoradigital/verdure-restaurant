"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
import { useHydratedReducedMotion } from "@/hooks/useHydratedReducedMotion";

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [preferredDishNote, setPreferredDishNote] = useState<string | undefined>(undefined);
  const prefersReducedMotion = useHydratedReducedMotion();

  const isReady = isPreloaderDone || prefersReducedMotion;

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloaderDone(true);
  }, []);

  const handleOpenReservation = useCallback((dishName?: string) => {
    setPreferredDishNote(dishName);
    setIsReservationOpen(true);
  }, []);

  const handleCloseReservation = useCallback(() => {
    setIsReservationOpen(false);
    setPreferredDishNote(undefined);
  }, []);

  const handleSelectDish = useCallback((dish: DishItem) => {
    setSelectedDish(dish);
  }, []);

  const handleCloseDishModal = useCallback(() => {
    setSelectedDish(null);
  }, []);

  const handleEightCourseReservation = useCallback(() => {
    handleOpenReservation("Eight-Course Autumn Symphony");
  }, [handleOpenReservation]);

  return (
    <>
      {/* 1. Custom Full-Screen Editorial Loader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Main Application Container with Curtain Scale Entrance */}
      <motion.main
        initial={{ opacity: 0.9, scale: 1.03 }}
        animate={
          isReady
            ? { opacity: 1, scale: 1 }
            : { opacity: 0.9, scale: 1.03 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300 ease-out overflow-x-hidden"
      >
        {/* 2. Top Scroll Progress Line & Smart Architectural Navbar */}
        <Header onOpenReservation={handleOpenReservation} />

        {/* 3. Hero Section Choreography & 3D Floating Levitation */}
        <Hero
          onOpenReservation={handleOpenReservation}
          isReady={isReady}
        />

        {/* 4. Self-Drawing Hairline Grid & Counter Reveal */}
        <FeatureStrip />

        {/* 5. "Selected Plates" FLIP Filter Morphing & 3D Plate Lift */}
        <SelectedPlates
          onSelectDish={handleSelectDish}
          onOpenReservation={handleEightCourseReservation}
        />

        {/* 6. Curtain Mask Reveal & Scroll Parallax Atmosphere Section */}
        <Atmosphere />

        {/* 7. Interactive Reservation Bar with Outward Expansion */}
        <ReservationBar />

        {/* 8. Minimal 4-Column Footer with Parallax Stagger & Kinetic Back-to-Top */}
        <Footer />

        {/* 9. Mobile Bottom Sticky Booking Action Bar */}
        <MobileStickyBar
          onOpenReservation={handleOpenReservation}
          isModalActive={isReservationOpen || selectedDish !== null}
        />

        {/* Interactive Dish Detail Preview Modal */}
        <DishModal
          dish={selectedDish}
          onClose={handleCloseDishModal}
          onBookDish={handleOpenReservation}
        />

        {/* Global Interactive Table Reservation Modal */}
        <ReservationModal
          isOpen={isReservationOpen}
          onClose={handleCloseReservation}
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
