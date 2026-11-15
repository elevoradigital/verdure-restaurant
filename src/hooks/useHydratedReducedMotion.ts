"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const emptySubscribe = () => () => {};

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useHydratedReducedMotion(): boolean {
  const prefersReduced = useReducedMotion();
  const isMounted = useIsMounted();
  return isMounted && Boolean(prefersReduced);
}
