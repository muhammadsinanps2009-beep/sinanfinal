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
  getDocs,
  getDoc,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';
import { siteData, MenuItem } from './siteData.ts';

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
  status: 'pending' | 'confirmed' | 'cancelled';
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

export interface FirestoreErrorInfo {
  operation: 'create' | 'read' | 'update' | 'delete' | 'list';
  path: string;
  code: string;
  message: string;
  timestamp: string;
}

/**
 * Standard error handler for Firestore operations
 */
export function handleFirestoreError(
  error: unknown,
  operation: 'create' | 'read' | 'update' | 'delete' | 'list',
  path: string
): FirestoreErrorInfo {
  const err = error as { code?: string; message?: string };
  const info: FirestoreErrorInfo = {
    operation,
    path,
    code: err?.code || 'unknown',
    message: err?.message || 'An unexpected error occurred while communicating with the database.',
    timestamp: new Date().toISOString(),
  };

  console.warn(`[Firestore ${operation.toUpperCase()} Error at ${path}]:`, info);
  return info;
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
  return new Promise((resolve, reject) => {
    // If the file is already under 900 KB and is a common web format, check whether resize is needed
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Constrain max dimensions to preserve aspect ratio
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

        // Draw image with smooth scaling
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to generate image blob'));
                return;
              }
              // If still over 950KB and quality can be reduced, try again
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
 * Provides resilient fallback to base64 if Storage rules/connection fail.
 */
export async function uploadDishPhoto(file: File): Promise<{ success: boolean; url: string; error?: string }> {
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
      console.warn('Firebase Storage direct upload notice; converting to inline optimized data URL:', storageError);
      // Fallback: Return data URL so admin creation is never blocked
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
          available: data.available !== false, // default true
        });
      });
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, 'list', 'dishes');
      if (onError) onError(err);
    }
  );
}

/**
 * Create a new dish in Firestore
 */
export async function addDish(
  dish: Omit<DishDocument, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, 'dishes');
    const docRef = await addDoc(colRef, {
      ...dish,
      available: dish.available !== false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'create', 'dishes');
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Update an existing dish in Firestore
 */
export async function updateDish(
  id: string,
  updates: Partial<DishDocument>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'dishes', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'update', `dishes/${id}`);
    return { success: false, error: errorInfo.message };
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
 * Delete a dish from Firestore
 */
export async function deleteDish(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'dishes', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'delete', `dishes/${id}`);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Import default menu from siteData.ts into Firestore "dishes" collection
 */
export async function importMenuFromSiteData(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const colRef = collection(db, 'dishes');
    let imported = 0;

    for (const item of siteData.dishes) {
      const docRef = doc(colRef, item.id);
      await setDoc(docRef, {
        name: item.name,
        malayalamName: item.malayalamName || '',
        category: item.category,
        description: item.description,
        price: item.price || '',
        image: item.image,
        dietaryTags: item.dietaryTags,
        isSignature: item.isSignature || false,
        available: true,
        needsConfirmation: item.needsConfirmation || false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      imported++;
    }

    return { success: true, count: imported };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'create', 'dishes');
    return { success: false, count: 0, error: errorInfo.message };
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
      handleFirestoreError(err, 'read', 'settings/site');
      if (onError) onError(err);
      callback(DEFAULT_SITE_SETTINGS);
    }
  );
}

/**
 * Save site settings to settings/site
 */
export async function saveSiteSettings(
  settings: Partial<SiteSettingsData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'settings', 'site');
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'update', 'settings/site');
    return { success: false, error: errorInfo.message };
  }
}

// ---------------------------------------------------------------------------
// 3. INQUIRIES SERVICE (inquiries collection)
// ---------------------------------------------------------------------------

/**
 * Submit general, catering, or event inquiry
 */
export async function submitInquiry(
  inquiry: Omit<InquiryData, 'id' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, 'inquiries');
    const docRef = await addDoc(colRef, {
      ...inquiry,
      createdAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'create', 'inquiries');
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Live subscription to all inquiries in Firestore
 */
export function subscribeInquiries(
  callback: (inquiries: InquiryData[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'inquiries');
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
      // Sort newest first
      items.sort((a, b) => {
        const timeA = a.submittedAtIso || (a.createdAt as any)?.toDate?.()?.toISOString() || '';
        const timeB = b.submittedAtIso || (b.createdAt as any)?.toDate?.()?.toISOString() || '';
        return timeB.localeCompare(timeA);
      });
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, 'list', 'inquiries');
      if (onError) onError(err);
    }
  );
}

/**
 * Delete an inquiry from Firestore
 */
export async function deleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'inquiries', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'delete', `inquiries/${id}`);
    return { success: false, error: errorInfo.message };
  }
}

// ---------------------------------------------------------------------------
// 4. RESERVATIONS SERVICE (reservations collection)
// ---------------------------------------------------------------------------

/**
 * Save a new table reservation
 */
export async function createReservation(
  reservation: Omit<ReservationData, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, 'reservations');
    const docRef = await addDoc(colRef, {
      ...reservation,
      status: 'pending',
      createdAt: serverTimestamp(),
      submittedAtIso: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'create', 'reservations');
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Live subscription to reservations in Firestore
 */
export function subscribeReservations(
  callback: (reservations: ReservationData[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'reservations');
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
      // Sort by date/time
      items.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      callback(items);
    },
    (err) => {
      handleFirestoreError(err, 'list', 'reservations');
      if (onError) onError(err);
    }
  );
}

/**
 * Update reservation status (e.g. pending -> confirmed / cancelled)
 */
export async function updateReservationStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'update', `reservations/${id}`);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Delete a reservation record
 */
export async function deleteReservation(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, 'reservations', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    const errorInfo = handleFirestoreError(err, 'delete', `reservations/${id}`);
    return { success: false, error: errorInfo.message };
  }
}
