"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show splash screen on first visit per session (not on every navigation)
    const hasSeenSplash = sessionStorage.getItem("octagon-splash-shown");
    if (hasSeenSplash) return;

    // Show splash immediately
    setVisible(true);

    // Start fade-out after 2.2s, fully remove after 2.8s
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("octagon-splash-shown", "1");
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0a0906 0%, #130f04 40%, #1c1608 70%, #0a0906 100%)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "scale(1.03)" : "scale(1)",
        pointerEvents: fadeOut ? "none" : "all",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,162,39,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Particle-like dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            borderRadius: "50%",
            background: "rgba(201,162,39,0.3)",
            top: `${10 + i * 11}%`,
            left: `${5 + i * 12}%`,
            animation: `splashFloat ${2 + i * 0.3}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      {/* Logo container */}
      <div
        style={{
          position: "relative",
          marginBottom: "32px",
          animation: "splashLogoIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both",
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,162,39,0.20) 0%, transparent 70%)",
            animation: "splashPulse 1.5s ease-in-out infinite",
          }}
        />
        {/* Middle ring */}
        <div
          style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "28px",
            border: "1px solid rgba(201,162,39,0.25)",
            animation: "splashRingExpand 2s ease-out 0.3s both",
          }}
        />
        {/* Icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.png"
          alt="CageMind AI"
          width={88}
          height={88}
          style={{
            borderRadius: "20px",
            display: "block",
            boxShadow: "0 0 40px rgba(201,162,39,0.35), 0 8px 32px rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* App name */}
      <div
        style={{
          animation: "splashFadeUp 0.6s ease 0.5s both",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(26px, 6vw, 36px)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "#f5e6c0",
            margin: 0,
            lineHeight: 1.1,
            fontFamily: "var(--font-sans, Inter, sans-serif)",
          }}
        >
          CageMind{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #c9a227, #f0c84a, #c9a227)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </h1>
      </div>

      {/* Tagline */}
      <p
        style={{
          animation: "splashFadeUp 0.6s ease 0.75s both",
          fontSize: "clamp(12px, 3vw, 14px)",
          color: "rgba(201,162,39,0.7)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: "10px",
          marginBottom: 0,
          fontFamily: "var(--font-sans, Inter, sans-serif)",
          fontWeight: 500,
        }}
      >
        UFC &amp; MMA Analytics
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(200px, 50vw)",
          animation: "splashFadeUp 0.4s ease 0.9s both",
        }}
      >
        <div
          style={{
            height: "2px",
            background: "rgba(201,162,39,0.15)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #c9a227, #f0c84a)",
              borderRadius: "2px",
              animation: "splashProgress 2s ease-in-out 0.3s both",
              boxShadow: "0 0 8px rgba(201,162,39,0.6)",
            }}
          />
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.6) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.12); }
        }
        @keyframes splashRingExpand {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes splashProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes splashFloat {
          from { transform: translateY(0px) scale(1); opacity: 0.3; }
          to   { transform: translateY(-12px) scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
