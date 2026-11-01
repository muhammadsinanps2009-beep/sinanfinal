# Newform Restaurant — Digital Dining Experience & Website

A cinematic, editorial web experience for **Newform Restaurant** in Kalpetta, Wayanad, Kerala, celebrating authentic Kerala delicacies, Arabian specialties, and warm, affordable hospitality with interactive dietary menu exploration and turn-by-turn visit navigation.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Strategic & Functional Choices**:
> - **Culinary Dual-Identity**: Seamlessly showcase both Kerala culinary heritage (parotta, slow-roasted beef fry, dum biryani) and Arabian cuisine (fragrant mandi, grilled meats) side-by-side with equal prestige.
> - **Menu Exploration with Dietary Filtering**: Added interactive filtering for **Vegetarian**, **Vegan**, **Gluten-Free**, and **Spicy** dietary tags with instant, zero-lag updates and category tabs (Kerala, Arabian, Chinese, Desserts).
> - **Interactive Directions & Route Planning**: Integrated responsive Google Maps embed with custom starting point address entry, one-tap route launching, and direct mobile calling/WhatsApp triggers.
> - **Cinematic 3D & High-Fidelity Visuals**: 3D interactive spice & platter presentation powered by Three.js with graceful fallback to high-resolution photography on mobile or low-power devices.
> - **Strict Editorial Integrity & Central Data**: Single source of truth in `src/siteData.ts` with no hardcoded business facts, exact Google review metrics (4.0/5.0 with 3,303 reviews and exact 1–5 star distributions), and clearly marked placeholders for unverified opening hours and WhatsApp.

---

## 1. Overview & Core Concept

- **What It Does**: Newform Restaurant's web application serves as a luxury yet approachable digital front door. Visitors experience the restaurant's dual culinary heritage ("Two Kitchens. One Table."), explore curated menus with real-time dietary filters, inspect signature dishes with editorial storytelling, review verified rating distribution data, preview atmospheric food galleries, and calculate directions directly to Mandayapuram, Kalpetta.
- **Target Audience / Persona**: Travelers and tourists exploring the hill district of Wayanad, local food enthusiasts seeking Kerala comfort classics (porotta & beef fry), families dining out for celebratory Arabian mandi platters, and travelers looking for quick, authentic, and affordable meals near the old bus stand.
- **Key Value**: Delivers immediate appetite appeal, transparent menu discovery, friction-free route planning, and genuine social proof without generic template clutter.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Arrival & Cinematic First Impression**:
   - Short, refined brand preloader (`NEWFORM`).
   - Sticky transparent navigation with blur on scroll, 1-line wordmark, single-line links, and "Reserve / Contact" action.
   - Cinematic hero headline: *"Two food cultures. One unforgettable table."* accompanied by an interactive 3D platter with floating spices (cardamom, star anise, curry leaves) and steam, paired with quick action CTAs (*Explore Menu*, *Get Directions*, *Call Now*).
2. **Two Kitchens Experience ("The Kerala Kitchen" & "The Arabian Kitchen")**:
   - Editorial split showcase highlighting traditional Kerala spice roasting techniques vs. Arabian mandi pit and charcoal grilling traditions.
   - Touch-friendly horizontal storytelling track with responsive vertical collapse on small viewports.
3. **Interactive Menu Discovery & Dietary Filters**:
   - 4 Category Switchers: **Kerala**, **Arabian**, **Chinese**, **Desserts**.
   - Dynamic dietary filter buttons: **All**, **Vegetarian**, **Vegan**, **Gluten-Free**, **Spicy**.
   - Real-time instant filtering with dish badges, item descriptions, price tags (hidden gracefully when unconfirmed), and hover micro-interactions.
4. **Signature Dish Spotlight ("The Flavours That Define Us")**:
   - Deep editorial dive into two iconic offerings: *Beef Fry & Flaky Kerala Parotta* and *Dum Beef Biryani*.
   - Asymmetric visual composition, ingredient notes, and aroma descriptions.
