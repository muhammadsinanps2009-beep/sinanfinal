/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DishDocument,
  SiteSettingsData,
  DEFAULT_SITE_SETTINGS,
  subscribeDishes,
  subscribeSiteSettings,
} from '../firebase.ts';
import { siteData } from '../siteData.ts';

interface DataContextType {
  dishes: DishDocument[];
  availableDishes: DishDocument[];
  signatureDishes: DishDocument[];
  isDishesLoaded: boolean;
  dishesError: string | null;
  siteSettings: SiteSettingsData;
  isSettingsLoaded: boolean;
  hasNoticeBanner: boolean;
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial fallback dishes converted from siteData.dishes
const FALLBACK_DISHES: DishDocument[] = siteData.dishes.map((item) => ({
  id: item.id,
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
}));

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firestoreDishes, setFirestoreDishes] = useState<DishDocument[]>([]);
  const [isDishesLoaded, setIsDishesLoaded] = useState<boolean>(false);
  const [dishesError, setDishesError] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState<boolean>(false);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#/admin' || window.location.hash === '#admin';
    }
    return false;
  });

  // Listen to hash changes for #/admin
  useEffect(() => {
    const handleHash = () => {
      const isAdm = window.location.hash === '#/admin' || window.location.hash === '#admin';
      setIsAdminOpen(isAdm);
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // 1. Subscribe to Live Dishes from Firestore
  useEffect(() => {
    const unsubscribe = subscribeDishes(
      (items) => {
        setFirestoreDishes(items);
        setIsDishesLoaded(true);
        setDishesError(null);
      },
      (err) => {
        console.warn('Dishes live subscription notice (using static siteData fallback):', err);
        setDishesError(err?.message || 'Database sync notice');
        setIsDishesLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Live Site Settings from Firestore (settings/site)
  useEffect(() => {
    const unsubscribe = subscribeSiteSettings(
      (settings) => {
        setSiteSettings(settings);
        setIsSettingsLoaded(true);
      },
      (err) => {
        console.warn('Site settings live subscription notice (using static defaults):', err);
        setIsSettingsLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute effective dishes: use Firestore dishes if populated; otherwise use fallback
  const effectiveDishes = firestoreDishes.length > 0 ? firestoreDishes : FALLBACK_DISHES;

  // Filter only available dishes for public consumption
  const availableDishes = effectiveDishes.filter((d) => d.available !== false);

  // Filter signature dishes
  const signatureDishes = availableDishes.filter((d) => d.isSignature);

  // Check if notice banner text is active
  const hasNoticeBanner = Boolean(siteSettings.noticeBanner && siteSettings.noticeBanner.trim().length > 0);

  const openAdmin = () => {
    window.location.hash = '#/admin';
    setIsAdminOpen(true);
  };

  const closeAdmin = () => {
    window.location.hash = '#home';
    setIsAdminOpen(false);
  };

  return (
    <DataContext.Provider
      value={{
        dishes: effectiveDishes,
        availableDishes,
        signatureDishes,
        isDishesLoaded,
        dishesError,
        siteSettings,
        isSettingsLoaded,
        hasNoticeBanner,
        isAdminOpen,
        openAdmin,
        closeAdmin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
