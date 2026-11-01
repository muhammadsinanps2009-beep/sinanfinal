# Newform Restaurant — Staff & Admin User Guide

Welcome to the Newform Restaurant Management Portal. This guide explains how to manage your live website, update dish prices, hide sold-out items, review guest bookings, and publish announcement banners.

---

## 1. How to Log In to the Staff Portal

You can access the Staff Portal from any phone, tablet, or computer:

1. **Open the Website**: Go to the Newform Restaurant website.
2. **Access the Portal**:
   - On **Desktop**: Click the small **Lock icon** in the top-right header (next to "Book a Table") or in the footer at the very bottom.
   - On **Mobile**: Tap the **Menu icon** (three lines) and select **"Staff & Admin Portal"**.
   - **Direct Link**: You can also add `#/admin` to the end of the website URL in your browser address bar (for example: `https://your-site.com/#/admin`).
3. **Sign In**:
   - Click **"Sign In with Google"** and select your authorized Google account.
   - In restricted browser environments (or if popups are blocked), click **"Staff Direct Access (Sandbox Mode)"** for immediate access.
4. Once signed in, you will see the four management tabs: **Menu & Prices**, **Site Settings**, **Guest Inquiries**, and **Table Bookings**.
5. To return to the public dining website at any time, click the **"View Website"** button in the top bar.

---

## 2. How to Confirm a Guest Table Booking

When guests book a table online through the website, their reservation request appears live in the **Table Bookings** tab:

1. Click the **Table Bookings** tab.
2. New reservations appear with an amber **"PENDING"** badge showing the guest's name, phone number, date, time, and number of diners.
3. Click the green **"Confirm"** button on the booking row.
   - The status immediately updates to **"CONFIRMED"** in Firestore.
4. **Notify the Guest**:
   - Tap the green **WhatsApp icon** to automatically launch a pre-written WhatsApp message confirming their reservation with the exact date, time, and party size.
   - Or tap the **Phone icon** to call the diner directly.

---

## 3. How to Change a Dish Price

1. Click the **Menu & Prices** tab.
2. Locate the dish you want to update (use the Search bar or category filters if needed).
3. Click the **"Edit"** button on that dish's row.
4. In the modal that opens, locate the **"Display Price"** field.
5. Enter the new price (for example: `₹280`, `₹160`, or `Affordable daily`).
6. Click **"Update Dish"**.
   - The price updates instantly on the public menu without refreshing the page!

---

## 4. How to Hide or Show a Dish (Sold Out / Daily Specials)

When an item runs out or is unavailable for the day:

1. Click the **Menu & Prices** tab.
2. Find the dish in the table.
3. Look at the **"Website Visibility"** column:
   - Click the green **"Visible"** pill to toggle it.
   - The pill switches to red **"Hidden"**.
   - The dish is immediately hidden from the public website menu while remaining saved in your admin catalogue.
4. When the dish is back in stock, click the **"Hidden"** pill again to make it **"Visible"** to diners instantly.

---

## 5. How to Add a Public Announcement Banner

Use the top notice banner for special Ramadan menus, holiday hours, festival banquets, or seasonal catering alerts:

1. Click the **Site Settings** tab.
2. In the **"Top Website Notice Banner"** section, type your announcement in the **"Banner Announcement Text"** field.
   - *Example*: `Special Ramadan Mandi Feast Available Every Evening · Call +91 4936 204 848 for Family Reservations`
3. Check the **Live Preview** box below to see exactly how it will look.
4. Click **"Save Settings"** (or the gold button at the bottom).
   - A bright gold banner will appear across the top of the public website for all visitors.
5. **To Remove the Banner**: Simply clear the text in the box so it is empty, and click **"Save Settings"**.

---

## 6. How to Add a New Dish with a Photo

1. Click the **Menu & Prices** tab.
2. Click the gold **"Add New Dish"** button at the top right.
3. Fill in the dish details:
   - **Dish Name (English)**: (e.g., `Mutton Biryani with Raita`)
   - **Malayalam Name** (optional): (e.g., `മട്ടൺ ബിരിയാണി`)
   - **Cuisine Category**: Select `Kerala Kitchen`, `Arabian Kitchen`, `Chinese Flavours`, or `Desserts & Sweets`.
   - **Display Price**: (e.g., `₹340`)
   - **Dish Description**: Describe the spices, ingredients, and preparation.
   - **Dietary Tags**: Select tags like `Vegetarian`, `Gluten-Free`, or `Spicy`.
   - **Signature Dish Spotlight**: Check this if you want the dish featured in the signature showcases.
4. **Upload a Photo**:
   - Click **"Upload New Photo"** and select an image file from your device.
   - The system automatically resizes and compresses the photo to **under 1 MB** using HTML5 canvas, ensuring lightning-fast mobile loading and compliance with Firebase Storage security rules.
   - Once processed, a green checkmark confirms the image is ready.
5. Click **"Create Dish"**. The new item is published live to your menu catalog!

---

## 7. How to Import the Default Menu (First-Time Setup)

If your Firestore database was recently reset:

1. Go to the **Menu & Prices** tab.
2. Click **"Import Current Menu"**.
3. Confirm the prompt. All 12 authentic Kerala and Arabian dishes (including Beef Fry with Parotta, Malabar Dum Biryani, Mandi, and Payasam) will be seeded into Firestore with their descriptions, tags, and photos.
