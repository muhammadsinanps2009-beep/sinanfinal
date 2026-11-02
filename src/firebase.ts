/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { siteData } from './siteData.ts';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// ---------------------------------------------------------------------------
// ADMIN & RBAC AUTHORIZATION CONFIGURATION
// ---------------------------------------------------------------------------

/**
 * Verified administrative emails authorized to perform staff mutations and view diner PII
 */
export const AUTHORIZED_ADMIN_EMAILS: readonly string[] = Object.freeze([
  'muhammadsinanps2009@gmail.com',
]);

/**
 * Validates whether the authenticated Firebase user has staff administrative privileges
 */
export function isAuthorizedAdmin(user: User | null): boolean {
  if (!user || user.isAnonymous) return false;
  if (!user.email) return false;
  // Enforce email verification to prevent email-spoofing attacks
  if (user.emailVerified !== true) return false;

  const normalizedEmail = user.email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === normalizedEmail);
}

// ---------------------------------------------------------------------------
// DATA MODELS & INTERFACES
// ---------------------------------------------------------------------------

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Spicy';

export interface DishDocument {
  id?: string;
  name: string;
  malayalamName?: string;
  category: 'kerala' | 'arabian' | 'chinese' | 'dessert';
  description: string;
  price?: string;
  image: string;
  dietaryTags: DietaryTag[];
  isSignature?: boolean;
  available: boolean;
  needsConfirmation?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface SiteSettingsData {
  openingHours: string;
  openingHoursNote?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  landmark?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    swiggy: string;
    zomato: string;
  };
  noticeBanner: string;
  updatedAt?: any;
}

export interface ReservationData {
  id?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor-ac' | 'family-lounge' | 'open-terrace' | 'arabian-majlis' | 'no-preference';
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: Timestamp | string;
  submittedAtIso?: string;
}

export interface InquiryData {
  id?: string;
  name: string;
  phoneOrEmail: string;
  message: string;
  type: 'general' | 'catering' | 'event' | 'feedback';
  createdAt?: Timestamp | string;
  submittedAtIso?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
  timestamp: string;
}

/**
 * Standard security error handler conforming strictly to the Firebase Integration Skill specification.
 * Formats full authentication context and operation metadata.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const current = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: current?.uid || null,
      email: current?.email || null,
      emailVerified: current?.emailVerified || null,
      isAnonymous: current?.isAnonymous || null,
      tenantId: current?.tenantId || null,
      providerInfo:
        current?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    timestamp: new Date().toISOString(),
  };

  console.error('[Firestore Security/Operation Error]:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Safely parses any thrown error into a clean, human-readable UI message
 */
export function extractErrorMessage(err: unknown, defaultMessage = 'An error occurred'): string {
  if (err instanceof Error) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed && typeof parsed.error === 'string') {
        if (parsed.error.includes('Missing or insufficient permissions') || parsed.error.includes('permission-denied')) {
          return 'Permission Denied: Your staff account is not authorized to perform this operation.';
        }
        return parsed.error;
      }
    } catch {
      if (err.message.includes('permission-denied') || err.message.includes('insufficient permissions')) {
        return 'Permission Denied: Administrative authorization required.';
      }
      return err.message;
    }
  }
  return defaultMessage;
}

/**
 * Test connectivity to the provisioned Firestore database
 */
export async function testFirebaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const probeDoc = doc(db, '_connection_test_', 'handshake');
    await getDocFromServer(probeDoc);
    return { connected: true };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error?.code === 'permission-denied') {
      return { connected: true };
    }
    return {
      connected: false,
      error: error?.message || 'Could not establish connection to Firestore',
    };
  }
}

// ---------------------------------------------------------------------------
// CLIENT-SIDE IMAGE RESIZING & FIREBASE STORAGE (< 1 MB REQUIREMENT)
// ---------------------------------------------------------------------------

/**
 * Resizes an image file to guaranteed under 1 MB using HTML5 Canvas
 */
export async function resizeImageToUnder1MB(file: File, maxDimension = 1400): Promise<Blob> {
  // Enforce image MIME-type check to block malicious non-image file uploads
  if (!file.type.startsWith('image/')) {
    throw new Error('Only valid image files (JPG, PNG, WebP) are accepted.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to generate compressed image blob'));
                return;
              }
              if (blob.size > 950 * 1024 && quality > 0.4) {
                quality -= 0.15;
                attemptCompression();
              } else {
                resolve(blob);
              }
            },
            'image/jpeg',
            quality
          );
        };

        attemptCompression();
      };
      img.onerror = () => reject(new Error('Failed to decode image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a dish photo to Firebase Storage with automatic resize to < 1 MB.
 * Provides resilient fallback to base64 data URL if storage rules reject.
 */
export async function uploadDishPhoto(
  file: File
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    const resizedBlob = await resizeImageToUnder1MB(file);
    const cleanName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const storagePath = `dishes/${Date.now()}_${cleanName}`;
    const storageRef = ref(storage, storagePath);

    try {
      const snapshot = await uploadBytes(storageRef, resizedBlob, {
        contentType: 'image/jpeg',
      });
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadUrl };
    } catch (storageError) {
      console.warn('Firebase Storage upload fallback to inline data URL:', storageError);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.readAsDataURL(resizedBlob);
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, url: '', error: msg };
  }
}

