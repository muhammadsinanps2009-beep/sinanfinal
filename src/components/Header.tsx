/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, PhoneCall, Lock } from 'lucide-react';
import { siteData } from '../siteData.ts';
import { ThemeToggle } from './ThemeToggle.tsx';
import { useData } from '../context/DataContext.tsx';

interface HeaderProps {
  activeSection?: string;
  onOpenReservation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection = 'home', onOpenReservation }) => {
  const { openAdmin } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Our Story', href: '#story', id: 'story' },
    { label: 'Menu', href: '#menu', id: 'menu' },
    { label: 'Signatures', href: '#signatures', id: 'signatures' },
    { label: 'Reviews', href: '#reviews', id: 'reviews' },
    { label: 'Gallery', href: '#gallery', id: 'gallery' },
    { label: 'Visit Us', href: '#visitus', id: 'visitus' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#14110F]/90 backdrop-blur-md border-b border-[#D9A441]/15 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="font-editorial text-2xl tracking-[0.2em] font-bold text-[#F6EFE3] hover:text-[#D9A441] transition-colors whitespace-nowrap shrink-0"
        >
          {siteData.brand.shortName}
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-medium text-[#F6EFE3]/80">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative py-1 transition-colors hover:text-[#D9A441] whitespace-nowrap shrink-0 ${
                  isActive ? 'text-[#D9A441] font-semibold' : 'text-[#F6EFE3]/80'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D9A441]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Dark/White Clean Mode Switcher, Booking CTA & Staff Portal */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <ThemeToggle variant="pill" showLabel={true} />
          
          <button
            onClick={() => {
              if (onOpenReservation) {
                onOpenReservation();
              } else {
                handleNavClick('#visitus');
              }
            }}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#14110F] bg-[#D9A441] hover:bg-[#e6b14d] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D9A441]/25 active:scale-95 transition-all duration-300 rounded-full shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <PhoneCall className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
            <span>Book a Table</span>
          </button>

          <button
            onClick={openAdmin}
            title="Staff & Management Portal"
            className="p-2 text-[#F6EFE3]/70 hover:text-[#D9A441] hover:bg-white/5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-[#D9A441]/30"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Header Actions: Quick Theme Toggle & Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle variant="pill" showLabel={false} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="p-2.5 text-[#F6EFE3] hover:text-[#D9A441] hover:bg-white/5 active:scale-90 transition-all duration-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#D9A441]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#14110F]/98 border-b border-[#D9A441]/20 px-6 py-6 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-[0.16em]">
            <div className="py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#D9A441]">Appearance</span>
              <ThemeToggle variant="pill" showLabel={true} />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`py-2 border-b border-white/5 transition-colors ${
                  activeSection === link.id
                    ? 'text-[#D9A441] font-semibold'
                    : 'text-[#F6EFE3]/80 hover:text-[#D9A441]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenReservation) {
                  onOpenReservation();
                } else {
                  handleNavClick('#visitus');
                }
              }}
              className="mt-2 w-full py-3.5 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#14110F] bg-[#D9A441] hover:bg-[#e6b14d] active:scale-95 transition-all duration-200 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book a Table</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAdmin();
              }}
              className="mt-1 w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#D9A441] bg-white/5 hover:bg-white/10 border border-[#D9A441]/30 rounded-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff & Admin Portal</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
