"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  useCallback,
  useRef,
} from "react";

export type AmbienceMode = "day" | "evening";

export interface TransitionOrigin {
  x: number;
  y: number;
  endRadius: number;
}

interface AmbienceContextType {
  mode: AmbienceMode;
  isEvening: boolean;
  toggleAmbience: (event?: React.MouseEvent | MouseEvent) => void;
  setAmbience: (mode: AmbienceMode, event?: React.MouseEvent | MouseEvent) => void;
  isTransitioning: boolean;
  lastOrigin: TransitionOrigin | null;
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

function extractOrigin(event?: React.MouseEvent | MouseEvent): TransitionOrigin {
  if (typeof window === "undefined") {
    return { x: 0, y: 0, endRadius: 1000 };
  }
  let x: number;
  let y: number;

  if (event && "currentTarget" in event && event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else if (
    event &&
    "clientX" in event &&
    typeof event.clientX === "number" &&
    (event.clientX > 0 || event.clientY > 0)
  ) {
    x = event.clientX;
    y = event.clientY;
  } else {
    // Default to the top-right navbar toggle area
    x = window.innerWidth * 0.78;
    y = 36;
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  return { x, y, endRadius };
}

function applyThemeDOM(modeToApply: AmbienceMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (modeToApply === "evening") {
    root.classList.add("ambience-evening");
    root.classList.remove("ambience-day");
    root.setAttribute("data-ambience", "evening");
  } else {
    root.classList.add("ambience-day");
    root.classList.remove("ambience-evening");
    root.setAttribute("data-ambience", "day");
  }
}

const AmbienceContext = createContext<AmbienceContextType | undefined>(undefined);

export function AmbienceProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastOrigin, setLastOrigin] = useState<TransitionOrigin | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with sessionStorage on client mount
  useEffect(() => {
    const stored = getStoredMode();
    if (stored !== currentMode) {
      currentMode = stored;
      emitChange();
    }
    applyThemeDOM(currentMode);
  }, []);

  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isEvening = mode === "evening";

  const setAmbience = useCallback(
    (newMode: AmbienceMode, event?: React.MouseEvent | MouseEvent) => {
      if (newMode === currentMode) return;

      const origin = extractOrigin(event);
      setLastOrigin(origin);
      setIsTransitioning(true);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, newMode);
      } catch {}

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const doc = typeof document !== "undefined" ? (document as Document & {
        startViewTransition?: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      }) : null;

      if (!doc || !doc.startViewTransition || prefersReduced) {
        currentMode = newMode;
        applyThemeDOM(newMode);
        emitChange();
        transitionTimerRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 650);
        return;
      }

      // Modern Awwwards Origin-Aware Circular Clip-Path Reveal
      const transition = doc.startViewTransition(() => {
        currentMode = newMode;
        applyThemeDOM(newMode);
        emitChange();
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${origin.endRadius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            {
              duration: 650,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});

      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 650);
    },
    []
  );

  const toggleAmbience = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      setAmbience(currentMode === "day" ? "evening" : "day", event);
    },
    [setAmbience]
  );

  // Keep root attributes synced with external store
  useEffect(() => {
    applyThemeDOM(mode);
  }, [mode]);

  return (
    <AmbienceContext.Provider
      value={{
        mode,
        isEvening,
        toggleAmbience,
        setAmbience,
        isTransitioning,
        lastOrigin,
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