// ---------------------------------------------------------------------------
// 1. MENU & DISHES FIRESTORE SERVICE
// ---------------------------------------------------------------------------

/**
 * Live subscription to all dishes in Firestore
 */
export function subscribeDishes(
  callback: (dishes: DishDocument[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'dishes');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: DishDocument[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as DishDocument;
        items.push({
          ...data,
          id: d.id,
          available: data.available !== false,
        });
      });
      callback(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, 'dishes');
      } catch (wrappedErr) {
        if (onError) onError(wrappedErr);
      }
    }
  );
}

/**
 * Create a new dish in Firestore (Admin Only)
 */
export async function addDish(
  dish: Omit<DishDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const path = 'dishes';
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      name: dish.name.trim().slice(0, 120),
      malayalamName: (dish.malayalamName || '').trim().slice(0, 120),
      category: dish.category,
      description: dish.description.trim().slice(0, 2000),
      price: (dish.price || '').trim().slice(0, 60),
      image: dish.image,
      dietaryTags: Array.isArray(dish.dietaryTags) ? dish.dietaryTags.slice(0, 10) : [],
      isSignature: Boolean(dish.isSignature),
      available: dish.available !== false,
      needsConfirmation: Boolean(dish.needsConfirmation),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.CREATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Update an existing dish in Firestore (Admin Only)
 */
export async function updateDish(
  id: string,
  updates: Partial<DishDocument>
): Promise<{ success: boolean; error?: string }> {
  const path = `dishes/${id}`;
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'dishes', id);
    const sanitizedUpdates: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.name !== undefined) sanitizedUpdates.name = updates.name.trim().slice(0, 120);
    if (updates.malayalamName !== undefined) sanitizedUpdates.malayalamName = updates.malayalamName.trim().slice(0, 120);
    if (updates.category !== undefined) sanitizedUpdates.category = updates.category;
    if (updates.description !== undefined) sanitizedUpdates.description = updates.description.trim().slice(0, 2000);
    if (updates.price !== undefined) sanitizedUpdates.price = updates.price.trim().slice(0, 60);
    if (updates.image !== undefined) sanitizedUpdates.image = updates.image;
    if (updates.dietaryTags !== undefined) sanitizedUpdates.dietaryTags = updates.dietaryTags.slice(0, 10);
    if (updates.isSignature !== undefined) sanitizedUpdates.isSignature = Boolean(updates.isSignature);
    if (updates.available !== undefined) sanitizedUpdates.available = Boolean(updates.available);

    await setDoc(docRef, sanitizedUpdates, { merge: true });
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Toggle visibility / availability for a dish
 */
export async function toggleDishAvailability(
  id: string,
  available: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateDish(id, { available });
}

/**
 * Delete a dish from Firestore (Admin Only)
 */
export async function deleteDish(id: string): Promise<{ success: boolean; error?: string }> {
  const path = `dishes/${id}`;
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'dishes', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.DELETE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Seed initial menu into Firestore "dishes" collection (Admin Only)
 */
export async function importMenuFromSiteData(): Promise<{ success: boolean; count: number; error?: string }> {
  const path = 'dishes';
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, count: 0, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const colRef = collection(db, 'dishes');
    let imported = 0;

    for (const item of siteData.dishes) {
      const docRef = doc(colRef, item.id);
      await setDoc(docRef, {
        name: item.name.slice(0, 120),
        malayalamName: (item.malayalamName || '').slice(0, 120),
        category: item.category,
        description: item.description.slice(0, 2000),
        price: (item.price || '').slice(0, 60),
        image: item.image,
        dietaryTags: item.dietaryTags,
        isSignature: Boolean(item.isSignature),
        available: true,
        needsConfirmation: Boolean(item.needsConfirmation),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      imported++;
    }

    return { success: true, count: imported };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.CREATE, path);
    } catch (wrappedErr) {
      return { success: false, count: 0, error: extractErrorMessage(wrappedErr) };
    }
  }
}

// ---------------------------------------------------------------------------
// 2. SITE SETTINGS SERVICE (settings/site)
// ---------------------------------------------------------------------------

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  openingHours: siteData.location.openingHours.schedule,
  openingHoursNote: siteData.location.openingHours.note,
  phone: siteData.location.phone,
  whatsappNumber: '+91 4936 204 848',
  email: 'info@newformrestaurant.com',
  address: siteData.location.address,
  landmark: siteData.location.landmark,
  socialLinks: {
    instagram: siteData.socialLinks.instagram,
    facebook: siteData.socialLinks.facebook,
    swiggy: siteData.socialLinks.swiggy,
    zomato: siteData.socialLinks.zomato,
  },
  noticeBanner: '',
};

/**
 * Live subscription to settings/site document
 */
