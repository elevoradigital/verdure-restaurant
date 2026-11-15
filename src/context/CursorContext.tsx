"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export type CursorVariant =
  | "default"
  | "hero3d"
  | "plate"
  | "gallery"
  | "tablePin"
  | "magnetic"
  | "hidden";

interface CursorContextType {
  variant: CursorVariant;
  label: string;
  isVisible: boolean;
  isHovered: boolean;
  isMouseDown: boolean;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;
  setCursorLabel: (label: string) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const setCursor = useCallback((newVariant: CursorVariant, newLabel = "") => {
    setVariant(newVariant);
    setLabel(newLabel);
    setIsHovered(newVariant !== "default" && newVariant !== "hidden");
  }, []);

  const resetCursor = useCallback(() => {
    setVariant("default");
    setLabel("");
    setIsHovered(false);
  }, []);

  const setCursorLabel = useCallback((newLabel: string) => {
    setLabel(newLabel);
  }, []);

  // Global mouse event listener for data-attributes and window boundary detection
  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === "undefined") return;
    const isTouchDevice = window.matchMedia("(pointer: coarse), (hover: none)").matches;
    if (isTouchDevice) return;

    const handleMouseEnterWindow = () => setIsVisible(true);
    const handleMouseLeaveWindow = () => setIsVisible(false);

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    // Event delegation on mouseover to detect data-cursor attributes
    const handleMouseOver = (e: MouseEvent) => {
      setIsVisible(true);
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Text Inputs / Selects / Textareas -> minimal/hidden
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        setVariant("hidden");
        setLabel("");
        setIsHovered(false);
        return;
      }

      // 2. Element with explicit data-cursor
      const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
      if (cursorTarget) {
        const attrVariant = cursorTarget.getAttribute("data-cursor") as CursorVariant;
        const attrLabel = cursorTarget.getAttribute("data-cursor-label") || "";
        setVariant(attrVariant || "default");
        setLabel(attrLabel);
        setIsHovered(attrVariant !== "default" && attrVariant !== "hidden");
        return;
      }

      // 3. Fallback for interactive elements (buttons, links, clickable items)
      const interactiveTarget = target.closest<HTMLElement>(
        "button, a, [role='button'], input[type='button'], input[type='submit']"
      );
      if (interactiveTarget) {
        setVariant("magnetic");
        setLabel("");
        setIsHovered(true);
        return;
      }

      // 4. Default state
      setVariant("default");
      setLabel("");
      setIsHovered(false);
    };

    document.documentElement.addEventListener("mouseenter", handleMouseEnterWindow);
    document.documentElement.addEventListener("mouseleave", handleMouseLeaveWindow);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.documentElement.removeEventListener("mouseenter", handleMouseEnterWindow);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeaveWindow);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      variant,
      label,
      isVisible,
      isHovered,
      isMouseDown,
      setCursor,
      resetCursor,
      setCursorLabel,
    }),
    [
      variant,
      label,
      isVisible,
      isHovered,
      isMouseDown,
      setCursor,
      resetCursor,
      setCursorLabel,
    ]
  );

  return (
    <CursorContext.Provider value={contextValue}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
