/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface ThemeToggleProps {
  variant?: 'header' | 'floating' | 'pill';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'header',
  showLabel = true,
}) => {
  const { theme, isLight, toggleTheme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    toggleTheme();
    setTimeout(() => setIsRotating(false), 500);
  };

  if (variant === 'floating') {
    return (
      <div className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 flex items-center">
        <button
          onClick={handleClick}
          title={isLight ? 'Switch to Cinematic Dark Mode' : 'Switch to Clean White Mode'}
          aria-label={isLight ? 'Switch to Cinematic Dark Mode' : 'Switch to Clean White Mode'}
          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer backdrop-blur-xl border ${
            isLight
              ? 'bg-white/90 text-stone-900 border-[#D9A441]/40 shadow-stone-400/30 hover:border-[#D9A441]'
              : 'bg-[#1c1815]/90 text-[#F6EFE3] border-[#D9A441]/30 shadow-black/80 hover:border-[#D9A441]'
          }`}
        >
          {/* Animated Background Aura */}
          <span
            className={`absolute inset-0 rounded-full blur-md opacity-30 transition-all duration-500 pointer-events-none ${
              isLight ? 'bg-amber-300 group-hover:opacity-60' : 'bg-[#D9A441] group-hover:opacity-50'
            }`}
          />

          {/* Morphing Icon with Rotation */}
          <div
            className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-500 ease-out ${
              isRotating ? 'rotate-[360deg] scale-110' : ''
            } ${isLight ? 'bg-amber-100 text-[#B87B1A]' : 'bg-[#14110F] text-[#D9A441]'}`}
          >
            {isLight ? (
              <Sun className="w-3.5 h-3.5 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
            )}
          </div>

          {/* Text Badge */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold opacity-60">
              Theme
            </span>
            <span className="text-[11px] font-bold tracking-wider font-mono">
              {isLight ? 'CLEAN WHITE' : 'CINEMATIC'}
            </span>
          </div>

          {/* Sparkle subtle highlight */}
          <Sparkles className="w-3 h-3 text-[#D9A441] animate-pulse ml-0.5" />
        </button>
      </div>
    );
  }

  // Header / Capsule Pill Switcher
  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleClick}
        title={isLight ? 'Switch to Cinematic Dark' : 'Switch to Clean White Mode'}
        aria-label={isLight ? 'Switch to Cinematic Dark' : 'Switch to Clean White Mode'}
        className={`relative flex items-center p-1 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isLight
            ? 'bg-stone-100/90 border-stone-300 hover:border-[#D9A441] shadow-inner'
            : 'bg-[#1c1815]/90 border-white/15 hover:border-[#D9A441]/50 shadow-inner'
        }`}
      >
        {/* Sliding Indicator Capsule */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
            isLight
              ? 'translate-x-[calc(100%+4px)] bg-[#B87B1A] shadow-amber-900/20'
              : 'translate-x-0 bg-[#D9A441] shadow-[#D9A441]/30'
          }`}
        />

        {/* Dark Mode Side */}
        <div
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors duration-200 ${
            !isLight ? 'text-[#14110F] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Moon
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              !isLight ? 'scale-110 -rotate-12' : 'scale-90'
            }`}
          />
          {showLabel && (
            <span className="text-[10px] tracking-wider uppercase font-semibold select-none hidden sm:inline">
              Dark
            </span>
          )}
        </div>

        {/* Clean White Side */}
        <div
          className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors duration-200 ${
            isLight ? 'text-white font-bold' : 'text-[#F6EFE3]/50 hover:text-[#F6EFE3]'
          }`}
        >
          <Sun
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isLight ? 'scale-110 rotate-45' : 'scale-90'
            }`}
          />
          {showLabel && (
            <span className="text-[10px] tracking-wider uppercase font-semibold select-none hidden sm:inline">
              Clean
            </span>
          )}
        </div>
      </button>
    </div>
  );
};
