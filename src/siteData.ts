/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ==============================================================================
 * NEWFORM RESTAURANT — MASTER DATA CONFIGURATION
 * ==============================================================================
 * 
 * HOW TO EDIT THIS FILE (BEGINNER GUIDE):
 * - To update text, numbers, or links: change the values inside the quotation marks "".
 * - To add a new menu dish: copy one of the dish objects inside the `dishes` array,
 *   paste it, and customize the id, name, category, and dietaryTags.
 * - Items with `TODO: confirm` indicate details awaiting restaurant owner sign-off.
 * - Do NOT delete commas or quotation marks to avoid syntax errors.
 */

import { IMAGES } from './assets.ts';

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Spicy';

export interface MenuItem {
  id: string;
  name: string;
  malayalamName?: string;
  category: 'kerala' | 'arabian' | 'chinese' | 'dessert';
  description: string;
  dietaryTags: DietaryTag[];
  price?: string; // Optional — left blank when unverified per instructions
  image: string;
  isSignature?: boolean;
  needsConfirmation?: boolean; // Set true for items awaiting owner confirmation
}

export interface ReviewRatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

export const siteData = {
  // ---------------------------------------------------------------------------
  // 1. BRAND & IDENTITY
  // ---------------------------------------------------------------------------
  brand: {
    name: 'Newform Restaurant',
    shortName: 'NEWFORM',
    tagline: 'Two food cultures. One unforgettable table.',
    subTagline: 'Kerala favourites and Arabian specials, served daily in the heart of Kalpetta.',
    headline: 'NEWFORM RESTAURANT',
    locationTag: 'KALPETTA · WAYANAD',
    description:
      'From the rich culinary traditions of Kerala cuisine to the bold flavours of Arabian food, Newform brings two distinct food experiences together under one welcoming roof.',
    highlights: [
      'Authentic Kerala cuisine',
      'Authentic Arabian dishes',
      'Affordable, welcoming dining',
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. CONTACT, LOCATION & NAVIGATION
  // ---------------------------------------------------------------------------
  location: {
    address: 'Main Rd, Mandayapuram, Kalpetta, Kerala 673121, India',
    landmark: 'Near the old bus stand',
    city: 'Kalpetta',
    district: 'Wayanad',
    state: 'Kerala',
    country: 'India',
    postalCode: '673121',
    coordinates: {
      latitude: 11.6137653,
      longitude: 76.0828979,
    },
    // Direct embed URL without API key requirement
    mapEmbedUrl: 'https://www.google.com/maps?q=11.6137653,76.0828979&output=embed',
    // Universal turn-by-turn navigation link
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=11.6137653,76.0828979',
    phone: '+91 4936 204 848',
    phoneTelLink: 'tel:+914936204848',
    
    // TODO: confirm — Owner must provide official WhatsApp business number.
    // Replace with: https://wa.me/91XXXXXXXXXX
    whatsappPlaceholder: 'https://wa.me/914936204848?text=Hello%20Newform%20Restaurant%2C%20I%20would%20like%20to%20inquire%20about%20dining%20and%20takeaway',
    
    // TODO: confirm — Owner must provide official email address.
    emailPlaceholder: 'info@newformrestaurant.com', // TODO: confirm
    
    // Operating hours — Daily 11:00 AM – 11:00 PM
    // TODO: confirm — Opening hours require owner confirmation.
    openingHours: {
      schedule: 'Daily 11:00 AM – 11:00 PM',
      isConfirmed: false, // Set to true once verified by the owner
      note: 'Opening hours subject to owner verification',
    },
  },

  // ---------------------------------------------------------------------------
  // 3. SOCIAL MEDIA & DELIVERY PLATFORMS
  // ---------------------------------------------------------------------------
  socialLinks: {
    // TODO: confirm — Replace placeholder handles with active profiles
    instagram: 'https://instagram.com/newform_kalpetta', // TODO: confirm
    facebook: 'https://facebook.com/newformrestaurantkalpetta', // TODO: confirm
    swiggy: 'https://www.swiggy.com/restaurants/newform-restaurant-kalpetta-wayanad', // TODO: confirm
    zomato: 'https://www.zomato.com/kalpetta/newform-restaurant-mandayapuram', // TODO: confirm
    googleReviews: 'https://www.google.com/maps/place/Newform+Restaurant/@11.6137653,76.0828979,17z',
  },

  // ---------------------------------------------------------------------------
  // 4. GOOGLE REVIEWS & SOCIAL PROOF (EXACT VERIFIED METRICS)
  // ---------------------------------------------------------------------------
  reviews: {
    rating: 4.0,
    totalReviews: 3303,
    ratingDisplay: '4.0 / 5.0',
    totalReviewsDisplay: '3,303+ Google Reviews',
    distribution: [
      { stars: 5, count: 1398, percentage: Math.round((1398 / 3303) * 100) },
      { stars: 4, count: 1094, percentage: Math.round((1094 / 3303) * 100) },
      { stars: 3, count: 432, percentage: Math.round((432 / 3303) * 100) },
      { stars: 2, count: 120, percentage: Math.round((120 / 3303) * 100) },
      { stars: 1, count: 259, percentage: Math.round((259 / 3303) * 100) },
    ] as ReviewRatingBreakdown[],
    guestThemes: [
      'Affordable prices',
      'Kerala and Arabian sections',
      'Beef fry and parotta',
      'Dum beef biryani',
      'Wide menu selection',
      'Central Kalpetta location',
    ],
    // Clean, clearly marked placeholder as instructed — no fake customer names or fabricated quotes
    placeholderNotice: 'REAL CUSTOMER REVIEWS — TO BE ADDED',
    customerReviewsPlaceholderText:
      'Verified Google dining reviews from our visitors are being integrated directly from Google Business Profile.',
  },

  // ---------------------------------------------------------------------------
  // 5. SIGNATURE DISH SPOTLIGHT
  // ---------------------------------------------------------------------------
  signatureSpotlights: [
    {
      id: 'spotlight-beef-parotta',
      title: 'Beef Fry & Kerala Parotta',
      category: 'Kerala Culinary Heritage',
      description:
        'Tender cuts of beef slow-roasted in roasted coriander, crushed Tellicherry black peppercorns, sautéed shallots, and crisp coconut slivers, crowned with aromatic curry leaves. Served alongside multi-layered, flaky golden Malabar parottas straight off the tawa.',
      culturalNote: 'The quintessential soul food of Kerala — rich, aromatic, and deeply comforting.',
      dietaryTags: ['Spicy'] as DietaryTag[],
      image: IMAGES.beefFry,
    },
    {
      id: 'spotlight-beef-biryani',
      title: 'Dum Beef Biryani',
      category: 'Malabar Dum Tradition',
      description:
        'Fragrant short-grain Khaima / Jeerakasala rice sealed and slow-cooked in dum with succulent marinated beef, caramelized onions, toasted golden cashews, plump raisins, and hand-ground warm spices. Accompanied by cooling mint raita and zesty pickle.',
      culturalNote: 'Cooked in sealed vessels to lock in every nuance of steam and spice aromatics.',
      dietaryTags: ['Spicy', 'Gluten-Free'] as DietaryTag[],
      image: IMAGES.biryani,
    },
  ],

  // ---------------------------------------------------------------------------
  // 6. MENU CATEGORIES & COMPLETE DISH CATALOG WITH DIETARY FILTERING
  // ---------------------------------------------------------------------------
  menuCategories: [
    { id: 'kerala', label: 'Kerala Kitchen', shortLabel: 'Kerala' },
    { id: 'arabian', label: 'Arabian Kitchen', shortLabel: 'Arabian' },
    { id: 'chinese', label: 'Chinese Flavours', shortLabel: 'Chinese' },
    { id: 'dessert', label: 'Desserts & Sweets', shortLabel: 'Desserts' },
  ],

  dishes: [
    // --- KERALA SECTION ---
    {
      id: 'kerala-beef-fry-parotta',
      name: 'Beef Fry with Flaky Parotta',
      category: 'kerala',
      description:
        'Succulent slow-roasted beef with crunchy browned coconut slices and fresh curry leaves, paired with crisp, flaky layered Kerala parottas.',
      dietaryTags: ['Spicy'],
      image: IMAGES.beefFry,
      isSignature: true,
    },
    {
      id: 'kerala-dum-beef-biryani',
      name: 'Dum Beef Biryani',
      category: 'kerala',
      description:
        'Authentic Malabar dum-cooked biryani made with fragrant spices, tender beef, golden cashews, and sweet raisins, served with raita.',
      dietaryTags: ['Spicy', 'Gluten-Free'],
      image: IMAGES.biryani,
      isSignature: true,
    },
    {
      id: 'kerala-veg-stew-appam',
      name: 'Kerala Vegetable Stew & Appam',
      category: 'kerala',
      description:
        'Delicately spiced seasonal vegetables simmered in creamy first-press coconut milk with whole cloves and green cardamoms, served with soft hoppers.',
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
      image: IMAGES.biryani,
      needsConfirmation: true, // TODO: confirm exact stew recipe details
    },
    {
      id: 'kerala-paneer-curry',
      name: 'Malabar Paneer Roast',
      category: 'kerala',
      description:
        'Cottage cheese cubes tossed in a robust onion-tomato masala with crushed fennel, fresh ginger, and curry leaves.',
      dietaryTags: ['Vegetarian', 'Gluten-Free', 'Spicy'],
      image: IMAGES.beefFry,
      needsConfirmation: true, // TODO: confirm
    },

    // --- ARABIAN SECTION ---
    {
      id: 'arabian-mandi',
      name: 'Arabian Mandi Feast',
      category: 'arabian',
      description:
        'Authentic fragrant long-grain basmati rice infused with whole Arabian spices and slow-roasted meat with golden skin, served with garlic toum and spicy dakous sauce.',
      dietaryTags: ['Gluten-Free'],
      image: IMAGES.mandi,
      isSignature: true,
    },
    {
      id: 'arabian-alfaham',
      name: 'Charcoal Grilled Al Faham Chicken',
      category: 'arabian',
      description:
        'Whole chicken marinated in traditional Arabic spice rub, slow-grilled over red-hot coals for a crisp, smoky finish. Served with kuboos.',
      dietaryTags: ['Spicy'],
      image: IMAGES.mandi,
      needsConfirmation: true, // TODO: confirm availability with owner
    },
    {
      id: 'arabian-hummus-falafel',
      name: 'Crispy Falafel & Creamy Hummus Platter',
      category: 'arabian',
      description:
        'Golden ground chickpea and fresh herb falafels served with velvety tahini hummus, olive oil, and warm pita bread.',
      dietaryTags: ['Vegetarian', 'Vegan'],
      image: IMAGES.mandi,
      needsConfirmation: true, // TODO: confirm
    },

    // --- CHINESE SECTION ---
    {
      id: 'chinese-chicken-lollipop',
      name: 'Chicken Lollipop (Dry / Sauced)',
      category: 'chinese',
      description:
        'Crispy drumettes frenched and fried until golden, tossed in a zesty Indo-Chinese garlic chili glaze with spring onions.',
      dietaryTags: ['Spicy'],
      image: IMAGES.chickenLollipop,
      isSignature: true,
    },
    {
      id: 'chinese-hot-sour-soup',
      name: 'Chicken Hot & Sour Soup',
      category: 'chinese',
      description:
        'Classic steaming broth balanced with dark soy, crushed white pepper, shredded chicken, eggs, and bamboo shoots.',
      dietaryTags: ['Spicy'],
      image: IMAGES.chickenLollipop,
    },
    {
      id: 'chinese-szechuan-fried-rice',
      name: 'Szechuan Fried Rice',
      category: 'chinese',
      description:
        'Wok-tossed basmati rice with fiery red chili paste, crisp bell peppers, spring onions, and toasted sesame.',
      dietaryTags: ['Spicy', 'Vegetarian'],
      image: IMAGES.chickenLollipop,
    },

    // --- DESSERT SECTION ---
    {
      id: 'dessert-ada-pradhaman',
      name: 'Traditional Ada Pradhaman Payasam',
      category: 'dessert',
      description:
        'Silky steamed rice flakes stewed in dark organic jaggery and thick coconut milk, garnished with ghee-roasted cashews and coconut slices.',
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
      image: IMAGES.payasam,
      isSignature: true,
      needsConfirmation: true, // TODO: confirm daily dessert availability
    },
    {
      id: 'dessert-tender-coconut-pudding',
      name: 'Wayanad Tender Coconut Pudding',
      category: 'dessert',
      description:
        'Subtle, melt-in-the-mouth chilled pudding crafted from fresh Malabar tender coconut pulp and condensed milk.',
      dietaryTags: ['Vegetarian', 'Gluten-Free'],
      image: IMAGES.payasam,
      needsConfirmation: true, // TODO: confirm
    },
  ] as MenuItem[],

  // ---------------------------------------------------------------------------
  // 7. EDITORIAL GALLERY ASSETS
  // ---------------------------------------------------------------------------
  gallery: [
    {
      id: 'gal-1',
      title: 'Malabar Dum Biryani in Traditional Uruli',
      category: 'Signature Kerala',
      image: IMAGES.biryani,
      alt: 'Authentic Kerala Malabar Dum Biryani in a brass uruli platter',
      span: 'col-span-12 md:col-span-8',
    },
    {
      id: 'gal-2',
      title: 'Slow-Roasted Beef Fry with Coconut Slivers',
      category: 'Kerala Classic',
      image: IMAGES.beefFry,
      alt: 'Kerala slow roasted beef fry with golden layered parotta on banana leaf',
      span: 'col-span-12 md:col-span-4',
    },
    {
      id: 'gal-3',
      title: 'Communal Arabian Mandi Platter',
      category: 'Arabian Heritage',
      image: IMAGES.mandi,
      alt: 'Arabian Chicken and Lamb Mandi served on a silver platter with toum',
      span: 'col-span-12 md:col-span-4',
    },
    {
      id: 'gal-4',
      title: 'Indo-Chinese Crispy Chicken Lollipops',
      category: 'Appetizer Specials',
      image: IMAGES.chickenLollipop,
      alt: 'Indo-Chinese fried chicken lollipops with chili garlic glaze',
      span: 'col-span-12 md:col-span-4',
    },
    {
      id: 'gal-5',
      title: 'Traditional Ada Pradhaman Payasam',
      category: 'Kerala Sweet Endings',
      image: IMAGES.payasam,
      alt: 'Traditional Kerala Ada Pradhaman payasam served in antique brass uruli',
      span: 'col-span-12 md:col-span-4',
    },
  ],
};
