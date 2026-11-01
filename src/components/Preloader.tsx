/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteData } from '../siteData.ts';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#14110F] text-[#F6EFE3]"
        >
          {/* Subtle gold ornamental emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full border border-[#D9A441]/40 flex items-center justify-center p-2 relative">
              <div className="w-2 h-2 rounded-full bg-[#D9A441]" />
              <div className="absolute inset-0 rounded-full border-t border-[#D9A441] animate-spin" />
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-center"
            >
              <span className="font-editorial text-2xl tracking-[0.25em] text-[#F6EFE3] uppercase block">
                {siteData.brand.shortName}
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#D9A441] uppercase mt-1 block">
                {siteData.brand.locationTag}
              </span>
            </motion.div>
          </motion.div>

          {/* Minimal progress bar */}
          <div className="w-36 h-[1.5px] bg-[#2a2420] mt-8 overflow-hidden rounded-full">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="h-full bg-[#D9A441]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
