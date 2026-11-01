/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, ExternalLink, ThumbsUp } from 'lucide-react';
import { siteData } from '../siteData.ts';

export const ReviewsSection: React.FC = () => {
  const [animatedCount, setAnimatedCount] = useState(0);

  // Animated count-up to 3303
  useEffect(() => {
    let start = 0;
    const end = siteData.reviews.totalReviews;
    const duration = 1800; // 1.8s
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedCount(end);
        clearInterval(timer);
      } else {
        setAnimatedCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="py-24 bg-[#14110F] text-[#F6EFE3] relative border-t border-[#D9A441]/15 film-grain">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <ThumbsUp className="w-4 h-4 text-[#A63A2B]" />
            <span>Community & Diner Trust</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            GOOD FOOD. GREAT MEMORIES.
          </h2>

          <p className="text-base text-[#F6EFE3]/80 leading-relaxed font-light">
            Recognised by residents, families, and road-trippers stopping in Kalpetta on their Wayanad journeys.
          </p>
        </div>

        {/* Rating Overview & Exact Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#1c1815] p-8 sm:p-12 rounded-xl shadow-2xl border border-white/10">
          {/* Big Score Card */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-10">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441]">
              Google Verified Rating
            </span>

            <div className="flex items-baseline justify-center lg:justify-start gap-3">
              <span className="font-editorial text-6xl sm:text-7xl font-bold text-[#F6EFE3]">
                4.0
              </span>
              <span className="text-xl sm:text-2xl text-[#F6EFE3]/50 font-editorial">/ 5.0</span>
            </div>

            {/* 4 Gold Stars + 1 Outline Star */}
            <div className="flex items-center justify-center lg:justify-start gap-1 text-[#D9A441]">
              <Star className="w-5 h-5 fill-[#D9A441]" />
              <Star className="w-5 h-5 fill-[#D9A441]" />
              <Star className="w-5 h-5 fill-[#D9A441]" />
              <Star className="w-5 h-5 fill-[#D9A441]" />
              <Star className="w-5 h-5 text-[#D9A441]" />
            </div>

            <p className="text-sm font-medium text-[#F6EFE3]/80">
              Based on{' '}
              <span className="font-bold font-mono tabular-nums text-[#D9A441]">
                {animatedCount.toLocaleString()}+
              </span>{' '}
              verified Google dining reviews
            </p>

            <div className="pt-2">
              <a
                href={siteData.socialLinks.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-bold text-[#D9A441] hover:text-[#f3c267] transition-colors group"
              >
                <span>View Google Business Profile</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Exact Rating Distribution Bars */}
          <div className="lg:col-span-7 space-y-3.5">
            <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F6EFE3]/70 block mb-2">
              Official Star Distribution
            </span>

            {siteData.reviews.distribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-4 text-xs font-medium">
                <span className="w-12 text-right font-semibold text-[#F6EFE3] flex items-center justify-end gap-1">
                  <span>{item.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
                </span>

                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D9A441] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-20 text-right font-mono tabular-nums text-[#F6EFE3]/70">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Sentiment Themes */}
        <div className="mt-12 space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#F6EFE3]/60 block">
            Common Praise in Diner Reviews
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {siteData.reviews.guestThemes.map((theme) => (
              <span
                key={theme}
                className="px-4 py-2 bg-[#1c1815] rounded-full border border-white/10 text-xs font-medium text-[#F6EFE3]/90 shadow-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Clean Clearly-Marked Placeholder as required (no fake customer quotes) */}
        <div className="mt-16 p-8 rounded-xl border-2 border-dashed border-white/15 bg-[#1c1815]/50 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D9A441] font-bold">
            <MessageSquare className="w-4 h-4" />
            <span>{siteData.reviews.placeholderNotice}</span>
          </div>
          <p className="text-xs text-[#F6EFE3]/70 max-w-md mx-auto leading-relaxed">
            {siteData.reviews.customerReviewsPlaceholderText} Direct owner quotes, press citations, and customer spotlights can be updated in{' '}
            <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#D9A441]">
              src/siteData.ts
            </code>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
