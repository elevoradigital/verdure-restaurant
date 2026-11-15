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
  toggleAmbience: (event?: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => void;
  setAmbience: (mode: AmbienceMode, event?: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => void;
  isTransitioning: boolean;
  lastOrigin: TransitionOrigin | null;
  targetMode: AmbienceMode | null;
  isMobileTransition: boolean;
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

function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

function extractOrigin(
  event?: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent
): TransitionOrigin {
  if (typeof window === "undefined") {
    return { x: 0, y: 0, endRadius: 1000 };
  }
  let x: number | null = null;
  let y: number | null = null;

  // 1. From clicked/tapped target element
  if (event && "currentTarget" in event && event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  }

  // 2. From touch coordinates if available
  if (x === null && event && "touches" in event && (event as TouchEvent).touches?.length > 0) {
    const touch = (event as TouchEvent).touches[0];
    x = touch.clientX;
    y = touch.clientY;
  }

  // 3. From mouse coordinates
  if (
    x === null &&
    event &&
    "clientX" in event &&
    typeof (event as MouseEvent).clientX === "number" &&
    ((event as MouseEvent).clientX > 0 || (event as MouseEvent).clientY > 0)
  ) {
    x = (event as MouseEvent).clientX;
    y = (event as MouseEvent).clientY;
  }

  // 4. Default fallback: Top-right navbar toggle area
  if (x === null || y === null) {
    const isMobile = window.innerWidth < 768;
    x = isMobile ? window.innerWidth - 48 : window.innerWidth * 0.78;
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
  const [targetMode, setTargetMode] = useState<AmbienceMode | null>(null);
  const [isMobileTransition, setIsMobileTransition] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    (newMode: AmbienceMode, event?: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      if (newMode === currentMode) return;

      const origin = extractOrigin(event);
      const isMobile = checkIsMobile();

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);

      setLastOrigin(origin);
      setTargetMode(newMode);
      setIsMobileTransition(isMobile);
      setIsTransitioning(true);

      try {
        sessionStorage.setItem(STORAGE_KEY, newMode);
      } catch {}

      if (typeof document !== "undefined") {
        document.documentElement.classList.add("theme-switching");
      }

      const doc = typeof document !== "undefined" ? (document as Document & {
        startViewTransition?: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      }) : null;

      // ==============================================================
      // 1. MOBILE ZERO-LAG GPU SCALE3D PORTAL ENGINE (<768px or touch)
      // Or fallback when startViewTransition is unsupported
      // ==============================================================
      if (isMobile || !doc || !doc.startViewTransition) {
        // At mid-expansion (210ms), seamlessly flip underlying CSS variables
        switchTimerRef.current = setTimeout(() => {
          currentMode = newMode;
          applyThemeDOM(newMode);
          emitChange();
        }, 210);

        // At 390ms, end transition and restore normal CSS rules
        transitionTimerRef.current = setTimeout(() => {
          setIsTransitioning(false);
          setTargetMode(null);
          if (typeof document !== "undefined") {
            document.documentElement.classList.remove("theme-switching");
          }
        }, 390);
        return;
      }

      // ==============================================================
      // 2. DESKTOP AWWWARDS ORIGIN-AWARE CIRCULAR CLIP-PATH WIPE (>=768px)
      // ==============================================================
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
        setTargetMode(null);
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("theme-switching");
        }
      }, 650);
    },
    []
  );

  const toggleAmbience = useCallback(
    (event?: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      setAmbience(currentMode === "day" ? "evening" : "day", event);
    },
    [setAmbience]
  );

  // Keep root attributes synced with external store
  useEffect(() => {
    applyThemeDOM(mode);
  }, [mode]);

  const contextValue = React.useMemo(
    () => ({
      mode,
      isEvening,
      toggleAmbience,
      setAmbience,
      isTransitioning,
      lastOrigin,
      targetMode,
      isMobileTransition,
    }),
    [
      mode,
      isEvening,
      toggleAmbience,
      setAmbience,
      isTransitioning,
      lastOrigin,
      targetMode,
      isMobileTransition,
    ]
  );

  return (
    <AmbienceContext.Provider value={contextValue}>
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
