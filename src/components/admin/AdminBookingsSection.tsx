/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  ReservationData,
  subscribeReservations,
  updateReservationStatus,
  deleteReservation,
  extractErrorMessage,
} from '../../firebase.ts';

export const AdminBookingsSection: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeReservations(
      (items) => {
        setReservations(items);
        setIsLoading(false);
      },
      (err) => {
        setActionError(extractErrorMessage(err, 'Permission Denied: Unable to access reservations.'));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 5000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 5000);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.guestPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.date.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;

  const handleStatusChange = async (res: ReservationData, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    if (!res.id || updatingId) return;
    setUpdatingId(res.id);
    try {
      const result = await updateReservationStatus(res.id, newStatus);
      if (result.success) {
        showNotification(`Reservation for ${res.guestName} marked as ${newStatus.toUpperCase()}.`);
      } else {
        showNotification(result.error || 'Failed to update reservation status', true);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (res: ReservationData) => {
    if (!res.id || deletingId) return;

    if (!window.confirm(`Permanently delete table reservation for "${res.guestName}" on ${res.date}?`)) {
      return;
    }

    setDeletingId(res.id);
    try {
      const result = await deleteReservation(res.id);
      if (result.success) {
        showNotification(`Reservation for ${res.guestName} deleted.`);
      } else {
        showNotification(result.error || 'Failed to delete reservation', true);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^0-9+]/g, '');
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1c1815] rounded-xl border border-[#D9A441]/20 shadow-xl">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
            Table Bookings & Guest Management
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#F6EFE3]/70 mt-1">
            <span>Total Bookings: <strong className="text-[#D9A441]">{reservations.length}</strong></span>
            <span>·</span>
            <span>Pending Review: <strong className="text-amber-400">{pendingCount}</strong></span>
            <span>·</span>
            <span>Confirmed: <strong className="text-emerald-400">{confirmedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#1c1815] rounded-xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F6EFE3]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, phone, or date..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3] placeholder:text-[#F6EFE3]/40 focus:border-[#D9A441] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#D9A441] text-[#14110F] font-bold'
                  : 'bg-[#14110F] text-[#F6EFE3]/70 hover:text-white border border-white/5'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table View */}
      {isLoading ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10">
          <Loader2 className="w-6 h-6 animate-spin text-[#D9A441] mx-auto mb-2" />
          <p className="text-xs text-[#F6EFE3]/70">Loading reservations from Firestore...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10 space-y-3">
          <Calendar className="w-10 h-10 text-[#D9A441]/40 mx-auto" />
          <p className="text-sm font-editorial text-[#F6EFE3]">No Bookings Found</p>
          <p className="text-xs text-[#F6EFE3]/60 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No reservations match your current filters.'
              : 'Guests who reserve a table on the public website will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1c1815] rounded-xl border border-white/10 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#14110F]/60 text-[11px] uppercase tracking-wider text-[#D9A441] font-semibold">
                <th className="py-3.5 px-4">Guest Details</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Party Size</th>
                <th className="py-3.5 px-4">Seating Area</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-[#F6EFE3]/85">
              {filteredReservations.map((res) => {
                const cleanPhone = getCleanPhone(res.guestPhone);
                const isPending = res.status === 'pending';
                const isConfirmed = res.status === 'confirmed';

                return (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Guest Name & Phone */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sm text-[#F6EFE3]">
                        {res.guestName}
                      </div>
                      <div className="text-xs text-[#D9A441] font-mono mt-0.5">
                        {res.guestPhone}
                      </div>
                      {res.specialRequests && (
                        <p className="text-[11px] text-[#F6EFE3]/60 italic mt-1 line-clamp-1">
                          "{res.specialRequests}"
                        </p>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#F6EFE3] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D9A441]" />
                        <span>{res.date}</span>
                      </div>
                      <div className="text-[11px] text-[#F6EFE3]/60 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-[#D9A441]/70" />
                        <span>{res.time}</span>
                      </div>
                    </td>

                    {/* Party Size */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14110F] text-[#F6EFE3] font-medium border border-white/5">
                        <Users className="w-3.5 h-3.5 text-[#D9A441]" />
                        <span>{res.guests} Diners</span>
                      </span>
                    </td>

                    {/* Seating Area */}
                    <td className="py-3.5 px-4 whitespace-nowrap capitalize text-[#F6EFE3]/80">
                      {res.seatingArea?.replace('-', ' ') || 'Any Area'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isConfirmed
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : isPending
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 animate-pulse'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {isConfirmed && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {res.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        <span>{res.status}</span>
                      </span>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {isPending && (
                          <button
                            onClick={() => handleStatusChange(res, 'confirmed')}
                            disabled={updatingId === res.id}
                            className="px-3 py-1.5 bg-[#2F5D46] hover:bg-[#397255] text-white rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                            title="Confirm Booking"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Confirm</span>
                          </button>
                        )}

                        <a
                          href={`tel:${cleanPhone}`}
                          className="p-1.5 bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] text-[#D9A441] rounded-lg transition-colors cursor-pointer"
                          title={`Call ${res.guestName}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                            `Hello ${res.guestName}, your table reservation for ${res.guests} diners at Newform Restaurant on ${res.date} at ${res.time} is ${res.status.toUpperCase()}. We look forward to hosting you in Kalpetta!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-emerald-500/30"
                          title="WhatsApp Guest"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {isConfirmed && (
                          <button
                            onClick={() => handleStatusChange(res, 'cancelled')}
                            disabled={updatingId === res.id}
                            className="px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-950/40 rounded transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(res)}
                          disabled={deletingId === res.id}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete booking record"
                        >
                          {deletingId === res.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