5. **Guest Love & Transparent Review Distribution**:
   - Animated count-up counter: `4.0 / 5.0` based on `3,303+ Google Reviews`.
   - Exact animated horizontal bar breakdown: 5★ (1,398), 4★ (1,094), 3★ (432), 2★ (120), 1★ (259).
   - Authentic diner sentiment tags (*Affordable prices*, *Kerala & Arabian sections*, *Beef fry and parotta*, *Dum beef biryani*).
   - Clearly annotated placeholder container for verified customer quotes.
6. **Visual Feast Gallery**:
   - Curated high-resolution editorial photography of dishes, kitchen prep, and warm dining spaces with subtle zoom on hover.
7. **Interactive Visit & Route Planning**:
   - Prominent address lockup: *Main Rd, Mandayapuram, Kalpetta, Kerala 673121 (Near old bus stand)*.
   - Interactive origin input allowing visitors to type their current hotel, town, or landmark (e.g. *Vythiri*, *Sulthan Bathery*, *Meppadi*) to trigger instant directions in Google Maps.
   - Live embedded responsive map + quick action buttons (*Call +91 4936 204 848*, *WhatsApp*, *Get Directions*).
8. **Footer & Mobile Float Utility**:
   - Compact bottom floating bar on mobile with one-tap *Call* and *WhatsApp* actions without obstructing navigation.
   - Clean footer with quick links, operating hours disclosure, and social placeholders.

### Visual Identity & Theme
- **Color Palette**:
  - `Canvas Dark`: `#14110F` (Deep charcoal obsidian)
  - `Canvas Light / Cream`: `#F6EFE3` (Warm spiced buttermilk cream)
  - `Accent Gold`: `#D9A441` (Warm Malabar saffron gold)
  - `Accent Spice Red`: `#A63A2B` (Sun-dried Kerala chili red)
  - `Accent Kerala Green`: `#2F5D46` (Lush Western Ghats leaf green)
  - `Border / Hairline`: `rgba(217, 164, 65, 0.2)` and subtle charcoal hairline dividers.
- **Typography**:
  - Headings & Editorial Display: *Playfair Display* (Editorial luxury serif with letter-spacing discipline).
  - Body & UI Controls: *Plus Jakarta Sans* / *Inter* (High-legibility geometric sans).
  - Metrics & Numbers: Monospace tabular numerals (`tabular-nums`) for review counts, ratings, and coordinates.
- **Micro-Interactions**:
  - Subtle film grain texture overlay.
  - Desktop-only custom cursor with hover expansion.
  - Magnetic buttons on primary CTAs.
  - Smooth card elevation and subtle zoom transitions on dish hover.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized `siteData.ts` Architecture**
  - *Chosen Approach*: Every restaurant property (business name, coordinates, address, phone number, review metrics, menu items, dietary tags, prices, gallery images, social links) lives exclusively in `src/siteData.ts`.
  - *Why*: Allows restaurant managers and non-technical staff to update menu items, prices, or operating hours in 30 seconds without touching JSX/TSX layout code.
- **Decision 2: Instant Client-Side Dietary & Category Filtering**
  - *Chosen Approach*: Multi-dimensional client-side filtering combining active cuisine category with optional multi-tag or single-tag dietary filters.
  - *Why*: Zero network latency, instant visual feedback, and completely offline-capable without API server roundtrips.
- **Decision 3: Dual 3D Hero + High-Fidelity Static Fallback**
  - *Chosen Approach*: Procedural Three.js platter scene with rotating spices and steam, using GPU software detection (`isSoftwareGl`), device pixel ratio capping, and mobile detection to seamlessly fall back to cinematic photography.
  - *Why*: Ensures 60fps buttery smoothness on high-end laptops while guaranteeing fast load times and battery friendliness on budget Android phones common among travelers.
- **Decision 4: Real Coordinates & Interactive Route Generator**
  - *Chosen Approach*: Use verified coordinates `11.6137653, 76.0828979` for Google Maps embed + dynamic direction query generation `https://www.google.com/maps/dir/?api=1&origin={origin}&destination=11.6137653,76.0828979`.
  - *Why*: Wayanad is a hilly tourist destination where visitors travel between Vythiri, Kalpetta, and Sulthan Bathery; providing custom origin input eliminates guesswork for diners.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NEWFORM WEB APPLET                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            src/siteData.ts                            │  │
