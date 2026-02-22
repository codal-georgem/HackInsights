"use client";

import confetti from "canvas-confetti";

const COLORS = ["#4432F5", "#6457F0", "#a5b4fc", "#FFD700", "#ffffff", "#f472b6"];

export function triggerCelebration() {
  // Left burst — shoots right
  confetti({
    particleCount: 70,
    angle: 60,
    spread: 75,
    origin: { x: 0, y: 0.65 },
    colors: COLORS,
    gravity: 0.9,
    scalar: 1.2,
    drift: 0.2,
  });

  // Right burst — shoots left
  confetti({
    particleCount: 70,
    angle: 120,
    spread: 75,
    origin: { x: 1, y: 0.65 },
    colors: COLORS,
    gravity: 0.9,
    scalar: 1.2,
    drift: -0.2,
  });

  // Second wave: center burst after a short delay
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 55,
      origin: { x: 0.5, y: 0.6 },
      colors: COLORS,
      gravity: 1.2,
      scalar: 0.9,
      ticks: 200,
    });
  }, 320);
}
