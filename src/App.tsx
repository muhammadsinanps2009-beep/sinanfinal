/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { NoticeBanner } from './components/NoticeBanner.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { TwoKitchens } from './components/TwoKitchens.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { SignatureDishes } from './components/SignatureDishes.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { VisitUsSection } from './components/VisitUsSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingMobileContact } from './components/FloatingMobileContact.tsx';
import { ReservationModal } from './components/ReservationModal.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';
import { AdminPortal } from './components/admin/AdminPortal.tsx';
import { useTheme } from './context/ThemeContext.tsx';
import { useData } from './context/DataContext.tsx';
import { testFirebaseConnection } from './firebase.ts';

export default function App() {
  const { flashBanner } = useTheme();
  const { isAdminOpen } = useData();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);

  useEffect(() => {
    testFirebaseConnection().catch(() => {
      // Handled silently
    });
  }, []);

  useEffect(() => {
    if (isAdminOpen) return;

    const sections = ['home', 'story', 'menu', 'signatures', 'reviews', 'gallery', 'visitus'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminOpen]);

  // If Admin portal is open (#/admin), render the full Staff Portal
  if (isAdminOpen) {
    return <AdminPortal />;
  }

  return (
    <div className="relative min-h-screen bg-[#14110F] text-[#F6EFE3] selection:bg-[#D9A441] selection:text-[#14110F]">
      {/* 1. Gold Notice Banner (Shown at top if set in settings/site) */}
      <NoticeBanner />

      {/* 2. Minimal Preloader */}
      <Preloader />

      {/* 3. Desktop Custom Cursor */}
      <CustomCursor />

      {/* 4. Sticky Transparent Top Bar with Reservation Modal Trigger */}
      <Header
        activeSection={activeSection}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* 5. Main Experience */}
      <main>
        {/* Cinematic Hero with 3D Platter & Photography */}
        <Hero />

        {/* Two Kitchens Experience: Kerala & Arabian Heritage */}
        <TwoKitchens />

        {/* Interactive Menu Catalog with Live Firestore Sync & Dietary Filters */}
        <MenuSection />

        {/* Signature Dishes Spotlight: Live from Firestore with Fallbacks */}
        <SignatureDishes />

        {/* Diner Reviews & Rating Distribution */}
        <ReviewsSection />

        {/* Asymmetric Visual Feast Gallery */}
        <GallerySection />

        {/* Visit Us with Interactive Directions & Live Site Settings */}
        <VisitUsSection onOpenReservation={() => setIsReservationOpen(true)} />
      </main>

      {/* 6. Luxury Brand Footer with Live Contact & Socials */}
      <Footer />

      {/* 7. Compact Mobile Floating Dial & WhatsApp Bar */}
      <FloatingMobileContact />

      {/* 8. Interactive Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* 9. Floating Theme Quick-Toggle */}
      <ThemeToggle variant="floating" />

      {/* 10. Floating Theme Toast Notification */}
      {flashBanner && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-2.5 rounded-full bg-[#1c1815]/95 text-[#F6EFE3] text-xs font-semibold tracking-widest uppercase border border-[#D9A441]/50 shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
            <span>{flashBanner} Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
