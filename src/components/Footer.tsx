/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, Instagram, Facebook, UtensilsCrossed, Lock } from 'lucide-react';
import { siteData } from '../siteData.ts';
import { useData } from '../context/DataContext.tsx';

export const Footer: React.FC = () => {
  const { siteSettings, openAdmin } = useData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our Story', href: '#story' },
    { label: 'Menu Catalog', href: '#menu' },
    { label: 'Signatures', href: '#signatures' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Photo Gallery', href: '#gallery' },
    { label: 'Visit Us', href: '#visitus' },
  ];

  const address = siteSettings.address || siteData.location.address;
  const landmark = siteSettings.landmark || siteData.location.landmark;
  const phone = siteSettings.phone || siteData.location.phone;
  const phoneTelLink = siteSettings.phone
    ? `tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`
    : siteData.location.phoneTelLink;

  const instagram = siteSettings.socialLinks?.instagram || siteData.socialLinks.instagram;
  const facebook = siteSettings.socialLinks?.facebook || siteData.socialLinks.facebook;
  const swiggy = siteSettings.socialLinks?.swiggy || siteData.socialLinks.swiggy;
  const zomato = siteSettings.socialLinks?.zomato || siteData.socialLinks.zomato;

  return (
    <footer className="bg-[#0e0c0b] text-[#F6EFE3] pt-16 pb-12 border-t border-[#D9A441]/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-editorial text-2xl tracking-[0.2em] font-bold text-[#F6EFE3] uppercase block">
              {siteData.brand.shortName}
            </span>
            <p className="font-editorial italic text-sm text-[#D9A441]">
              "{siteData.brand.tagline}"
            </p>
            <p className="text-xs text-[#F6EFE3]/70 leading-relaxed max-w-sm font-light">
              Authentic Kerala comfort cuisine and fragrant Arabian feasts, prepared daily with dedication and served in the heart of Kalpetta town, Wayanad.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#D9A441] block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs text-[#F6EFE3]/75 font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-[#D9A441] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Delivery */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#D9A441] block">
              Location & Contact
            </span>
            <div className="text-xs text-[#F6EFE3]/75 space-y-1.5 font-light">
              <p>{address}</p>
              <p className="text-[#D9A441]">Landmark: {landmark}</p>
              <p className="pt-1">
                Tel:{' '}
                <a
                  href={phoneTelLink}
                  className="hover:text-white font-mono"
                >
                  {phone}
                </a>
              </p>
            </div>

            {/* Social & Delivery Profiles */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#F6EFE3]/50 block">
                Social & Delivery Profiles
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram profile"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] hover:-translate-y-1 hover:shadow-md active:scale-90 transition-all duration-300 text-white/80 cursor-pointer"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}

                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook page"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] hover:-translate-y-1 hover:shadow-md active:scale-90 transition-all duration-300 text-white/80 cursor-pointer"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}

                {swiggy && (
                  <a
                    href={swiggy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-[11px] font-semibold flex items-center gap-1.5 text-white/80 cursor-pointer"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Swiggy</span>
                  </a>
                )}

                {zomato && (
                  <a
                    href={zomato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-[11px] font-semibold flex items-center gap-1.5 text-white/80 cursor-pointer"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Zomato</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Staff Portal & Back to Top */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6EFE3]/50">
          <p>
            © {new Date().getFullYear()} {siteData.brand.name}. All rights reserved. Mandayapuram, Kalpetta, Kerala.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={openAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-[#F6EFE3]/60 hover:text-[#D9A441] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Staff & Admin Portal</span>
            </button>

            <span>·</span>

            <button
              onClick={scrollToTop}
              className="px-4 py-2 rounded-full border border-white/10 hover:border-[#D9A441] hover:text-[#D9A441] hover:bg-[#D9A441]/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
