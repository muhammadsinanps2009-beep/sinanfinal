/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, PhoneCall, Utensils, Sparkles, Image as ImageIcon } from 'lucide-react';
import { siteData } from '../siteData.ts';
import { IMAGES } from '../assets.ts';
import { Hero3DScene } from './Hero3DScene.tsx';

export const Hero: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('photo');
  const [isMobile, setIsMobile] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    // 1. Check if device is mobile or has reduced motion
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // 2. Safely probe WebGL support and filter out sandboxed / D3D9 legacy GPUs
    let webglAvailable = false;
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
          if (
            /Direct3D9|SwiftShader|llvmpipe|softpipe|Intel.*HD Graphics (2000|3000)/i.test(
              renderer
            )
          ) {
            webglAvailable = false;
          } else {
            webglAvailable = true;
          }
        } else {
          webglAvailable = true;
        }
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch {
      webglAvailable = false;
    }

    setSupportsWebGL(webglAvailable);
    // Keep photo view as the solid foundation; allow 3D switch when supported
    setViewMode('photo');

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen bg-[#14110F] text-[#F6EFE3] pt-28 pb-16 flex flex-col justify-between overflow-hidden film-grain">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D9A441]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#A63A2B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial Headline & Messaging */}
        <div className="lg:col-span-6 z-10 space-y-6">
          {/* Location & Heritage Tagline */}
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.25em] text-[#D9A441] uppercase font-medium">
            <span className="w-6 h-[1px] bg-[#D9A441]" />
            <span>{siteData.brand.locationTag}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]/40" />
            <span className="text-[#F6EFE3]/60 lowercase tracking-normal">est. Kalpetta</span>
          </div>

          {/* Main Brand Title */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F6EFE3] leading-[1.12]">
            {siteData.brand.headline}
          </h1>

          {/* Main Statement */}
          <p className="font-editorial text-2xl sm:text-3xl text-[#D9A441] italic font-normal leading-snug">
            "{siteData.brand.tagline}"
          </p>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#F6EFE3]/80 leading-relaxed max-w-xl font-light">
            {siteData.brand.subTagline} From fragrant Malabar Dum Biryani and fiery beef fry with flaky layered parotta, to tender Arabian Mandi and charcoal grills.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleScrollTo('#menu')}
              className="px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-bold text-[#14110F] bg-[#D9A441] hover:bg-[#e6b14d] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D9A441]/30 active:scale-95 active:translate-y-0 transition-all duration-300 ease-out rounded-full flex items-center gap-2.5 cursor-pointer group shadow-md shadow-[#D9A441]/15"
            >
              <Utensils className="w-4 h-4 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              <span>Explore Our Menu</span>
            </button>

            <button
              onClick={() => handleScrollTo('#visitus')}
              className="px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#F6EFE3] border border-[#F6EFE3]/30 hover:border-[#D9A441] hover:text-[#D9A441] hover:bg-[#D9A441]/10 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/50 active:scale-95 active:translate-y-0 transition-all duration-300 ease-out rounded-full flex items-center gap-2.5 cursor-pointer group"
            >
              <Compass className="w-4 h-4 transition-transform duration-500 ease-out group-hover:rotate-90 group-hover:scale-110" />
              <span>Get Directions</span>
            </button>

            <a
              href={siteData.location.phoneTelLink}
              className="px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold text-[#D9A441] border border-[#D9A441]/40 hover:bg-[#D9A441]/15 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D9A441]/15 active:scale-95 transition-all duration-300 rounded-full flex items-center gap-2 group"
            >
              <PhoneCall className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Viewport switch for 3D vs Photo (Shown only when WebGL is supported and on desktop) */}
          {!isMobile && supportsWebGL && (
            <div className="pt-3 flex items-center gap-3 text-xs text-[#F6EFE3]/60">
              <span className="text-[11px] uppercase tracking-wider text-[#D9A441]">Experience View:</span>
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                  viewMode === '3d'
                    ? 'bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40 shadow-sm'
                    : 'text-[#F6EFE3]/60 hover:text-[#F6EFE3] hover:bg-white/5 border border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive 3D Platter</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setViewMode('photo')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
                  viewMode === 'photo'
                    ? 'bg-[#D9A441]/20 text-[#D9A441] border border-[#D9A441]/40 shadow-sm'
                    : 'text-[#F6EFE3]/60 hover:text-[#F6EFE3] hover:bg-white/5 border border-transparent'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Editorial Photography</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 3D Scene or Editorial Photography */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {viewMode === '3d' && !isMobile && supportsWebGL ? (
            <div className="w-full h-[460px] lg:h-[560px] relative rounded-lg overflow-hidden border border-[#D9A441]/20 bg-gradient-to-b from-[#1c1815] to-[#14110F]">
              <Hero3DScene onError={() => setViewMode('photo')} />
              
              {/* Subtle 3D instruction pill */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#14110F]/80 backdrop-blur-md rounded-full border border-white/10 text-[11px] text-[#F6EFE3]/70 pointer-events-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                <span>Move mouse to tilt platter & explore spices</span>
              </div>
            </div>
          ) : (
            <div className="relative group w-full max-w-lg lg:max-w-none">
              <div className="relative overflow-hidden rounded-md border border-[#D9A441]/30 shadow-2xl shadow-black/80">
                <img
                  src={IMAGES.biryani}
                  alt="Authentic Kerala Malabar Dum Biryani at Newform Restaurant"
                  className="w-full h-[420px] lg:h-[520px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-black/20 to-transparent" />
                
                {/* Photo caption overlay */}
                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#D9A441] font-semibold block">
                      Malabar Dum Specialty
                    </span>
                    <span className="font-editorial text-xl sm:text-2xl text-[#F6EFE3]">
                      Traditional Dum Beef Biryani
                    </span>
                  </div>
                  <span className="text-xs text-[#D9A441] font-mono tabular-nums bg-black/60 px-2 py-1 rounded border border-[#D9A441]/30">
                    Fresh Daily
                  </span>
                </div>
              </div>

              {/* Decorative accent frame */}
              <div className="absolute -inset-2 border border-[#D9A441]/20 rounded-lg pointer-events-none -z-10 translate-x-3 translate-y-3 hidden sm:block" />
            </div>
          )}
        </div>
      </div>

      {/* Trust & Highlights Strip */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-12 pt-8 border-t border-[#D9A441]/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#D9A441] block mb-1">
            Google Rating
          </span>
          <p className="font-editorial text-2xl font-bold text-[#F6EFE3] flex items-center gap-2">
            <span>4.0</span>
            <span className="text-xs font-sans font-normal text-[#F6EFE3]/60 tracking-normal">
              (3,303+ Reviews)
            </span>
          </p>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#D9A441] block mb-1">
            Culinary Focus
          </span>
          <p className="font-editorial text-lg font-bold text-[#F6EFE3]">
            Kerala & Arabian
          </p>
          <span className="text-xs text-[#F6EFE3]/60">Plus Chinese & Sweets</span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#D9A441] block mb-1">
            Dining Experience
          </span>
          <p className="font-editorial text-lg font-bold text-[#F6EFE3]">
            Warm & Affordable
          </p>
          <span className="text-xs text-[#F6EFE3]/60">Welcoming to all</span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-[#D9A441] block mb-1">
            Opening Hours
          </span>
          <p className="font-editorial text-base sm:text-lg font-bold text-[#F6EFE3]">
            {siteData.location.openingHours.schedule}
          </p>
          <span className="text-[11px] text-[#D9A441]/80 italic">
            *Subject to owner confirmation
          </span>
        </div>
      </div>
    </section>
  );
};
