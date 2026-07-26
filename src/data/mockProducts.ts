import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'noor-pod-pro',
    name: 'Noor AI Neural Pods Pro',
    tagline: 'Real-time multi-language translation & audio enhancement',
    price: 249.99,
    category: 'Hardware',
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    description: 'Experience crystal-clear acoustic immersion powered by custom Neural Edge processing. Real-time translation across 45 languages with zero latency.',
    features: [
      'Active Neural Noise Cancellation',
      '45-Language Real-time Voice Translation',
      '36-hour total battery life with wireless charging case',
      'Ultra-comfortable ergonomic silicone tips'
    ],
    inStock: true
  },
  {
    id: 'noor-hub-home',
    name: 'Noor Smart Hub AI Display',
    tagline: 'Your home assistant with Gemini vision and voice integration',
    price: 199.50,
    category: 'Hardware',
    rating: 4.8,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    description: 'A gorgeous 10-inch 4K touchscreen display built to orchestrate your smart home, manage calendar workflows, and assist with cooking recipes using visual AI.',
    features: [
      '10.1" Vibrant QLED Display',
      'Integrated Gemini Vision camera with physical privacy shutter',
      'Matter & Thread smart home protocol support',
      'Studio-quality dual speaker array'
    ],
    inStock: true
  },
  {
    id: 'gemini-writer-pro-key',
    name: 'Noor AI Writer Pro License',
    tagline: 'Unlimited content generation & marketing automation suite',
    price: 79.00,
    category: 'Software',
    rating: 5.0,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Supercharge your productivity with full access to our customized copywriting engine. Generate SEO product descriptions, blog posts, and ad copy in seconds.',
    features: [
      'Unlimited word generation per month',
      'Custom brand voice training',
      'Export to Google Docs, Notion, and Markdown',
      '24/7 priority cloud rendering'
    ],
    inStock: true
  },
  {
    id: 'noor-smart-ring',
    name: 'Noor Pulse Smart Ring',
    tagline: 'Precision biometric tracking with predictive AI insights',
    price: 299.00,
    category: 'Accessories',
    rating: 4.7,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    description: 'Crafted from aerospace-grade titanium, the Noor Pulse tracks your sleep architecture, HRV, and daily recovery scores without getting in your way.',
    features: [
      'Aerospace titanium alloy finish (Matte Black or Silver)',
      '7-day continuous battery life',
      'Water resistant up to 100m',
      'AI-powered health recommendations engine'
    ],
    inStock: true
  },
  {
    id: 'noor-desk-mat',
    name: 'Noor Qi-Charge Desk Mat',
    tagline: 'Spacious vegan leather surface with invisible fast charging',
    price: 69.99,
    category: 'Accessories',
    rating: 4.6,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    description: 'Declutter your workspace. Features a dedicated 15W wireless charging zone embedded directly inside premium water-resistant vegan leather.',
    features: [
      '35" x 16" generous surface area',
      '15W Qi-compatible wireless fast charge zone',
      'Non-slip natural rubber base',
      'Precision stitched edge durability'
    ],
    inStock: true
  },
  {
    id: 'ai-photo-studio',
    name: 'Noor AI Studio Graphics Suite',
    tagline: 'Next-gen image editing & product photography enhancement',
    price: 129.00,
    category: 'Software',
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    description: 'Transform basic snapshots into professional studio-grade marketing photos using state-of-the-art generative background replacement and relighting models.',
    features: [
      '1-click background removal & studio relighting',
      'Generative fill and object removal',
      'Batch processing for e-commerce inventories',
      'Cloud synced asset library'
    ],
    inStock: true
  }
];
