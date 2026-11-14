"use client";

import React, { useRef, ReactNode, MouseEvent } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
  title,
  ariaLabel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTouchDevice = useIsTouchDevice();
  const prefersReducedMotion = useReducedMotion();

  // Damped spring physics: stiffness 180, damping 22
  const springConfig = { stiffness: 180, damping: 22, mass: 0.5 };
  const buttonX = useSpring(0, springConfig);
  const buttonY = useSpring(0, springConfig);
  const contentX = useSpring(0, springConfig);
  const contentY = useSpring(0, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (isTouchDevice || prefersReducedMotion || !buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Pull container up to 6px, inner content up to 3px
    buttonX.set(distanceX * 0.18);
    buttonY.set(distanceY * 0.18);
    contentX.set(distanceX * 0.1);
    contentY.set(distanceY * 0.1);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    buttonX.set(0);
    buttonY.set(0);
    contentX.set(0);
    contentY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      data-cursor="magnetic"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: buttonX,
        y: buttonY,
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none ${className}`}
    >
      <motion.div
        style={{
          x: contentX,
          y: contentY,
        }}
        className="relative z-10 w-full h-full flex items-center justify-center gap-2"
      >
        {children}
      </motion.div>
    </motion.button>
  );
}
