/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Flame, Sparkles, ChefHat } from 'lucide-react';
import { IMAGES } from '../assets.ts';

export const TwoKitchens: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kerala' | 'arabian'>('kerala');

  return (
    <section id="story" className="relative py-24 bg-[#14110F] text-[#F6EFE3] transition-colors border-t border-[#D9A441]/15 film-grain">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <ChefHat className="w-4 h-4" />
            <span>Our Culinary Philosophy</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            TWO KITCHENS. ONE TABLE.
          </h2>

          <p className="text-base sm:text-lg text-[#F6EFE3]/80 leading-relaxed font-light">
            From the rich traditions of Kerala cuisine to the bold flavours of Arabian food, Newform brings two distinct culinary experiences together under one roof in Kalpetta.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#F6EFE3]/70">
            <span>Distinct Cooking Sections</span>
            <span aria-hidden="true" className="text-[#D9A441]">·</span>
            <span>Affordable Everyday Prices</span>
            <span aria-hidden="true" className="text-[#D9A441]">·</span>
            <span>Chinese & Sweet Delicacies</span>
          </div>
        </div>

        {/* Interactive Kitchen Selector Switch */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-[#1c1815] rounded-full border border-white/15 shadow-lg">
            <button
              onClick={() => setActiveTab('kerala')}
              className={`px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'kerala'
                  ? 'bg-[#A63A2B] text-white shadow-lg -translate-y-0.5'
                  : 'text-[#F6EFE3]/70 hover:text-[#F6EFE3] hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              <Flame className="w-4 h-4 text-white transition-transform duration-300" />
              <span>The Kerala Kitchen</span>
            </button>

            <button
              onClick={() => setActiveTab('arabian')}
              className={`px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === 'arabian'
                  ? 'bg-[#2F5D46] text-white shadow-lg -translate-y-0.5'
                  : 'text-[#F6EFE3]/70 hover:text-[#F6EFE3] hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D9A441] transition-transform duration-300" />
              <span>The Arabian Kitchen</span>
            </button>
          </div>
        </div>

        {/* Content Showcase: Kerala vs Arabian */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {activeTab === 'kerala' ? (
            <>
              {/* Kerala Kitchen Image Showcase */}
              <div className="lg:col-span-7 relative group overflow-hidden rounded-xl shadow-2xl border border-white/10 min-h-[380px] lg:min-h-[480px]">
                <img
                  src={IMAGES.beefFry}
                  alt="Traditional Kerala Beef Fry with flaky Parotta"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold">
                    God's Own Spices & Tawa
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                    The Soul of Kerala Flavours
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-lg">
                    Handmade layered parottas beat on the tawa until flaky, paired with roasted coconut and cracked black pepper gravies.
                  </p>
                </div>
              </div>

              {/* Kerala Kitchen Narrative */}
              <div className="lg:col-span-5 bg-[#1c1815] p-8 lg:p-10 rounded-xl border border-white/10 flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441]">
                    Kitchen Heritage 01
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F6EFE3]">
                    THE KERALA KITCHEN
                  </h3>
                  <p className="text-sm text-[#F6EFE3]/80 leading-relaxed font-light">
                    Kerala food at Newform celebrates the time-honoured techniques of coastal and Malabar cooking. Our slow-cooked beef roast, flaky layered parottas, and traditional biryanis rely on fresh stone-ground spices, toasted coconut slivers, and fragrant local curry leaves.
                  </p>

                  <div className="pt-2 space-y-2.5 text-xs text-[#F6EFE3]/90">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#A63A2B] font-bold text-sm">✓</span>
                      <span>Flaky Malabar Parotta made fresh to order on seasoned tawas.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#A63A2B] font-bold text-sm">✓</span>
                      <span>Slow-roasted beef fry with browned coconut chips and black pepper.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#A63A2B] font-bold text-sm">✓</span>
                      <span>Sealed Dum Biryani infused with whole cardamom, cloves, and ghee.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#14110F] rounded-lg border border-white/10">
                  <span className="text-xs font-semibold text-[#D9A441] uppercase tracking-wider block mb-1">
                    Authentic & Affordable
                  </span>
                  <p className="text-xs text-[#F6EFE3]/70">
                    Generous portions crafted for local diners, students, and traveling families without luxury restaurant price markups.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Arabian Kitchen Image Showcase */}
              <div className="lg:col-span-7 relative group overflow-hidden rounded-xl shadow-2xl border border-white/10 min-h-[380px] lg:min-h-[480px]">
                <img
                  src={IMAGES.mandi}
                  alt="Authentic Arabian Mandi feast with roasted chicken and long grain rice"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold">
                    Middle Eastern Traditions
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                    The Fragrance of Arabian Feasts
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-lg">
                    Whole roasted poultry and tender lamb over long-grain fragrant rice, complemented by pungent garlic toum and spicy dakous salsa.
                  </p>
                </div>
              </div>

              {/* Arabian Kitchen Narrative */}
              <div className="lg:col-span-5 bg-[#1c1815] p-8 lg:p-10 rounded-xl border border-white/10 flex flex-col justify-between space-y-6 shadow-xl">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441]">
                    Kitchen Heritage 02
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F6EFE3]">
                    THE ARABIAN KITCHEN
                  </h3>
                  <p className="text-sm text-[#F6EFE3]/80 leading-relaxed font-light">
                    Arabian cuisine has become an integral chapter in Kerala's dining culture. Our Arabian kitchen specializes in pit-style Mandi, charcoal-grilled Al Faham, and spiced rice platters created for communal sharing among friends and families.
                  </p>

                  <div className="pt-2 space-y-2.5 text-xs text-[#F6EFE3]/90">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#2F5D46] font-bold text-sm">✓</span>
                      <span>Fragrant Mandi with spiced tender meat and toasted dried fruits.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#2F5D46] font-bold text-sm">✓</span>
                      <span>Charcoal-grilled chicken with authentic Middle Eastern garlic toum.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#2F5D46] font-bold text-sm">✓</span>
                      <span>Generous family platters designed for communal dining enjoyment.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#14110F] rounded-lg border border-white/10">
                  <span className="text-xs font-semibold text-[#D9A441] uppercase tracking-wider block mb-1">
                    Communal Feasting
                  </span>
                  <p className="text-xs text-[#F6EFE3]/70">
                    Served on large traditional trays designed for the warm social spirit of Arabian dining.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
