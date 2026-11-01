/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  DownloadCloud,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  DishDocument,
  addDish,
  updateDish,
  deleteDish,
  toggleDishAvailability,
  importMenuFromSiteData,
} from '../../firebase.ts';
import { useData } from '../../context/DataContext.tsx';
import { DishEditModal } from './DishEditModal.tsx';

export const AdminMenuSection: React.FC = () => {
  const { dishes, isDishesLoaded, dishesError } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kerala' | 'arabian' | 'chinese' | 'dessert'>('all');
  const [selectedDishForEdit, setSelectedDishForEdit] = useState<DishDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // Filter dishes
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = categoryFilter === 'all' || dish.category === categoryFilter;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dish.malayalamName && dish.malayalamName.includes(searchQuery)) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableCount = dishes.filter((d) => d.available !== false).length;
  const hiddenCount = dishes.filter((d) => d.available === false).length;

  const handleOpenCreateModal = () => {
    setSelectedDishForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dish: DishDocument) => {
    setSelectedDishForEdit(dish);
    setIsModalOpen(true);
  };

  const handleSaveDish = async (dishData: Omit<DishDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedDishForEdit && selectedDishForEdit.id) {
      const res = await updateDish(selectedDishForEdit.id, dishData);
      if (res.success) {
        showNotification(`Updated "${dishData.name}" successfully.`);
      } else {
        throw new Error(res.error || 'Failed to update dish');
      }
    } else {
      const res = await addDish(dishData);
      if (res.success) {
        showNotification(`Created "${dishData.name}" in menu catalogue.`);
      } else {
        throw new Error(res.error || 'Failed to add dish');
      }
    }
  };

  const handleToggleAvailable = async (dish: DishDocument) => {
    if (!dish.id) {
      showNotification('Dish must be saved to Firestore first to toggle visibility. Use "Import current menu" to sync default dishes.', true);
      return;
    }

    const nextState = !(dish.available !== false);
    setTogglingId(dish.id);
    try {
      const res = await toggleDishAvailability(dish.id, nextState);
      if (res.success) {
        showNotification(`Dish is now ${nextState ? 'VISIBLE' : 'HIDDEN'} on public website.`);
      } else {
        showNotification(res.error || 'Failed to toggle availability', true);
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (dish: DishDocument) => {
    if (!dish.id) {
      showNotification('Cannot delete dish that is not yet stored in Firestore database.', true);
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${dish.name}" from the menu?`)) {
      return;
    }

    setDeletingId(dish.id);
    try {
      const res = await deleteDish(dish.id);
      if (res.success) {
        showNotification(`Deleted "${dish.name}" from menu.`);
      } else {
        showNotification(res.error || 'Failed to delete dish', true);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleImportMenu = async () => {
    if (
      !window.confirm(
        'Import all dishes from siteData.ts into the live Firestore "dishes" collection? This ensures all dishes are in database for editing, pricing updates, and photo management.'
      )
    ) {
      return;
    }

    setIsImporting(true);
    try {
      const res = await importMenuFromSiteData();
      if (res.success) {
        showNotification(`Successfully seeded ${res.count} authentic dishes into Firestore!`);
      } else {
        showNotification(res.error || 'Failed to import default menu', true);
      }
    } finally {
      setIsImporting(false);
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

      {/* Action Bar: Counts, Add Dish, Seed Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#1c1815] rounded-xl border border-[#D9A441]/20 shadow-xl">
        <div className="space-y-1">
          <h2 className="font-editorial text-2xl font-bold text-[#F6EFE3]">
            Menu Catalog & Live Pricing
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#F6EFE3]/70">
            <span>Total Dishes: <strong className="text-[#D9A441]">{dishes.length}</strong></span>
            <span>·</span>
            <span>Live on Site: <strong className="text-emerald-400">{availableCount}</strong></span>
            <span>·</span>
            <span>Hidden: <strong className="text-rose-400">{hiddenCount}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleImportMenu}
            disabled={isImporting}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#D9A441] border border-[#D9A441]/30 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isImporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
            <span>Import Current Menu</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#D9A441] text-[#14110F] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#e6b14d] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md shadow-[#D9A441]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#1c1815] rounded-xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F6EFE3]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish or Malayalam name..."
            className="w-full pl-9 pr-3.5 py-2 bg-[#14110F] border border-white/10 rounded-lg text-xs text-[#F6EFE3] placeholder:text-[#F6EFE3]/40 focus:border-[#D9A441] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
          {(['all', 'kerala', 'arabian', 'chinese', 'dessert'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#D9A441] text-[#14110F] font-bold'
                  : 'bg-[#14110F] text-[#F6EFE3]/70 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'All Sections' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Table */}
      {!isDishesLoaded ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10">
          <Loader2 className="w-6 h-6 animate-spin text-[#D9A441] mx-auto mb-2" />
          <p className="text-xs text-[#F6EFE3]/70">Loading dishes from Firestore...</p>
        </div>
      ) : filteredDishes.length === 0 ? (
        <div className="p-16 text-center bg-[#1c1815] rounded-xl border border-white/10 space-y-3">
          <p className="text-sm text-[#F6EFE3]/80">No dishes found matching your search filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 bg-white/10 rounded-full text-xs text-[#D9A441] hover:bg-white/15 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1c1815] rounded-xl border border-white/10 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#14110F]/60 text-[11px] uppercase tracking-wider text-[#D9A441] font-semibold">
                <th className="py-3.5 px-4">Photo</th>
                <th className="py-3.5 px-4">Dish Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Website Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-[#F6EFE3]/85">
              {filteredDishes.map((dish) => {
                const isAvailable = dish.available !== false;
                return (
                  <tr
                    key={dish.id || dish.name}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* 1. Photo Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/15 bg-black/40 shrink-0">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        {dish.isSignature && (
                          <div
                            title="Signature Dish"
                            className="absolute top-1 left-1 p-0.5 bg-[#D9A441] text-[#14110F] rounded shadow"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 2. Dish Name */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-sm text-[#F6EFE3] group-hover:text-[#D9A441] transition-colors">
                        {dish.name}
                      </div>
                      {dish.malayalamName && (
                        <div className="text-[11px] text-[#D9A441]/80 font-medium mt-0.5">
                          {dish.malayalamName}
                        </div>
                      )}
                      <p className="text-[11px] text-[#F6EFE3]/60 line-clamp-1 mt-0.5 font-light">
                        {dish.description}
                      </p>
                      {dish.dietaryTags && dish.dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dish.dietaryTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] text-[#F6EFE3]/70 border border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* 3. Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                          dish.category === 'kerala'
                            ? 'bg-[#A63A2B]/20 text-rose-300 border border-[#A63A2B]/40'
                            : dish.category === 'arabian'
                            ? 'bg-[#2F5D46]/20 text-emerald-300 border border-[#2F5D46]/40'
                            : dish.category === 'chinese'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {dish.category}
                      </span>
                    </td>

                    {/* 4. Price */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      {dish.price ? (
                        <span className="text-sm font-semibold text-[#D9A441]">
                          {dish.price}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#F6EFE3]/40 italic">
                          Affordable daily
                        </span>
                      )}
                    </td>

                    {/* 5. Visibility Pill & Switch */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailable(dish)}
                        disabled={togglingId === dish.id}
                        title={isAvailable ? 'Click to hide dish on public website' : 'Click to make dish visible on website'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border ${
                          isAvailable
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                        }`}
                      >
                        {togglingId === dish.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isAvailable ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>{isAvailable ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* 6. Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(dish)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-[#D9A441] hover:text-[#14110F] text-[#F6EFE3] rounded-lg transition-colors cursor-pointer text-xs font-medium flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(dish)}
                          disabled={deletingId === dish.id}
                          className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete dish"
                        >
                          {deletingId === dish.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
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

      {/* Dish Edit / Create Modal */}
      <DishEditModal
        isOpen={isModalOpen}
        dish={selectedDishForEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDish}
      />
    </div>
  );
};
