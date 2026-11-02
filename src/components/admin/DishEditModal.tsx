/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Check, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { DishDocument, DietaryTag, uploadDishPhoto } from '../../firebase.ts';
import { IMAGES } from '../../assets.ts';

interface DishEditModalProps {
  isOpen: boolean;
  dish: DishDocument | null; // null means create new
  onClose: () => void;
  onSave: (dishData: Omit<DishDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const DishEditModal: React.FC<DishEditModalProps> = ({
  isOpen,
  dish,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(dish && dish.id);

  // Form State
  const [name, setName] = useState('');
  const [malayalamName, setMalayalamName] = useState('');
  const [category, setCategory] = useState<'kerala' | 'arabian' | 'chinese' | 'dessert'>('kerala');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>([]);
  const [isSignature, setIsSignature] = useState(false);
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState(IMAGES.biryani);

  // Upload & processing state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessInfo, setUploadSuccessInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Sync state when editing dish changes
  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setMalayalamName(dish.malayalamName || '');
      setCategory(dish.category || 'kerala');
      setPrice(dish.price || '');
      setDescription(dish.description || '');
      setDietaryTags(dish.dietaryTags || []);
      setIsSignature(Boolean(dish.isSignature));
      setAvailable(dish.available !== false);
      setImage(dish.image || IMAGES.biryani);
    } else {
      setName('');
      setMalayalamName('');
      setCategory('kerala');
      setPrice('₹');
      setDescription('');
      setDietaryTags([]);
      setIsSignature(false);
      setAvailable(true);
      setImage(IMAGES.biryani);
    }
    setUploadError('');
    setUploadSuccessInfo('');
    setFormError('');
  }, [dish, isOpen]);

  if (!isOpen) return null;

  const availableDietaryTags: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy'];

  const toggleDietaryTag = (tag: DietaryTag) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type: Please select an image file (JPG, PNG, or WebP).');
      return;
    }

    setUploadError('');
    setUploadSuccessInfo('');
    setIsUploading(true);

    try {
      const result = await uploadDishPhoto(file);
      if (result.success && result.url) {
        setImage(result.url);
        setUploadSuccessInfo(`Photo processed & optimized under 1 MB (${(file.size / 1024).toFixed(0)} KB source)`);
      } else {
        setUploadError(result.error || 'Failed to upload photo. Please try a different image.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg || 'Error resizing or uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading) return;
    setFormError('');

    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setFormError('Please enter a dish name with at least 2 characters.');
      return;
    }

    const cleanDesc = description.trim();
    if (cleanDesc.length < 5) {
      setFormError('Please enter a descriptive summary for the dish.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name: cleanName.slice(0, 120),
        malayalamName: malayalamName.trim().slice(0, 120),
        category,
        price: price.trim().slice(0, 60),
        description: cleanDesc.slice(0, 2000),
        dietaryTags: dietaryTags.slice(0, 10),
        isSignature,
        available,
        image,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(msg || 'Failed to save dish record.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1c1815] rounded-xl border border-[#D9A441]/30 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#14110F] border-b border-[#D9A441]/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D9A441]/15 rounded-lg text-[#D9A441]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#F6EFE3]">
                {isEditing ? 'Edit Dish Details & Price' : 'Add New Menu Dish'}
              </h3>
              <p className="text-xs text-[#F6EFE3]/60">
                {isEditing ? `Modifying "${dish?.name}" in live menu` : 'Create a new dish entry in live menu'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#F6EFE3]/70 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {formError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Row 1: Dish Name & Malayalam Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                Dish Name (English) *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beef Fry with Flaky Parotta"
                className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/70 font-semibold mb-1">
                Malayalam Script Name (Optional)
              </label>
              <input
                type="text"
                maxLength={120}
                value={malayalamName}
                onChange={(e) => setMalayalamName(e.target.value)}
                placeholder="e.g. ബീഫ് ഫ്രൈ പൊറോട്ട"
                className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                Cuisine Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none cursor-pointer"
              >
                <option value="kerala">Kerala Kitchen</option>
                <option value="arabian">Arabian Kitchen</option>
                <option value="chinese">Chinese Flavours</option>
                <option value="dessert">Desserts & Sweets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
                Display Price
              </label>
              <input
                type="text"
                maxLength={60}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. ₹280 or Affordable daily"
                className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D9A441] font-semibold mb-1">
              Dish Description *
            </label>
            <textarea
              required
              maxLength={2000}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the ingredients, aromatics, preparation technique, and pairings..."
              className="w-full px-3.5 py-2.5 bg-[#14110F] border border-white/10 rounded-lg text-sm text-[#F6EFE3] focus:border-[#D9A441] focus:outline-none resize-none"
            />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F6EFE3]/80 font-semibold mb-2">
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDietaryTags.map((tag) => {
                const isSelected = dietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#D9A441] text-[#14110F] font-bold shadow-sm'
                        : 'bg-[#14110F] text-[#F6EFE3]/70 border border-white/10 hover:border-[#D9A441]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#14110F]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Upload & Preview Section */}
          <div className="p-4 bg-[#14110F] rounded-lg border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#D9A441] font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Dish Photography (Max 1 MB)</span>
              </label>
              <span className="text-[11px] text-[#F6EFE3]/50">
                Auto-resized before Storage upload
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#D9A441]/30 shrink-0 bg-black/40">
                <img
                  src={image}
                  alt="Dish preview"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#F6EFE3] font-medium border border-white/15 rounded-lg cursor-pointer transition-colors active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{isUploading ? 'Compressing & Uploading...' : 'Upload New Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {isUploading && (
                  <div className="flex items-center gap-2 text-xs text-[#D9A441] animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing canvas resize & uploading to Firebase Storage...</span>
                  </div>
                )}

                {uploadSuccessInfo && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3 shrink-0" />
                    <span>{uploadSuccessInfo}</span>
                  </p>
                )}

                {uploadError && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Toggles: Signature Dish & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Signature Toggle */}
            <label className="flex items-center justify-between p-3.5 bg-[#14110F] rounded-lg border border-white/10 cursor-pointer hover:border-[#D9A441]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F6EFE3] block">
                  Signature Dish Spotlight
                </span>
                <span className="text-[11px] text-[#F6EFE3]/50">
                  Feature with gold badge on menu & spotlights
                </span>
              </div>
              <input
                type="checkbox"
                checked={isSignature}
                onChange={(e) => setIsSignature(e.target.checked)}
                className="w-4 h-4 accent-[#D9A441] cursor-pointer"
              />
            </label>

            {/* Visibility Toggle */}
            <label className="flex items-center justify-between p-3.5 bg-[#14110F] rounded-lg border border-white/10 cursor-pointer hover:border-[#D9A441]/30 transition-colors">
              <div>
                <span className="text-xs font-semibold text-[#F6EFE3] block">
                  Show on Public Website
                </span>
                <span className="text-[11px] text-[#F6EFE3]/50">
                  Switch off to temporarily hide from public diners
                </span>
              </div>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#2F5D46] cursor-pointer"
              />
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#F6EFE3]/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 bg-[#D9A441] text-[#14110F] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#e6b14d] active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-[#D9A441]/20 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Dish' : 'Create Dish'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
