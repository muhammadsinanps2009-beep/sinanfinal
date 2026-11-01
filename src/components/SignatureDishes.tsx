/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Star } from 'lucide-react';
import { siteData } from '../siteData.ts';
import { useData } from '../context/DataContext.tsx';

export const SignatureDishes: React.FC = () => {
  const { signatureDishes } = useData();

  const dish1 = signatureDishes[0]
    ? {
        title: signatureDishes[0].name,
        category: signatureDishes[0].category === 'kerala' ? 'Kerala Culinary Heritage' : 'Arabian Culinary Heritage',
        description: signatureDishes[0].description,
        culturalNote: signatureDishes[0].malayalamName ? `Known locally as ${signatureDishes[0].malayalamName}` : 'Handcrafted daily using traditional slow-roasting techniques.',
        image: signatureDishes[0].image,
      }
    : {
        title: siteData.signatureSpotlights[0].title,
        category: siteData.signatureSpotlights[0].category,
        description: siteData.signatureSpotlights[0].description,
        culturalNote: siteData.signatureSpotlights[0].culturalNote,
        image: siteData.signatureSpotlights[0].image,
      };

  const dish2 = signatureDishes[1]
    ? {
        title: signatureDishes[1].name,
        category: signatureDishes[1].category === 'arabian' ? 'Arabian Heritage Tradition' : 'Malabar Dum Tradition',
        description: signatureDishes[1].description,
        culturalNote: signatureDishes[1].malayalamName ? `Known locally as ${signatureDishes[1].malayalamName}` : 'Sealed and slow-cooked in dum with hand-ground warm spices.',
        image: signatureDishes[1].image,
      }
    : {
        title: siteData.signatureSpotlights[1].title,
        category: siteData.signatureSpotlights[1].category,
        description: siteData.signatureSpotlights[1].description,
        culturalNote: siteData.signatureSpotlights[1].culturalNote,
        image: siteData.signatureSpotlights[1].image,
      };

  return (
    <section id="signatures" className="py-24 bg-[#14110F] text-[#F6EFE3] relative overflow-hidden border-t border-b border-[#D9A441]/15">
      {/* Background warm lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#A63A2B]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <Flame className="w-4 h-4 text-[#A63A2B]" />
            <span>Iconic Dining Highlights</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            THE FLAVOURS THAT DEFINE US.
          </h2>

          <p className="text-sm sm:text-base text-[#F6EFE3]/80 leading-relaxed font-light">
            Culinary pillars celebrated by thousands of travelers and local food lovers in Kalpetta, Wayanad.
          </p>
        </div>

        {/* Feature Dish 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Asymmetric Photography */}
          <div className="lg:col-span-7 relative group">
            <div className="relative overflow-hidden rounded-lg shadow-2xl border border-[#D9A441]/20">
              <img
                src={dish1.image}
                alt={dish1.title}
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#A63A2B] text-white text-[11px] font-bold uppercase tracking-widest rounded-sm">
                Legend 01
              </div>
            </div>
            {/* Visual offset decorative corner */}
            <div className="absolute -bottom-3 -right-3 w-32 h-32 border-b-2 border-r-2 border-[#D9A441]/40 rounded-br-lg pointer-events-none -z-10" />
          </div>

          {/* Descriptive Content */}
          <div className="lg:col-span-5 space-y-5 lg:pl-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-[#D9A441]" />
              <span>{dish1.category}</span>
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#F6EFE3] leading-tight">
              {dish1.title}
            </h3>

            <p className="text-sm sm:text-base text-[#F6EFE3]/85 leading-relaxed font-light">
              {dish1.description}
            </p>

            {dish1.culturalNote && (
              <blockquote className="border-l-2 border-[#D9A441] pl-4 italic text-xs text-[#D9A441]/90 font-editorial">
                "{dish1.culturalNote}"
              </blockquote>
            )}

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Fresh Tawa Prep
              </span>
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Authentic Spices
              </span>
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Fresh Daily
              </span>
            </div>
          </div>
        </div>

        {/* Feature Dish 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8">
          {/* Descriptive Content (Left on desktop for alternating rhythm) */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5 lg:pr-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-[#D9A441]" />
              <span>{dish2.category}</span>
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#F6EFE3] leading-tight">
              {dish2.title}
            </h3>

            <p className="text-sm sm:text-base text-[#F6EFE3]/85 leading-relaxed font-light">
              {dish2.description}
            </p>

            {dish2.culturalNote && (
              <blockquote className="border-l-2 border-[#D9A441] pl-4 italic text-xs text-[#D9A441]/90 font-editorial">
                "{dish2.culturalNote}"
              </blockquote>
            )}

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Authentic Heritage
              </span>
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Pure Ghee & Aromatics
              </span>
              <span className="px-3 py-1 bg-[#1c1815] border border-white/10 rounded text-[#F6EFE3]/80">
                Signature Recipe
              </span>
            </div>
          </div>

          {/* Asymmetric Photography (Right on desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative group">
            <div className="relative overflow-hidden rounded-lg shadow-2xl border border-[#D9A441]/20">
              <img
                src={dish2.image}
                alt={dish2.title}
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#D9A441] text-[#14110F] text-[11px] font-bold uppercase tracking-widest rounded-sm">
                Legend 02
              </div>
            </div>
            {/* Visual offset decorative corner */}
            <div className="absolute -top-3 -left-3 w-32 h-32 border-t-2 border-l-2 border-[#D9A441]/40 rounded-tl-lg pointer-events-none -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
