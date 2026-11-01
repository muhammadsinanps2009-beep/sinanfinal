/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  MessageCircle,
  Trash2,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  User,
} from 'lucide-react';
import {
  InquiryData,
  subscribeInquiries,
  deleteInquiry,
  submitInquiry,
} from '../../firebase.ts';

export const AdminInquiriesSection: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'general' | 'catering' | 'event' | 'feedback'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick test inquiry modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testName, setTestName] = useState('');
  const [testContact, setTestContact] = useState('');
  const [testType, setTestType] = useState<'general' | 'catering' | 'event' | 'feedback'>('catering');
  const [testMessage, setTestMessage] = useState('');
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeInquiries(
      (items) => {
        setInquiries(items);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Inquiries subscribe error:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesType = typeFilter === 'all' || inq.type === typeFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phoneOrEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDelete = async (inq: InquiryData) => {
    if (!inq.id) return;

    if (!window.confirm(`Delete inquiry message from "${inq.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(inq.id);
    try {
      const res = await deleteInquiry(inq.id);
      if (res.success) {
        showNotification(`Inquiry from ${inq.name} deleted.`);
      } else {
        showNotification(res.error || 'Failed to delete inquiry', true);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getCleanPhone = (contact: string) => {
    return contact.replace(/[^0-9+]/g, '');
  };

  const handleCreateTestInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testContact.trim() || !testMessage.trim()) return;

    setIsSubmittingTest(true);
    try {
      const res = await submitInquiry({
        name: testName.trim(),
        phoneOrEmail: testContact.trim(),
        type: testType,
        message: testMessage.trim(),
      });
      if (res.success) {
        showNotification('Sample inquiry submitted to Firestore!');
        setIsTestModalOpen(false);
        setTestName('');
        setTestContact('');
        setTestMessage('');
      } else {
        showNotification(res.error || 'Failed to submit test inquiry', true);
      }
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'catering':
        return 'bg-[#D9A441]/20 text-[#D9A441] border-[#D9A441]/40';
      case 'event':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'feedback':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-sky-950/60 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
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

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1c1815] rounded-xl border border-[#D9A441]/20 shadow-xl">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
            Guest Inquiries & Catering Requests
          </h2>
          <div className="flex items-center gap-3 text-xs text-[#F6EFE3]/70 mt-1">
            <span>Total Messages: <strong className="text-[#D9A441]">{inquiries.length}</strong></span>
            <span>·</span>
            <span>Live Firestore sync active</span>
          </div>
        </div>

        <button
          onClick={() => setIsTestModalOpen(true)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#D9A441] border border-[#D9A441]/30 rounded-lg transition-colors cursor-pointer flex items-center gap-2 active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Log Sample Inquiry</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#1c1815] rounded-xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F6EFE3]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, contact, or keywords..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3] placeholder:text-[#F6EFE3]/40 focus:border-[#D9A441] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
          {(['all', 'general', 'catering', 'event', 'feedback'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-[#D9A441] text-[#14110F] font-bold'
                  : 'bg-[#14110F] text-[#F6EFE3]/70 hover:text-white border border-white/5'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List View */}
      {isLoading ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10">
          <Loader2 className="w-6 h-6 animate-spin text-[#D9A441] mx-auto mb-2" />
          <p className="text-xs text-[#F6EFE3]/70">Loading inquiries from Firestore...</p>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10 space-y-3">
          <MessageSquare className="w-10 h-10 text-[#D9A441]/40 mx-auto" />
          <p className="text-sm font-editorial text-[#F6EFE3]">No Inquiries Found</p>
          <p className="text-xs text-[#F6EFE3]/60 max-w-sm mx-auto">
            {searchQuery || typeFilter !== 'all'
              ? 'No records match your active search filters.'
              : 'Messages and catering requests submitted by guests will display here in real time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInquiries.map((inq) => {
            const cleanPhone = getCleanPhone(inq.phoneOrEmail);
            const isPhoneNumber = cleanPhone.length >= 8;

            return (
              <div
                key={inq.id}
                className="p-5 bg-[#1c1815] rounded-xl border border-white/10 hover:border-[#D9A441]/30 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
              >
                <div className="space-y-3">
                  {/* Top: Name, Type Badge & Date */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#D9A441]/10 text-[#D9A441] flex items-center justify-center font-bold text-sm shrink-0">
                        {inq.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-editorial text-base font-bold text-[#F6EFE3]">
                          {inq.name}
                        </h4>
                        <span className="text-xs text-[#D9A441] font-mono block">
                          {inq.phoneOrEmail}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getTypeBadgeStyle(
                        inq.type
                      )}`}
                    >
                      {inq.type}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="p-3.5 bg-[#14110F] rounded-lg border border-white/5 text-xs text-[#F6EFE3]/85 leading-relaxed font-light whitespace-pre-wrap">
                    "{inq.message}"
                  </div>
                </div>

                {/* Footer: Date & Direct Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-[#F6EFE3]/50 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#D9A441]/60" />
                    <span>
                      {inq.submittedAtIso
                        ? new Date(inq.submittedAtIso).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Button */}
                    {isPhoneNumber && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] text-[#D9A441] rounded-lg transition-colors cursor-pointer"
                        title={`Call ${inq.name}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* WhatsApp Button */}
                    {isPhoneNumber && (
                      <a
                        href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                          `Hello ${inq.name}, thank you for contacting Newform Restaurant regarding your ${inq.type} inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-emerald-500/30"
                        title={`WhatsApp ${inq.name}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(inq)}
                      disabled={deletingId === inq.id}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete inquiry"
                    >
                      {deletingId === inq.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for manual / test sample inquiry */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1c1815] rounded-xl border border-[#D9A441]/30 p-6 space-y-4 shadow-2xl">
            <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
              Log Sample Guest Inquiry
            </h3>
            <form onSubmit={handleCreateTestInquiry} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Rahul Nambiar"
                  className="w-full px-3 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                  Contact Phone or Email
                </label>
                <input
                  type="text"
                  required
                  value={testContact}
                  onChange={(e) => setTestContact(e.target.value)}
                  placeholder="+91 98470 12345"
                  className="w-full px-3 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                  Inquiry Category
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3]"
                >
                  <option value="catering">Catering Service</option>
                  <option value="event">Private Dining / Family Event</option>
                  <option value="general">General Question</option>
                  <option value="feedback">Dining Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                  Inquiry Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Need 40 plates of Malabar Dum Biryani and Al Faham platters for our family gathering in Kalpetta on Saturday."
                  className="w-full px-3 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#F6EFE3]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTest}
                  className="px-5 py-2 bg-[#D9A441] text-[#14110F] font-bold text-xs uppercase tracking-wider rounded-lg"
                >
                  {isSubmittingTest ? 'Submitting...' : 'Save Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
