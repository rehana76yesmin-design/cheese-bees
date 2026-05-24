import React from 'react';
import { motion } from 'framer-motion';

export default function CinematicBackground() {
  return (
    <div id="cinematic-backdrop-system" className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#030304]">
      {/* 1. Charcoal & Warm Brown Matte Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a] via-[#040405] to-[#010102] opacity-100" />
      
      {/* 2. Abstract Luxury Golden Spotlight (Behind Top Hero Component) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(212,178,111,0.06)_0%,rgba(212,178,111,0.01)_50%,transparent_100%)] pointer-events-none" />

      {/* 3. Floating Light Orbs for Rich Cinematic Ambiance */}
      <div className="absolute inset-0 z-10 opacity-75">
        {/* Orb A: Elegant Soft Amber Glow */}
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -100, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/5 to-gold-500/5 filter blur-[150px]"
        />

        {/* Orb B: Warm Brown Luxury Accent */}
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 80, -60, 0],
            scale: [1, 0.85, 1.1, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[30%] right-[5%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(92,64,33,0.1)_0%,rgba(44,24,9,0.02)_60%,transparent_100%)] filter blur-[160px]"
        />

        {/* Orb C: Charcoal Deep Smoke Drift */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, 40, 90, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[60%] -left-[15%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(26,28,36,0.12)_0%,rgba(13,14,19,0.01)_70%,transparent_100%)] filter blur-[180px]"
        />

        {/* Orb D: Delicate Luxury Gold High Ground */}
        <motion.div
          animate={{
            x: [0, -50, 70, 0],
            y: [0, -30, -80, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-gold-500/4 to-amber-700/5 filter blur-[130px]"
        />
      </div>

      {/* 4. Elegant Subtle Radial Vignette Filter */}
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,3,4,0.72)_100%)] pointer-events-none" />

      {/* 5. Precise Inline Animated Film-Grain Layer (Provides micro-tactile expensive texture) */}
      <div 
        className="absolute inset-0 z-30 opacity-[0.018] mix-blend-overlay pointer-events-none"
        style={{
          backgroundSize: '220px 220px',
          backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%2523noiseFilter)'/></svg>")`
        }}
      />
    </div>
  );
}
