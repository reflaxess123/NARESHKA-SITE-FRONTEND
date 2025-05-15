"use client";

import { motion } from "framer-motion";
import React from "react";

// Внутренний компонент для отрисовки SVG путей
function FloatingPathsInternal({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <svg
        className="w-full h-full text-neutral-400 dark:text-neutral-600" // Цвет линий
        viewBox="0 0 696 316" // ViewBox из оригинального примера
        fill="none"
        preserveAspectRatio="xMidYMid slice" // Гарантирует покрытие, может обрезать края
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={Math.min(1, 0.05 + path.id * 0.025)} // Прозрачность линий (0.05 до ~0.925)
            initial={{ pathLength: 0.3, opacity: 0.5 }} // Начальная прозрачность самой анимации пути
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2], // Анимация прозрачности пути
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Экспортируемый компонент, который будет использоваться на страницах
export function AnimatedLinesBackground() {
  return (
    <>
      <FloatingPathsInternal position={1} />
      <FloatingPathsInternal position={-1} />
    </>
  );
}
