import { Product } from '../types';

const COLORS_7 = [
  'Black',
  'Crimson Red',
  'Maroon',
  'Navy Blue',
  'Forest Green',
  'Creamy White',
  'Mustard Gold',
];

function colorImages(productFolder: string, colors: string[]): string {
  // Returns the default (first) image path for the product card
  const firstColor = colors[0].toLowerCase().replace(/\s+/g, '-');
  return `/assets/${productFolder}/${firstColor}.webp`;
}

function allImages(productFolder: string, colors: string[]): string[] {
  // Returns every color-variant image path for the product gallery
  return colors.map(
    (color) => `/assets/${productFolder}/${color.toLowerCase().replace(/\s+/g, '-')}.webp`
  );
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'noor-malaysian-4pc-set',
    name: 'Premium Malaysian 4-Piece Modest Hijab Set',
    tagline: 'Complete modest set — hijab, inner cap, niqab & pins',
    price: 2899,
    cutPrice: 3890,
    category: 'Malaysian Hijab Set',
    rating: 4.8,
    reviewsCount: 156,
    image: colorImages('product-1', COLORS_7),
    images: allImages('product-1', COLORS_7),
    colors: COLORS_7,
    description:
      'Buy this premium 4-piece Malaysian hijab set online in Pakistan. Made from soft, breathable fabric that feels light and stays comfortable all day. The set includes hijab, inner cap, niqab, and pins — everything you need for easy modest dressing.',
    features: [
      '4-piece complete set',
      'Premium Malaysian fabric',
      'Breathable & lightweight',
      'Available in 7 colors',
      'Includes matching pins',
    ],
    inStock: true,
  },
  {
    id: 'noor-chiffon-stole-niqab',
    name: 'Premium Chiffon Hijab Stole + Niqab',
    tagline: 'Soft chiffon stole paired with a matching niqab',
    price: 799,
    cutPrice: 999,
    category: 'Instant Hijab',
    rating: 4.6,
    reviewsCount: 98,
    image: colorImages('product-2', COLORS_7),
    images: allImages('product-2', COLORS_7),
    colors: COLORS_7,
    description:
      'Shop this premium chiffon hijab online. Soft and lightweight, it comes with a matching niqab for full coverage. Easy to wear and perfect for daily use. A best-selling modest wear item in Pakistan.',
    features: [
      'Premium chiffon fabric',
      'Matching niqab included',
      'Lightweight & breathable',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-chiffon-square-half-niqab',
    name: 'Premium Chiffon Square Scarf with Half Niqab',
    tagline: 'Classic square scarf styling with half niqab coverage',
    price: 1199,
    cutPrice: 1899,
    category: 'Instant Hijab',
    rating: 4.7,
    reviewsCount: 112,
    image: colorImages('product-3', COLORS_7),
    images: allImages('product-3', COLORS_7),
    colors: COLORS_7,
    description:
      'A classic square hijab scarf made from soft chiffon fabric, with a half niqab included. Easy to style and comfortable for everyday wear. A popular choice for women looking for affordable, premium hijabs online.',
    features: [
      'Square scarf design',
      'Half niqab included',
      'Soft chiffon material',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-2layer-instant-khimar',
    name: 'Premium 2-Layer Instant Khimar',
    tagline: 'Effortless full-coverage khimar, ready to wear',
    price: 1299,
    cutPrice: 1999,
    category: 'Khimar',
    rating: 4.8,
    reviewsCount: 134,
    image: colorImages('product-4', COLORS_7),
    images: allImages('product-4', COLORS_7),
    colors: COLORS_7,
    description:
      'No pins needed — just wear and go. This instant khimar gives full coverage with a clean, elegant look. Made from premium fabric, perfect for daily prayer, work, or travel. Buy khimar online at the best price.',
    features: [
      '2-layer instant design',
      'Full coverage',
      'No pins required',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-saudi-style-niqab',
    name: 'Classic Soft Saudi Style Niqab',
    tagline: 'Traditional Saudi-style niqab in soft fabric',
    price: 299,
    cutPrice: 599,
    category: 'Niqab',
    rating: 4.5,
    reviewsCount: 76,
    image: '/assets/product-5/black.webp',
    images: ['/assets/product-5/black.webp'],
    colors: ['Black'],
    description:
      'A classic Saudi-style niqab made from soft, breathable fabric. Comfortable for all-day wear at an affordable price. A must-have modest wear essential for every Muslim woman.',
    features: [
      'Traditional Saudi style',
      'Soft, breathable fabric',
      'Comfortable all-day wear',
      'Black only',
    ],
    inStock: true,
  },
  {
    id: 'noor-breathable-niqab-patti',
    name: 'Soft Breathable Niqab Patti',
    tagline: 'Lightweight breathable patti for everyday comfort',
    price: 200,
    cutPrice: 300,
    category: 'Niqab',
    rating: 4.4,
    reviewsCount: 61,
    image: colorImages('product-6', COLORS_7),
    images: allImages('product-6', COLORS_7),
    colors: COLORS_7,
    description:
      'A lightweight niqab patti that is soft and breathable. Comfortable for all-day wear. A simple, affordable modest wear accessory available online in Pakistan.',
    features: [
      'Soft breathable fabric',
      'Lightweight & comfortable',
      'Easy to wear',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-hijab-attached-patti-niqab',
    name: 'Premium Hijab with Attached Patti + Niqab',
    tagline: 'All-in-one hijab with built-in patti and niqab',
    price: 999,
    cutPrice: 1299,
    category: 'Instant Hijab',
    rating: 4.7,
    reviewsCount: 89,
    image: colorImages('product-7', COLORS_7),
    images: allImages('product-7', COLORS_7),
    colors: COLORS_7,
    description:
      'A ready-to-wear hijab with attached patti and niqab, all in one piece. Save time while getting a complete modest look. One of our best-selling premium hijabs, available online at a great price.',
    features: [
      'Attached patti & niqab',
      'All-in-one convenience',
      'Premium fabric',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-luxury-chiffon-georgette-full',
    name: 'Premium Luxury Chiffon Georgette Hijab – Full Size',
    tagline: 'Luxurious georgette hijab in full length',
    price: 899,
    cutPrice: 1199,
    category: 'Casual',
    rating: 4.6,
    reviewsCount: 143,
    image: colorImages('product-8', COLORS_7),
    images: allImages('product-8', COLORS_7),
    colors: COLORS_7,
    sizeLabel: 'Full Size',
    description:
      'A premium chiffon georgette hijab in full size. Soft, breathable fabric with an elegant drape, perfect for daily wear or special occasions. Buy premium hijabs online at affordable prices.',
    features: [
      'Full-size length',
      'Luxury chiffon georgette',
      'Elegant drape',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-luxury-chiffon-georgette-petite',
    name: 'Premium Luxury Chiffon Georgette Hijab – Petite Size',
    tagline: 'Luxurious georgette hijab in petite length',
    price: 499,
    cutPrice: 799,
    category: 'Casual',
    rating: 4.6,
    reviewsCount: 108,
    image: colorImages('product-9', COLORS_7),
    images: allImages('product-9', COLORS_7),
    colors: COLORS_7,
    sizeLabel: 'Petite Size (28x72 in)',
    description:
      'The same premium chiffon georgette fabric in a petite, easy-to-manage size. Lightweight, soft, and simple to style — great for everyday modest wear. Shop affordable hijabs online.',
    features: [
      'Petite length',
      'Luxury chiffon georgette',
      'Lightweight & elegant',
      'Available in 7 colors',
    ],
    inStock: true,
  },
  {
    id: 'noor-pearl-hijab-pins-40pc',
    name: 'Premium Pearl Hijab Pins Set (40 Pcs)',
    tagline: 'Elegant pearl pins to secure your hijab in style',
    price: 149,
    cutPrice: 200,
    category: 'Accessories',
    rating: 4.5,
    reviewsCount: 210,
    image: '/assets/product-10/mixed-metallic.webp',
    images: ['/assets/product-10/mixed-metallic.webp', '/assets/product-10/mixed-metallic-2.webp'],
    description:
      'A set of 40 pearl hijab pins in mixed metallic colors. Strong grip to keep your hijab secure all day. A must-have hijab accessory, available online at an affordable price.',
    features: [
      '40 pieces per set',
      'Mixed metallic finishes',
      'Pearl-accented design',
      'Secure & long-lasting',
    ],
    inStock: true,
  },
  {
    id: 'noor-3layer-modest-khimar',
    name: 'Premium 3-Layer Modest Khimar',
    tagline: 'Ultimate full coverage with 3 layers of premium fabric',
    price: 1990,
    cutPrice: 2990,
    category: 'Khimar',
    rating: 4.9,
    reviewsCount: 187,
    image: colorImages('product-11', COLORS_7),
    images: allImages('product-11', COLORS_7),
    colors: COLORS_7,
    description:
      'A premium 3-layer khimar for full, secure coverage. Made from soft fabric that is comfortable for daily prayer, travel, or everyday modest wear. Buy khimar online in Pakistan at the best price.',
    features: [
      '3-layer premium design',
      'Ultimate full coverage',
      'Elegant modest styling',
      'Available in 7 colors',
    ],
    inStock: true,
  },
];

// Combo Deals
export const COMBO_DEALS = [
  {
    id: 'combo-2-petite-hijabs',
    icon: '🎀',
    title: '2 Petite Hijabs',
    features: ['Size: 28×72', 'Any 2 Colors'],
    gift: 'FREE Wheel Pin Gift',
    price: 899,
  },
  {
    id: 'combo-5-petite-hijabs',
    icon: '🎀',
    title: '5 Petite Hijabs',
    features: ['Size: 28×72', 'Any 5 Colors'],
    gift: 'FREE Wheel Pin Gift',
    price: 2190,
  },
  {
    id: 'combo-6-niqabs',
    icon: '🥷',
    title: 'Any 6 Niqabs',
    features: ['Mix Any Colors'],
    gift: null,
    price: 999,
  },

];