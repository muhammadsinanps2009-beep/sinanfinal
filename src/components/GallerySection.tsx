/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import { siteData } from '../siteData.ts';

export const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
    category: string;
  } | null>(null);

  return (
    <section id="gallery" className="py-24 bg-[#14110F] text-[#F6EFE3] film-grain">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-bold">
            <Camera className="w-4 h-4" />
            <span>Visual Culinary Chronicle</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F6EFE3]">
            A FEAST FOR THE EYES.
          </h2>

          <p className="text-sm sm:text-base text-[#F6EFE3]/80 leading-relaxed font-light">
            Take a visual tour through our aromatic dishes, traditional tawas, communal mandi platters, and Malabar dining moments.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-12 gap-6">
          {siteData.gallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() =>
                setSelectedImage({
                  image: item.image,
                  title: item.title,
                  category: item.category,
                })
              }
              className={`${item.span} group relative h-72 sm:h-84 lg:h-96 rounded-lg overflow-hidden border border-[#D9A441]/20 cursor-pointer shadow-lg bg-[#1c1815]`}
            >
              <img
                src={item.image}
                alt={item.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white/80 group-hover:text-[#D9A441] group-hover:scale-110 transition-all">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D9A441] block">
                  {item.category}
                </span>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#F6EFE3] group-hover:text-white transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1c1815] rounded-lg overflow-hidden border border-[#D9A441]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close Preview"
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/80 hover:bg-[#D9A441] hover:text-[#14110F] text-white rounded-full hover:scale-110 hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-6 bg-[#14110F] border-t border-[#D9A441]/15 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold block">
                  {selectedImage.category}
                </span>
                <h4 className="font-editorial text-xl font-bold text-[#F6EFE3]">
                  {selectedImage.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 rounded-full text-xs uppercase tracking-wider text-[#F6EFE3]/70 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Close Preview [Esc]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
