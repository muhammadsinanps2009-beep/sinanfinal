/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Utensils, Check } from 'lucide-react';
import { siteData, DietaryTag } from '../siteData.ts';
import { IMAGES } from '../assets.ts';
import { useData } from '../context/DataContext.tsx';

export const MenuSection: React.FC = () => {
  const { availableDishes } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('kerala');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag | 'All'>('All');

  const dietaryOptions: { label: string; value: DietaryTag | 'All' }[] = [
    { label: 'All Dishes', value: 'All' },
    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Gluten-Free', value: 'Gluten-Free' },
    { label: 'Spicy', value: 'Spicy' },
  ];

  // Dynamic instant filtering using live Firestore dishes with siteData fallback
  const filteredDishes = useMemo(() => {
    return availableDishes.filter((dish) => {
      const matchesCategory = dish.category === activeCategory;
      const matchesDietary =
        selectedDietary === 'All' ? true : dish.dietaryTags.includes(selectedDietary);
      return matchesCategory && matchesDietary;
    });
  }, [availableDishes, activeCategory, selectedDietary]);

  return (
    <section id="menu" className="relative py-24 bg-[#14110F] text-[#F6EFE3] film-grain">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <Utensils className="w-4 h-4" />
            <span>Curated Culinary Offerings</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            MADE TO MAKE YOU COME BACK.
          </h2>

          <p className="text-sm sm:text-base text-[#F6EFE3]/80 leading-relaxed font-light">
            Explore a menu bringing together authentic flavours from different culinary cultures, seasoned to perfection and served fresh daily.
          </p>
        </div>

        {/* 1. Category Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-8">
          {siteData.menuCategories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#D9A441] text-[#14110F] shadow-lg shadow-[#D9A441]/25 font-bold -translate-y-0.5'
                    : 'bg-[#1c1815] text-[#F6EFE3]/70 hover:text-[#F6EFE3] hover:bg-[#25201c] hover:-translate-y-0.5 active:scale-95 border border-white/5'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* 2. Dynamic Dietary Filter Toolbar (Prompt Requirement) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-[#1c1815] border border-[#D9A441]/15 mb-12">
          <div className="text-xs uppercase tracking-[0.16em] text-[#D9A441] font-semibold flex items-center gap-2">
            <span>Filter by Dietary Preference:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {dietaryOptions.map((opt) => {
              const isSelected = selectedDietary === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDietary(opt.value)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                    isSelected
                      ? 'bg-[#F6EFE3] text-[#14110F] font-semibold shadow-md -translate-y-0.5'
                      : 'bg-black/40 text-[#F6EFE3]/70 hover:text-[#F6EFE3] hover:bg-black/60 border border-white/5'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#A63A2B]" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Filtered Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="group relative bg-[#1c1815] rounded-lg overflow-hidden border border-white/5 hover:border-[#D9A441]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between"
              >
                {/* Dish Photography with Zoom */}
                <div className="relative h-56 w-full overflow-hidden bg-[#241f1a]">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== IMAGES.biryani) {
                        target.src = IMAGES.biryani;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1815] via-transparent to-transparent" />

                  {/* Badges: Signature & Confirmation */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {dish.isSignature && (
                      <span className="px-2.5 py-1 bg-[#D9A441] text-[#14110F] text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Signature</span>
                      </span>
                    )}

                    {dish.needsConfirmation && (
                      <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[#D9A441] border border-[#D9A441]/40 text-[10px] tracking-wide rounded-sm flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>Confirm with Owner</span>
                      </span>
                    )}
                  </div>

                  {/* Dietary chips at bottom of photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 text-[10px] text-[#F6EFE3]/80">
                    {dish.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#F6EFE3] group-hover:text-[#D9A441] transition-colors leading-snug">
                      {dish.name}
                    </h3>

                    {dish.malayalamName && (
                      <span className="text-xs text-[#D9A441]/85 font-medium block mt-0.5">
                        {dish.malayalamName}
                      </span>
                    )}

                    <p className="mt-2 text-xs text-[#F6EFE3]/70 leading-relaxed font-light line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  {/* Footer of Card: Price & Status */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    {dish.price ? (
                      <span className="font-mono text-sm font-semibold text-[#D9A441] tabular-nums">
                        {dish.price}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#F6EFE3]/50 italic">
                        Price on order / Affordable daily
                      </span>
                    )}

                    <span className="text-[10px] uppercase tracking-wider text-[#D9A441] opacity-0 group-hover:opacity-100 transition-opacity">
                      Authentic Recipe →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#1c1815] rounded-lg border border-white/10 max-w-lg mx-auto space-y-3">
            <p className="text-sm text-[#F6EFE3]/80">
              No dishes found matching <span className="text-[#D9A441] font-semibold">"{selectedDietary}"</span> in {activeCategory} category.
            </p>
            <button
              onClick={() => setSelectedDietary('All')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold bg-[#D9A441] text-[#14110F] hover:bg-[#e6b14d] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 rounded-full cursor-pointer shadow-md"
            >
              Reset Dietary Filter
            </button>
          </div>
        )}

        {/* Note on Menu Verification */}
        <div className="mt-12 text-center text-xs text-[#F6EFE3]/50 max-w-xl mx-auto italic">
          * Menu items and daily special availability may vary. All prices are kept deliberately affordable and friendly to local diners and visiting travelers.
        </div>
      </div>
    </section>
  );
};
