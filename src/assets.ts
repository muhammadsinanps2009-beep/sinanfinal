/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Explicit ES module imports ensure Vite bundles and hashes all images during production build
import biryaniImg from './assets/images/hero_kerala_biryani_platter_1793513407852.jpg';
import beefFryImg from './assets/images/kerala_beef_fry_parotta_1793513407909.jpg';
import mandiImg from './assets/images/arabian_mandi_rice_1793513408413.jpg';
import chickenLollipopImg from './assets/images/chicken_lollipop_appetizer_1793513409712.jpg';
import payasamImg from './assets/images/kerala_dessert_payasam_1793513410813.jpg';

export const IMAGES = {
  biryani: biryaniImg,
  beefFry: beefFryImg,
  mandi: mandiImg,
  chickenLollipop: chickenLollipopImg,
  payasam: payasamImg,
} as const;
