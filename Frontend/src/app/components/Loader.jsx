import React from 'react';
import { motion } from 'motion/react';

const Loader = ({ message = 'Loading...', fullScreen = true }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl select-none'
    : 'relative flex flex-col items-center justify-center p-8 w-full min-h-[300px] bg-black/80 rounded-2xl border border-white/10 backdrop-blur-xl select-none';

  return (
    <div className={containerClasses}>
      {/* Background Silver Ambient Glow */}
      <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 bg-zinc-400/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-500" />

      {/* Main Loader Rings (Black & Silver Theme) */}
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Outer Ring - Clockwise Fast Spin (Pure Silver Metallic) */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-zinc-400 shadow-[0_0_30px_rgba(255,255,255,0.35)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />

        {/* Middle Ring - Counter Clockwise Slow Spin (Platinum Silver) */}
        <motion.div
          className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-zinc-300 border-l-zinc-600 shadow-[0_0_20px_rgba(212,212,216,0.25)]"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
        />

        {/* Innermost Dashed Ring */}
        <motion.div
          className="absolute inset-5 rounded-full border-2 border-dashed border-white/25"
          animate={{ rotate: 360, scale: [0.92, 1.06, 0.92] }}
          transition={{
            rotate: { repeat: Infinity, duration: 3.5, ease: 'linear' },
            scale: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
          }}
        />

        {/* Center Silver Core Orb */}
        <motion.div
          className="w-5 h-5 bg-gradient-to-tr from-zinc-300 via-white to-zinc-400 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.9)]"
          animate={{ scale: [0.85, 1.25, 0.85], opacity: [0.75, 1, 0.75] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Loading Message & Silver Bouncing Dots */}
      <div className="mt-8 flex flex-col items-center gap-2.5 z-10">
        <motion.p
          className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-white to-zinc-400 font-semibold tracking-widest text-sm uppercase"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
        
        {/* Animated Bouncing Silver Dots */}
        <div className="flex items-center gap-2 mt-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white to-zinc-400 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              animate={{ y: [0, -6, 0], opacity: [0.35, 1, 0.35] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
