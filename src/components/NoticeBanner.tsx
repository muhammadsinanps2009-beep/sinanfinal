/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useData } from '../context/DataContext.tsx';

export const NoticeBanner: React.FC = () => {
  const { siteSettings, hasNoticeBanner } = useData();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!hasNoticeBanner || isDismissed) {
    return null;
  }

  return (
    <div className="relative z-50 bg-[#D9A441] text-[#14110F] px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Megaphone className="w-4 h-4 shrink-0 animate-pulse text-[#14110F]" />
          <span className="font-medium text-[#14110F]">{siteSettings.noticeBanner}</span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss notice"
          className="p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
