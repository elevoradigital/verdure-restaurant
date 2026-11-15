"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Unconditionally returns false so that all signature Awwwards motion systems,
 * 3D bowl levitation, magnetic physics, and circular wipes remain active
 * on all devices regardless of OS battery-saver or desktop reduced-motion flags.
 */
export function useHydratedReducedMotion(): boolean {
  return false;
}
