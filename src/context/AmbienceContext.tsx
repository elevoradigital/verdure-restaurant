"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
  useState,
} from "react";

export type AmbienceMode = "day" | "evening";

interface AmbienceContextType {
  mode: AmbienceMode;
  isEvening: boolean;
  toggleAmbience: () => void;
  setAmbience: (mode: AmbienceMode) => void;
  isTransitioning: boolean;
}

const STORAGE_KEY = "verdure_ambience_mode";

function getStoredMode(): AmbienceMode {
  if (typeof window === "undefined") return "day";
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved === "evening" ? "evening" : "day";
  } catch {
    return "day";
  }
}

// In-memory global store with listeners for useSyncExternalStore
let currentMode: AmbienceMode = "day";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): AmbienceMode {
  return currentMode;
}

function getServerSnapshot(): AmbienceMode {
  return "day";
}

const AmbienceContext = createContext<AmbienceContextType | undefined>(undefined);

export function AmbienceProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync with sessionStorage on client mount
  useEffect(() => {
    const stored = getStoredMode();
    if (stored !== currentMode) {
      currentMode = stored;
      emitChange();
    }
  }, []);

  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isEvening = mode === "evening";

  const setAmbience = useCallback((newMode: AmbienceMode) => {
    if (newMode === currentMode) return;
    currentMode = newMode;
    try {
      sessionStorage.setItem(STORAGE_KEY, newMode);
    } catch {}

    setIsTransitioning(true);
    emitChange();

    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  }, []);

  const toggleAmbience = useCallback(() => {
    setAmbience(currentMode === "day" ? "evening" : "day");
  }, [setAmbience]);

  // Update root html class and data-ambience attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (isEvening) {
        root.classList.add("ambience-evening");
        root.classList.remove("ambience-day");
        root.setAttribute("data-ambience", "evening");
      } else {
        root.classList.add("ambience-day");
        root.classList.remove("ambience-evening");
        root.setAttribute("data-ambience", "day");
      }
    }
  }, [isEvening]);

  return (
    <AmbienceContext.Provider
      value={{
        mode,
        isEvening,
        toggleAmbience,
        setAmbience,
        isTransitioning,
      }}
    >
      {children}
    </AmbienceContext.Provider>
  );
}

export function useAmbience() {
  const context = useContext(AmbienceContext);
  if (!context) {
    throw new Error("useAmbience must be used within an AmbienceProvider");
  }
  return context;
}
