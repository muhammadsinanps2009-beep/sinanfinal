/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RotateCcw,
  Megaphone,
  Phone,
  Clock,
  Instagram,
  Facebook,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  SiteSettingsData,
  saveSiteSettings,
  DEFAULT_SITE_SETTINGS,
} from '../../firebase.ts';
import { useData } from '../../context/DataContext.tsx';

export const AdminSettingsSection: React.FC = () => {
  const { siteSettings, isSettingsLoaded } = useData();

  // Form states
  const [openingHours, setOpeningHours] = useState('');
  const [openingHoursNote, setOpeningHoursNote] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [noticeBanner, setNoticeBanner] = useState('');

  // Socials
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [swiggy, setSwiggy] = useState('');
  const [zomato, setZomato] = useState('');

  // Tracking user edit status to prevent background snapshot state clobbering
  const [isDirty, setIsDirty] = useState(false);
  const initialHydrationDone = useRef(false);

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sync state from Firestore only on initial load or if the user hasn't made unsaved modifications
  useEffect(() => {
    if (siteSettings && (!initialHydrationDone.current || !isDirty)) {
      setOpeningHours(siteSettings.openingHours || '');
      setOpeningHoursNote(siteSettings.openingHoursNote || '');
      setPhone(siteSettings.phone || '');
      setWhatsappNumber(siteSettings.whatsappNumber || '');
      setEmail(siteSettings.email || '');
      setAddress(siteSettings.address || '');
      setLandmark(siteSettings.landmark || '');
      setNoticeBanner(siteSettings.noticeBanner || '');

      setInstagram(siteSettings.socialLinks?.instagram || '');
      setFacebook(siteSettings.socialLinks?.facebook || '');
      setSwiggy(siteSettings.socialLinks?.swiggy || '');
      setZomato(siteSettings.socialLinks?.zomato || '');

      initialHydrationDone.current = true;
    }
  }, [siteSettings, isDirty]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 5000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setActionError(null);
    setActionSuccess(null);

    const payload: Partial<SiteSettingsData> = {
      openingHours: openingHours.trim(),
      openingHoursNote: openingHoursNote.trim(),
      phone: phone.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      noticeBanner: noticeBanner.trim(),
      socialLinks: {
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        swiggy: swiggy.trim(),
        zomato: zomato.trim(),
      },
    };

    try {
      const res = await saveSiteSettings(payload);
      if (res.success) {
        setIsDirty(false); // Clean state on verified persistent write
        showNotification('Site settings updated live in Firestore! All public pages reflect changes instantly.');
      } else {
        showNotification(res.error || 'Failed to save site settings', true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showNotification(msg, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (!window.confirm('Reset all fields to default Newform restaurant configuration?')) {
      return;
    }
    setOpeningHours(DEFAULT_SITE_SETTINGS.openingHours);
    setOpeningHoursNote(DEFAULT_SITE_SETTINGS.openingHoursNote || '');
    setPhone(DEFAULT_SITE_SETTINGS.phone);
    setWhatsappNumber(DEFAULT_SITE_SETTINGS.whatsappNumber);
    setEmail(DEFAULT_SITE_SETTINGS.email);
    setAddress(DEFAULT_SITE_SETTINGS.address);
    setLandmark(DEFAULT_SITE_SETTINGS.landmark || '');
    setNoticeBanner('');
    setInstagram(DEFAULT_SITE_SETTINGS.socialLinks.instagram);
    setFacebook(DEFAULT_SITE_SETTINGS.socialLinks.facebook);
    setSwiggy(DEFAULT_SITE_SETTINGS.socialLinks.swiggy);
    setZomato(DEFAULT_SITE_SETTINGS.socialLinks.zomato);
    setIsDirty(true);
    showNotification('Fields reset to defaults. Click "Save Settings" to persist to Firestore.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-xs text-emerald-200 flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-center gap-2 shadow-lg animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1c1815] rounded-xl border border-[#D9A441]/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
              Global Site Settings & Operational Details
            </h2>
            {isDirty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs text-[#F6EFE3]/70">
            Stored in Firestore document <code className="text-[#D9A441]">settings/site</code>. Updates header, footer, mobile bar, and map section in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-medium text-[#F6EFE3]/80 rounded-lg border border-white/10 transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-[#D9A441] text-[#14110F] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#e6b14d] transition-all flex items-center gap-2 shadow-md shadow-[#D9A441]/20 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. PUBLIC NOTICE BANNER CARD */}
      <div className="p-6 bg-[#1c1815] rounded-xl border border-[#D9A441]/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#D9A441]/20 text-[#D9A441] rounded-lg">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
                Top Website Notice Banner
              </h3>
              <p className="text-xs text-[#F6EFE3]/60">
                Displays as a luxury gold alert strip at the top of the public website. Leave empty to disable.
              </p>
            </div>
          </div>
          {noticeBanner.trim() && (
            <span className="px-2.5 py-1 bg-[#D9A441] text-[#14110F] text-[10px] font-bold uppercase tracking-widest rounded-full">
              Banner Active
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
            Banner Announcement Text (Max 500 characters)
          </label>
          <input
            type="text"
            maxLength={500}
            value={noticeBanner}
            onChange={(e) => {
              setNoticeBanner(e.target.value);
              markDirty();
            }}
            placeholder="e.g. Special Ramadan Mandi Feast Available Every Evening · Call for Group Reservations"
            className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] placeholder:text-[#F6EFE3]/30 focus:border-[#D9A441] focus:outline-none"
          />
        </div>

        {/* Live Preview of Banner */}
        {noticeBanner.trim() && (
          <div className="pt-2">
            <span className="text-[11px] uppercase tracking-wider text-[#F6EFE3]/50 block mb-1">
              Live Preview:
            </span>
            <div className="bg-[#D9A441] text-[#14110F] px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm">
              <Megaphone className="w-3.5 h-3.5 shrink-0" />
              <span>{noticeBanner}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. OPERATIONAL & CONTACT INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Numbers & Channels */}
        <div className="p-6 bg-[#1c1815] rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-[#D9A441]" />
            <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
              Contact Telephones & WhatsApp
            </h3>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              Main Restaurant Telephone
            </label>
            <input
              type="text"
              maxLength={50}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                markDirty();
              }}
              placeholder="+91 4936 204 848"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] font-mono focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              WhatsApp Business Number / Link
            </label>
            <input
              type="text"
              maxLength={50}
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(e.target.value);
                markDirty();
              }}
              placeholder="+91 4936 204 848 or 91XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] font-mono focus:border-[#D9A441] focus:outline-none"
            />
            <p className="text-[11px] text-[#F6EFE3]/50 mt-1">
              Used in mobile dialer bar and one-tap reservation chats.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              maxLength={100}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                markDirty();
              }}
              placeholder="info@newformrestaurant.com"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>
        </div>

        {/* Operating Hours & Physical Address */}
        <div className="p-6 bg-[#1c1815] rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#D9A441]" />
            <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
              Dining Hours & Address
            </h3>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              Opening Hours Schedule
            </label>
            <input
              type="text"
              maxLength={100}
              value={openingHours}
              onChange={(e) => {
                setOpeningHours(e.target.value);
                markDirty();
              }}
              placeholder="Daily 11:00 AM – 11:00 PM"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/70 font-semibold mb-1">
              Hours Status Note
            </label>
            <input
              type="text"
              maxLength={200}
              value={openingHoursNote}
              onChange={(e) => {
                setOpeningHoursNote(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Verified by management / Subject to holiday change"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              Physical Street Address
            </label>
            <input
              type="text"
              maxLength={300}
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                markDirty();
              }}
              placeholder="Main Rd, Mandayapuram, Kalpetta, Kerala 673121, India"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/70 font-semibold mb-1">
              Prominent Landmark
            </label>
            <input
              type="text"
              maxLength={150}
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
                markDirty();
              }}
              placeholder="Near the old bus stand"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA & DELIVERY PLATFORMS */}
      <div className="p-6 bg-[#1c1815] rounded-xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <UtensilsCrossed className="w-4 h-4 text-[#D9A441]" />
          <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
            Social Media & Delivery Aggregator URLs
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/80 font-semibold mb-1 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Instagram Profile URL</span>
            </label>
            <input
              type="url"
              maxLength={300}
              value={instagram}
              onChange={(e) => {
                setInstagram(e.target.value);
                markDirty();
              }}
              placeholder="https://instagram.com/newform_kalpetta"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/80 font-semibold mb-1 flex items-center gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>Facebook Page URL</span>
            </label>
            <input
              type="url"
              maxLength={300}
              value={facebook}
              onChange={(e) => {
                setFacebook(e.target.value);
                markDirty();
              }}
              placeholder="https://facebook.com/newformrestaurantkalpetta"
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/80 font-semibold mb-1">
              Swiggy Restaurant Store Link
            </label>
            <input
              type="url"
              maxLength={300}
              value={swiggy}
              onChange={(e) => {
                setSwiggy(e.target.value);
                markDirty();
              }}
              placeholder="https://www.swiggy.com/restaurants/newform-restaurant..."
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/80 font-semibold mb-1">
              Zomato Restaurant Store Link
            </label>
            <input
              type="url"
              maxLength={300}
              value={zomato}
              onChange={(e) => {
                setZomato(e.target.value);
                markDirty();
              }}
              placeholder="https://www.zomato.com/kalpetta/newform-restaurant..."
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save CTA Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 bg-[#D9A441] text-[#14110F] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#e6b14d] transition-all flex items-center gap-2 shadow-xl shadow-[#D9A441]/20 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Live Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