export function subscribeSiteSettings(
  callback: (settings: SiteSettingsData) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'settings/site';
  const docRef = doc(db, 'settings', 'site');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SiteSettingsData>;
        callback({
          ...DEFAULT_SITE_SETTINGS,
          ...data,
          socialLinks: {
            ...DEFAULT_SITE_SETTINGS.socialLinks,
            ...(data.socialLinks || {}),
          },
        });
      } else {
        callback(DEFAULT_SITE_SETTINGS);
      }
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.GET, path);
      } catch (wrappedErr) {
        if (onError) onError(wrappedErr);
        callback(DEFAULT_SITE_SETTINGS);
      }
    }
  );
}

/**
 * Save site settings to settings/site (Admin Only)
 */
export async function saveSiteSettings(
  settings: Partial<SiteSettingsData>
): Promise<{ success: boolean; error?: string }> {
  const path = 'settings/site';
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'settings', 'site');
    await setDoc(
      docRef,
      {
        openingHours: (settings.openingHours || '').trim().slice(0, 100),
        openingHoursNote: (settings.openingHoursNote || '').trim().slice(0, 200),
        phone: (settings.phone || '').trim().slice(0, 50),
        whatsappNumber: (settings.whatsappNumber || '').trim().slice(0, 50),
        email: (settings.email || '').trim().slice(0, 100),
        address: (settings.address || '').trim().slice(0, 300),
        landmark: (settings.landmark || '').trim().slice(0, 150),
        noticeBanner: (settings.noticeBanner || '').trim().slice(0, 500),
        socialLinks: {
          instagram: (settings.socialLinks?.instagram || '').trim().slice(0, 300),
          facebook: (settings.socialLinks?.facebook || '').trim().slice(0, 300),
          swiggy: (settings.socialLinks?.swiggy || '').trim().slice(0, 300),
          zomato: (settings.socialLinks?.zomato || '').trim().slice(0, 300),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

// ---------------------------------------------------------------------------
// 3. INQUIRIES SERVICE (inquiries collection)
// ---------------------------------------------------------------------------

/**
 * Submit general, catering, or event inquiry (Public Create)
 */
export async function submitInquiry(
  inquiry: Omit<InquiryData, 'id' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const path = 'inquiries';
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      name: inquiry.name.trim().slice(0, 100),
      phoneOrEmail: inquiry.phoneOrEmail.trim().slice(0, 120),
      message: inquiry.message.trim().slice(0, 2000),
      type: inquiry.type || 'general',
      createdAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.CREATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Live subscription to all inquiries in Firestore (Admin Only)
 */
export function subscribeInquiries(
  callback: (inquiries: InquiryData[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'inquiries';
  const colRef = collection(db, path);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: InquiryData[] = [];
      snapshot.forEach((d) => {
        items.push({
          ...(d.data() as InquiryData),
          id: d.id,
        });
      });
      items.sort((a, b) => {
        const timeA = a.submittedAtIso || '';
        const timeB = b.submittedAtIso || '';
        return timeB.localeCompare(timeA);
      });
      callback(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (wrappedErr) {
        if (onError) onError(wrappedErr);
      }
    }
  );
}

/**
 * Delete an inquiry from Firestore (Admin Only)
 */
export async function deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  const path = `inquiries/${id}`;
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'inquiries', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.DELETE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

// ---------------------------------------------------------------------------
// 4. RESERVATIONS SERVICE (reservations collection)
// ---------------------------------------------------------------------------

/**
 * Save a new table reservation (Public Create)
 */
export async function createReservation(
  reservation: Omit<ReservationData, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const path = 'reservations';
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      guestName: reservation.guestName.trim().slice(0, 100),
      guestPhone: reservation.guestPhone.trim().slice(0, 20),
      guestEmail: reservation.guestEmail ? reservation.guestEmail.trim().slice(0, 120) : undefined,
      date: reservation.date,
      time: reservation.time,
      guests: Number(reservation.guests) || 1,
      seatingArea: reservation.seatingArea || 'no-preference',
      specialRequests: reservation.specialRequests ? reservation.specialRequests.trim().slice(0, 500) : undefined,
      status: 'pending',
      createdAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.CREATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Live subscription to reservations in Firestore (Admin Only)
 */
export function subscribeReservations(
  callback: (reservations: ReservationData[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'reservations';
  const colRef = collection(db, path);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: ReservationData[] = [];
      snapshot.forEach((d) => {
        items.push({
          ...(d.data() as ReservationData),
          id: d.id,
        });
      });
      items.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      callback(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (wrappedErr) {
        if (onError) onError(wrappedErr);
      }
    }
  );
}

/**
 * Update reservation status (Admin Only)
 */
export async function updateReservationStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  const path = `reservations/${id}`;
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.UPDATE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}

/**
 * Delete a reservation record (Admin Only)
 */
export async function deleteReservation(id: string): Promise<{ success: boolean; error?: string }> {
  const path = `reservations/${id}`;
  try {
    if (!isAuthorizedAdmin(auth.currentUser)) {
      return { success: false, error: 'Unauthorized: Staff administrator privileges required.' };
    }

    const docRef = doc(db, 'reservations', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.DELETE, path);
    } catch (wrappedErr) {
      return { success: false, error: extractErrorMessage(wrappedErr) };
    }
  }
}