│  │   • Restaurant Bio & Coordinates (11.6137653, 76.0828979)             │  │
│  │   • Menu Items (Kerala, Arabian, Chinese, Desserts)                   │  │
│  │   • Dietary Tags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Spicy']     │  │
│  │   • Exact Google Review Metrics (4.0★, 3,303 reviews, 5-to-1 dist)    │  │
│  │   • Contact channels, social links & unconfirmed TODO markers         │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                       │
│              ┌──────────────────────┴──────────────────────┐                │
│              ▼                                             ▼                │
│  ┌───────────────────────┐                     ┌─────────────────────────┐  │
│  │     UI Components     │                     │  Interactive Modules    │  │
│  ├───────────────────────┤                     ├─────────────────────────┤  │
│  │ • Header & Sticky Nav │                     │ • ThreeHeroScene (3D)   │  │
│  │ • Hero Banner & CTAs  │                     │ • MenuFilterEngine      │  │
│  │ • TwoKitchens Story   │                     │ • InteractiveMapModule  │  │
│  │ • SignatureSpotlight  │                     │ • RatingDistributionBar │  │
│  │ • PhotoGallery        │                     │ • CustomCursor (Desktop)│  │
│  │ • Footer & Schema     │                     │ • MobileFloatingBar     │  │
│  └───────────────────────┘                     └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Mapping
- **`siteData.ts` Schema**:
  ```ts
  interface MenuItem {
    id: string;
    name: string;
    category: 'kerala' | 'arabian' | 'chinese' | 'dessert';
    description: string;
    dietaryTags: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Spicy')[];
    price?: string; // Optional if unconfirmed
    featured?: boolean;
    image: string;
    needsConfirmation?: boolean;
  }
  ```
- **Interactive Component State**:
  - `activeCategory`: Current cuisine category tab (`'kerala' | 'arabian' | 'chinese' | 'dessert'`).
  - `selectedDietary`: Active dietary filter (`'all' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Spicy'`).
  - `userOrigin`: Custom address string input in 'Visit Us' section for turn-by-turn route generation.
  - `is3DActive`: Auto-detected WebGL capability and user preference toggle.
  - `mobileNavOpen`: Responsive menu drawer state.

### SEO & Structured Data (JSON-LD)
- Includes schema:
  - `@type`: `Restaurant`
  - `name`: `Newform Restaurant`
  - `address`: Mandayapuram, Kalpetta, Kerala 673121
  - `servesCuisine`: `['Kerala', 'Arabian', 'South Indian', 'Chinese']`
  - `geo`: latitude `11.6137653`, longitude `76.0828979`
  - `aggregateRating`: ratingValue `4.0`, reviewCount `3303`

---

## Execution Sequence (Post-Approval)
1. **Package Setup**: Install `three` and `@types/three` for the 3D platter experience.
2. **Central Data Creation**: Build complete, fully-documented `src/siteData.ts` containing all restaurant details, dietary tags, review breakdowns, and placeholders.
3. **Asset Generation & Integration**: Generate photorealistic dishes for Kerala Biryani, Malabar Parotta & Beef Fry, Arabian Mandi, Chinese Lollipop, and Desserts.
4. **Core UI Modules**:
   - `Header.tsx`: Transparent sticky navbar with 3-zone contract.
   - `Hero.tsx` & `Hero3DScene.tsx`: 3D steam & spice platter with static fallback.
   - `TwoKitchens.tsx`: Responsive Kerala vs Arabian kitchen storytelling.
   - `MenuSection.tsx`: Tabbed catalog with dynamic dietary tags and search/sort.
   - `SignatureSpotlight.tsx`: Editorial showcase of Beef Fry & Porotta and Dum Biryani.
   - `ReviewsSection.tsx`: Animated count-up and 5-to-1 star distribution bars.
   - `GallerySection.tsx`: Editorial asymmetric photography grid with modal preview.
   - `VisitUsSection.tsx`: Interactive Google Maps embed + origin direction router.
   - `Footer.tsx` & `MobileFloatingContact.tsx`: Polished footer & quick mobile CTAs.
5. **App Assembly & Polish**: Wire up `App.tsx`, `index.html` meta tags and JSON-LD, custom cursor, smooth scrolling, and verify production build.
