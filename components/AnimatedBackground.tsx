"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#EFE9E3] dark:bg-[#030303]">
      {/* Radial Gradient Glows */}
      <div
        className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 hidden opacity-[0.25] dark:block"
        style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 block dark:hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Moving Particles/Symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const x0 = (i * 17) % 100;
          const y0 = (i * 23) % 100;
          const x1 = (i * 31) % 100;
          const y1 = (i * 41) % 100;
          const scale = 0.5 + (i % 10) / 20;
          const duration = 20 + (i % 15);
          return (
            <motion.div
              key={i}
              className="pointer-events-none absolute select-none text-primary/20"
              initial={{ x: `${x0}%`, y: `${y0}%`, opacity: 0, scale }}
              animate={{
                x: [`${x0}%`, `${x1}%`],
                y: [`${y0}%`, `${y1}%`],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: `${10 + (i % 7) * 2}px` }}
            >
              {["{ }", "</>", "[]", "()", ";", "#", "=>"][i % 7]}
            </motion.div>
          );
        })}
      </div>

      {/* Central Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(239,233,227,1)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(15,15,15,0)_0%,rgba(3,3,3,1)_100%)]" />
    </div>
  );
}
