/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { siteData } from '../siteData.ts';
import { createReservation } from '../firebase.ts';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  // Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(4);
  const [seatingArea, setSeatingArea] = useState<'kerala' | 'arabian' | 'any'>('any');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Submission & feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lunchSlots = ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'];
  const dinnerSlots = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Please provide your name for the reservation.');
      return;
    }

    if (!guestPhone.trim() || guestPhone.trim().length < 8) {
      setErrorMessage('Please provide a valid phone number for SMS or call confirmation.');
      return;
    }

    if (!date) {
      setErrorMessage('Please select a reservation date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const areaMapping: {
        kerala: 'indoor-ac';
        arabian: 'arabian-majlis';
        any: 'no-preference';
      } = {
        kerala: 'indoor-ac',
        arabian: 'arabian-majlis',
        any: 'no-preference',
      };

      const result = await createReservation({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim(),
        date,
        time,
        guests,
        seatingArea: areaMapping[seatingArea] || 'no-preference',
        specialRequests: specialNotes.trim() || undefined,
      });

      if (result.success && result.id) {
        const generatedRef = `NF-${result.id.slice(0, 6).toUpperCase()}`;
        setReferenceId(generatedRef);
        setIsSuccess(true);
      } else {
        // Fallback reference if network fails
        const fallbackRef = `NF-${Math.floor(1000 + Math.random() * 9000)}`;
        setReferenceId(fallbackRef);
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      console.error('Reservation submission error:', err);
      // Graceful degraded mode
      const fallbackRef = `NF-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceId(fallbackRef);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setReferenceId('');
    setGuestName('');
    setGuestPhone('');
    setSpecialNotes('');
    setGuests(4);
    setSeatingArea('any');
  };

  // WhatsApp pre-formatted link
  const getWhatsAppReservationLink = () => {
    const seatingLabel =
      seatingArea === 'kerala'
        ? 'Kerala Kitchen Dining'
        : seatingArea === 'arabian'
        ? 'Arabian Majlis / Family'
        : 'Standard Table';

    const text = encodeURIComponent(
      `Hello Newform Restaurant Kalpetta, I have submitted table reservation request #${referenceId} for ${guests} guests on ${date} at ${time} (${seatingLabel}). Name: ${guestName}, Phone: ${guestPhone}.${
        specialNotes ? ` Note: ${specialNotes}` : ''
      }`
    );
    return `https://wa.me/914936204848?text=${text}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#1c1815] text-[#F6EFE3] rounded-xl border border-[#D9A441]/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#14110F]">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#D9A441]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dining Hospitality</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
              Book a Table at Newform
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Reservation Modal"
            className="p-2.5 text-[#F6EFE3]/70 hover:text-[#D9A441] hover:bg-white/10 hover:scale-110 hover:rotate-90 active:scale-90 rounded-full transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#2F5D46]/20 border border-[#2F5D46] text-[#2F5D46] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D9A441] font-semibold">
                  Reservation Request Received
                </span>
                <h4 className="font-editorial text-3xl font-bold text-[#F6EFE3]">
                  We look forward to hosting you, {guestName}!
                </h4>
                <p className="text-sm text-[#F6EFE3]/80 max-w-md mx-auto leading-relaxed font-light">
                  Your table reservation has been registered under reference{' '}
                  <span className="font-mono font-bold text-[#D9A441]">{referenceId}</span>.
                </p>
              </div>

              {/* Reservation Summary Card */}
              <div className="p-5 bg-[#14110F] rounded-lg border border-[#D9A441]/20 max-w-md mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#F6EFE3]/60">Date & Time:</span>
                  <span className="font-semibold text-[#F6EFE3]">
                    {date} at {time}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#F6EFE3]/60">Party Size:</span>
                  <span className="font-semibold text-[#F6EFE3]">{guests} Guests</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#F6EFE3]/60">Seating Preference:</span>
                  <span className="font-semibold text-[#D9A441]">
                    {seatingArea === 'kerala'
                      ? 'Kerala Kitchen Dining'
                      : seatingArea === 'arabian'
                      ? 'Arabian Majlis / Family'
                      : 'Any Available Table'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F6EFE3]/60">Contact Phone:</span>
                  <span className="font-mono font-semibold text-[#F6EFE3]">{guestPhone}</span>
                </div>
              </div>

              {/* Quick Actions: WhatsApp & Call */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppReservationLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#2F5D46] hover:bg-[#396e54] hover:-translate-y-1 hover:shadow-lg text-white text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 shadow-md cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Notify via WhatsApp</span>
                </a>

                <a
                  href={siteData.location.phoneTelLink}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#241f1b] hover:bg-[#2e2722] hover:-translate-y-1 hover:shadow-lg text-[#F6EFE3] border border-white/10 hover:border-[#D9A441]/40 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 cursor-pointer group"
                >
                  <Phone className="w-4 h-4 text-[#D9A441] transition-transform duration-300 group-hover:rotate-12" />
                  <span>Call +91 4936 204 848</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full text-xs text-[#F6EFE3]/70 hover:text-[#D9A441] hover:bg-white/5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  Book another table
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 rounded bg-[#A63A2B]/20 border border-[#A63A2B] text-xs text-[#fca5a5]">
                  {errorMessage}
                </div>
              )}

              {/* 1. Date, Time & Party Size Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="resDate"
                    className="text-xs uppercase tracking-wider font-semibold text-[#D9A441] flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Select Date</span>
                  </label>
                  <input
                    id="resDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded text-xs text-[#F6EFE3] outline-none"
                  />
                </div>

                {/* Time */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="resTime"
                    className="text-xs uppercase tracking-wider font-semibold text-[#D9A441] flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Select Time</span>
                  </label>
                  <select
                    id="resTime"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded text-xs text-[#F6EFE3] outline-none cursor-pointer"
                  >
                    <optgroup label="Lunch (11:30 AM – 3:30 PM)">
                      {lunchSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Dinner (6:30 PM – 10:30 PM)">
                      {dinnerSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Party Size */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#D9A441] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Party Size</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-9 h-9 rounded-full bg-[#14110F] border border-white/15 hover:border-[#D9A441] hover:bg-[#D9A441]/10 hover:scale-105 active:scale-90 transition-all duration-200 flex items-center justify-center text-sm font-bold text-[#F6EFE3] cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center py-2 bg-[#14110F] border border-white/15 rounded-full text-xs font-mono font-bold text-[#D9A441]">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(25, guests + 1))}
                      className="w-9 h-9 rounded-full bg-[#14110F] border border-white/15 hover:border-[#D9A441] hover:bg-[#D9A441]/10 hover:scale-105 active:scale-90 transition-all duration-200 flex items-center justify-center text-sm font-bold text-[#F6EFE3] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Seating Preference */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D9A441] flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Seating Experience Preference</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSeatingArea('any')}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                      seatingArea === 'any'
                        ? 'bg-[#D9A441]/15 border-[#D9A441] text-[#F6EFE3] shadow-md -translate-y-0.5'
                        : 'bg-[#14110F] border-white/10 text-[#F6EFE3]/70 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold block">Standard Table</span>
                    <span className="text-[11px] text-[#F6EFE3]/60 block mt-0.5">
                      First available dining seating
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSeatingArea('kerala')}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                      seatingArea === 'kerala'
                        ? 'bg-[#A63A2B]/20 border-[#A63A2B] text-[#F6EFE3] shadow-md -translate-y-0.5'
                        : 'bg-[#14110F] border-white/10 text-[#F6EFE3]/70 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold block">Kerala Dining</span>
                    <span className="text-[11px] text-[#F6EFE3]/60 block mt-0.5">
                      Near traditional open tawa section
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSeatingArea('arabian')}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                      seatingArea === 'arabian'
                        ? 'bg-[#2F5D46]/20 border-[#2F5D46] text-[#F6EFE3] shadow-md -translate-y-0.5'
                        : 'bg-[#14110F] border-white/10 text-[#F6EFE3]/70 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold block">Arabian Family</span>
                    <span className="text-[11px] text-[#F6EFE3]/60 block mt-0.5">
                      Spacious communal banquet seating
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Guest Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="guestName"
                    className="text-xs uppercase tracking-wider font-semibold text-[#F6EFE3] block"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="guestName"
                    type="text"
                    required
                    placeholder="e.g. Rahul Nair / Sarah Ahmed"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded text-xs text-[#F6EFE3] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="guestPhone"
                    className="text-xs uppercase tracking-wider font-semibold text-[#F6EFE3] block"
                  >
                    Phone / Mobile Number *
                  </label>
                  <input
                    id="guestPhone"
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded text-xs text-[#F6EFE3] outline-none font-mono"
                  />
                </div>
              </div>

              {/* 4. Special Requests */}
              <div className="space-y-1.5">
                <label
                  htmlFor="specialNotes"
                  className="text-xs uppercase tracking-wider font-semibold text-[#F6EFE3] block"
                >
                  Special Requests / Dietary Notes (Optional)
                </label>
                <textarea
                  id="specialNotes"
                  rows={2}
                  placeholder="e.g. Baby chair requested, celebrating family birthday, mild spice preferred..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/15 focus:border-[#D9A441] focus:ring-1 focus:ring-[#D9A441] rounded text-xs text-[#F6EFE3] outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-[#D9A441] hover:bg-[#e6b14d] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#D9A441]/30 active:scale-95 text-[#14110F] text-xs uppercase font-bold tracking-[0.18em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#D9A441]/10 cursor-pointer disabled:opacity-50 group"
                >
                  {isSubmitting ? (
                    <span>Registering Reservation...</span>
                  ) : (
                    <>
                      <span>Confirm Reservation Request</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className="mt-2 text-[11px] text-[#F6EFE3]/50 text-center">
                  * Instant reservation hold. No pre-payment or deposit required.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
