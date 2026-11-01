/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  MessageCircle,
  ExternalLink,
  Search,
  AlertCircle,
} from 'lucide-react';
import { siteData } from '../siteData.ts';
import { useData } from '../context/DataContext.tsx';

interface VisitUsSectionProps {
  onOpenReservation?: () => void;
}

export const VisitUsSection: React.FC<VisitUsSectionProps> = ({ onOpenReservation }) => {
  const { siteSettings } = useData();
  const [startingPoint, setStartingPoint] = useState('');

  const coordinates = siteData.location.coordinates;
  const address = siteSettings.address || siteData.location.address;
  const landmark = siteSettings.landmark || siteData.location.landmark;
  const phone = siteSettings.phone || siteData.location.phone;
  const phoneTelLink = siteSettings.phone
    ? `tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`
    : siteData.location.phoneTelLink;
  const openingHours = {
    schedule: siteSettings.openingHours || siteData.location.openingHours.schedule,
    note: siteSettings.openingHoursNote || siteData.location.openingHours.note,
    isConfirmed: true,
  };
  const whatsappUrl = siteSettings.whatsappNumber
    ? `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Newform%20Restaurant%2C%20I%20would%20like%20to%20inquire%20about%20dining`
    : siteData.location.whatsappPlaceholder;

  // Generate dynamic directions link with custom origin if entered
  const getDirectionsUrl = () => {
    if (startingPoint.trim()) {
      return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        startingPoint.trim()
      )}&destination=${coordinates.latitude},${coordinates.longitude}`;
    }
    return siteData.location.directionsUrl;
  };

  const handleQuickOrigin = (origin: string) => {
    setStartingPoint(origin);
  };

  return (
    <section id="visitus" className="py-24 bg-[#14110F] text-[#F6EFE3] relative border-t border-[#D9A441]/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <MapPin className="w-4 h-4" />
            <span>Location & Hospitality</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            FIND YOUR WAY TO NEWFORM.
          </h2>

          <p className="text-sm sm:text-base text-[#F6EFE3]/80 leading-relaxed font-light">
            Conveniently situated along the main arterial corridor of Kalpetta town, welcoming locals and travelers traversing the scenic hills of Wayanad.
          </p>
        </div>

        {/* Split Layout: Contact & Directions Tool on Left, Interactive Map Embed on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Business Details & Route Calculation Form */}
          <div className="lg:col-span-5 bg-[#1c1815] p-8 sm:p-10 rounded-xl border border-[#D9A441]/20 flex flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D9A441] block mb-1">
                  Restaurant Address
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
                  {siteData.brand.name}
                </h3>
                <p className="mt-2 text-sm text-[#F6EFE3]/85 leading-relaxed font-light">
                  {address}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 text-xs text-[#D9A441] font-medium bg-[#D9A441]/10 px-3 py-1 rounded">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Landmark: {landmark}</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#D9A441] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Dining Hours</span>
                </span>
                <p className="text-sm font-medium text-[#F6EFE3]">
                  {openingHours.schedule}
                </p>
                {!openingHours.isConfirmed && (
                  <p className="text-[11px] text-[#D9A441]/80 italic flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                    <span>{openingHours.note}</span>
                  </p>
                )}
              </div>

              {/* Telephone & Contact */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#D9A441] flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Telephone</span>
                </span>
                <a
                  href={phoneTelLink}
                  className="font-mono text-base font-semibold text-[#F6EFE3] hover:text-[#D9A441] transition-colors block"
                >
                  {phone}
                </a>
              </div>

              {/* Interactive Route Planning Origin Box (User Request) */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <label
                  htmlFor="startingPointInput"
                  className="text-xs uppercase tracking-[0.18em] font-semibold text-[#F6EFE3] block"
                >
                  Calculate Directions From Your Location:
                </label>

                <div className="relative">
                  <input
                    id="startingPointInput"
                    type="text"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    placeholder="Enter starting town, hotel, or landmark (e.g. Vythiri)"
                    className="w-full px-4 py-3 pl-10 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded-sm text-xs sm:text-sm text-[#F6EFE3] placeholder-[#F6EFE3]/40 outline-none transition-all"
                  />
                  <Search className="w-4 h-4 text-[#D9A441] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Popular Wayanad tourist spots quick pick */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#F6EFE3]/50 mr-1">Quick pick:</span>
                  {['Vythiri', 'Meppadi', 'Sulthan Bathery', 'Mananthavady'].map((spot) => (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => handleQuickOrigin(spot)}
                      className="px-3 py-1 text-[11px] rounded-full bg-white/5 hover:bg-[#D9A441]/25 hover:text-[#D9A441] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-[#F6EFE3]/80 cursor-pointer border border-white/5"
                    >
                      {spot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Prominent Get Directions, Book a Table, Call, WhatsApp */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-[#D9A441] hover:bg-[#e6b14d] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D9A441]/30 active:scale-95 text-[#14110F] text-xs uppercase font-bold tracking-[0.18em] rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#D9A441]/10 transition-all duration-300 text-center cursor-pointer group"
              >
                <Navigation className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                <span>
                  {startingPoint.trim()
                    ? `Get Directions from ${startingPoint}`
                    : 'Get Directions to Newform'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>

              {onOpenReservation && (
                <button
                  type="button"
                  onClick={onOpenReservation}
                  className="w-full py-3.5 px-6 bg-[#14110F] hover:bg-[#25201b] hover:-translate-y-1 hover:shadow-lg border border-[#D9A441]/40 hover:border-[#D9A441] text-[#D9A441] text-xs uppercase font-bold tracking-[0.18em] rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm group"
                >
                  <Clock className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Book a Table Online</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={phoneTelLink}
                  className="py-3 px-4 bg-[#241f1b] hover:bg-[#2e2722] hover:-translate-y-0.5 hover:shadow-md text-[#F6EFE3] text-xs uppercase font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all duration-200 text-center group"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D9A441] transition-transform duration-300 group-hover:rotate-12" />
                  <span>Call Restaurant</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#2F5D46] hover:bg-[#396e54] hover:-translate-y-0.5 hover:shadow-md text-white text-xs uppercase font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-sm text-center group"
                >
                  <MessageCircle className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (No API key needed) */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-[#D9A441]/20 shadow-2xl relative min-h-[420px] lg:min-h-[580px] bg-[#1c1815] flex flex-col">
            {/* Top map info bar */}
            <div className="bg-[#1c1815] px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs text-[#F6EFE3]/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D9A441]" />
                <span className="font-semibold text-[#F6EFE3]">Newform Restaurant</span>
                <span className="text-[#F6EFE3]/50">· Kalpetta, Wayanad</span>
              </div>
              <span className="font-mono text-[11px] text-[#D9A441]">
                {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E
              </span>
            </div>

            {/* Embedded Responsive Google Map */}
            <div className="relative flex-1 w-full min-h-[380px]">
              <iframe
                title="Newform Restaurant Google Map Location"
                src={siteData.location.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
