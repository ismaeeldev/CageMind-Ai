"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log("[PWA] Unregistered active service worker for development.");
            }
          });
        }
      });
      return;
    }

    // Register service worker after page load (non-blocking)
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        // Check for updates periodically (every 60 minutes)
        setInterval(() => registration.update(), 60 * 60 * 1000);

        registration.addEventListener("updatefound", () => {
          const newSW = registration.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            // New service worker is ready — page will pick it up on next navigation
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              console.log("[PWA] New version available — will update on next visit.");
            }
          });
        });
      } catch (err) {
        // Silently fail — PWA is an enhancement, not a requirement
        console.warn("[PWA] Service worker registration failed:", err);
      }
    };

    // Defer until after page is fully loaded
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW, { once: true });
    }
  }, []);

  return null; // Renders nothing — pure side-effect component
}
