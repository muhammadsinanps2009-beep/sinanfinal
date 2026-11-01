# Newform Restaurant — Kalpetta, Wayanad, Kerala

A luxury editorial, production-quality digital dining experience created for **Newform Restaurant** in Kalpetta, Wayanad, India.

Celebrating authentic Kerala delicacies (slow-roasted beef fry, flaky tawa parotta, dum biryani) and Arabian feasts (fragrant Mandi, grilled meats), served with warm and affordable hospitality.

---

## Key Features

1. **Cinematic Hero**:
   - Interactive 3D spice and brass uruli platter powered by Three.js (rotating cardamom pods, star anise, curry leaves, and subtle steam).
   - Instant toggle between interactive 3D and editorial photography.
   - Automatic low-power and mobile device fallback.
2. **Two Kitchens Experience**:
   - Side-by-side interactive storytelling celebrating *The Kerala Kitchen* and *The Arabian Kitchen*.
3. **Interactive Menu with Instant Dietary Filtering**:
   - 4 Cuisine Categories: Kerala, Arabian, Chinese, Desserts.
   - Instant dynamic dietary filters: **All**, **Vegetarian**, **Vegan**, **Gluten-Free**, **Spicy**.
   - Hover zoom micro-interactions and status labels.
4. **Signature Dish Spotlight**:
   - Asymmetric editorial showcase of *Beef Fry & Kerala Parotta* and *Dum Beef Biryani*.
5. **Verified Guest Reviews & Distribution**:
   - Animated count-up: `4.0 / 5.0` based on `3,303+ Google Reviews`.
   - Exact horizontal rating distribution bars: 5★ (1,398), 4★ (1,094), 3★ (432), 2★ (120), 1★ (259).
   - Authentic diner praise tags and clearly annotated real-review placeholder.
6. **Editorial Photography Gallery**:
   - Asymmetric masonry grid with lightbox preview modal.
7. **Interactive Directions & Google Maps**:
   - Turn-by-turn route generator allowing visitors to enter their starting location (e.g., Vythiri, Sulthan Bathery, Kozhikode).
   - Embedded Google Map with real coordinates: `11.6137653, 76.0828979` near the old bus stand.
   - Prominent *Get Directions*, *Call Now*, and *WhatsApp* action buttons.
8. **Mobile Floating Action Controls**:
   - Compact floating Call and WhatsApp dial bar with 15% mobile viewport cap.
9. **SEO & Structured Data**:
   - OpenGraph and Twitter cards.
   - Schema.org `Restaurant` JSON-LD structured data for rich Google search snippets.

---

## Beginner-Friendly Customization Guide (`src/siteData.ts`)

ALL business information, prices, contact channels, menu items, dietary tags, and imagery live inside one centralized file:
**`src/siteData.ts`**

### Checklist for Restaurant Owners:

| Detail to Update | Line / Section in `src/siteData.ts` | What to Change |
| :--- | :--- | :--- |
| **WhatsApp Number** | `location.whatsappPlaceholder` | Change `914936204848` to your official business WhatsApp number |
| **Email Address** | `location.emailPlaceholder` | Update `info@newformrestaurant.com` to your verified email |
| **Opening Hours** | `location.openingHours` | Verify schedule (e.g. `11:00 AM – 11:00 PM`) and set `isConfirmed: true` |
| **Dish Prices** | `dishes[].price` | Add confirmed prices (e.g., `price: '₹180'`) to display them on dish cards |
| **Social Links** | `socialLinks` | Paste your active Instagram, Facebook, Swiggy, and Zomato URLs |
| **New Menu Items** | `dishes` array | Add or remove dish objects with custom `dietaryTags: ['Spicy', 'Vegetarian', etc.]` |
| **Custom Photographs** | `gallery` & `dishes` | Replace image URLs in `siteData.ts` with your new photo file paths |

---

## Local Development & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `/dist` directory.

---

## Deployment Instructions

### Deploying on Netlify
1. Connect your repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Deploy!

### Deploying on Cloudflare Pages
1. In Cloudflare Dashboard, go to **Pages** > **Create a project**.
2. Connect your Git repository.
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Save and Deploy**.
