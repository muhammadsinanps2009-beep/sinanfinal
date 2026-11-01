/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { siteData } from '../siteData.ts';
import { useData } from '../context/DataContext.tsx';

export const FloatingMobileContact: React.FC = () => {
  const { siteSettings } = useData();

  const phoneTelLink = siteSettings.phone
    ? `tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`
    : siteData.location.phoneTelLink;

  const whatsappLink = siteSettings.whatsappNumber
    ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Newform%20Restaurant%2C%20I%20would%20like%20to%20inquire%20about%20dining%20and%20takeaway`
    : siteData.location.whatsappPlaceholder;

  return (
    <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-3 pointer-events-auto">
      {/* Call button */}
      <a
        href={phoneTelLink}
        className="flex-1 py-3 px-4 bg-[#14110F]/95 backdrop-blur-md border border-[#D9A441]/40 rounded-full text-xs font-bold uppercase tracking-wider text-[#D9A441] shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
      >
        <Phone className="w-4 h-4 text-[#D9A441]" />
        <span>Call Restaurant</span>
      </a>

      {/* WhatsApp button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="py-3 px-5 bg-[#2F5D46] border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};
