export type ProductCategory = 'heritage' | 'landscapes' | 'portraits';

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  basePriceUsd: number;
  image: string;
  gallery: string[];
  edition: string;
  stock: number;
  description: string;
  story: string;
  details: {
    label: string;
    value: string;
  }[];
  materials: string[];
};

export const products: Product[] = [
  {
    id: 'art-001',
    slug: 'vishnu-and-lakshmi-limited-edition',
    title: 'Vishnu and Lakshmi in Eternal Harmony',
    category: 'heritage',
    basePriceUsd: 179,
    image:
      'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90',
    ],
    edition: '100 Prints Only',
    stock: 2,
    description:
      'A timeless expression of harmony, prosperity and divine balance, crafted as a premium fine art print.',
    story:
      'Seated upon the coiled serpent Ananta, Vishnu and Lakshmi appear in serene prosperity and cosmic order. The composition radiates symmetry and rhythm, with intricate patterning and vibrant colors enhancing the divine presence.',
    details: [
      { label: 'Style', value: 'Indian Traditional' },
      { label: 'Theme', value: 'Mythology, divinity, cosmic balance' },
      { label: 'Collection', value: 'Heritage' },
      { label: 'Print Type', value: 'Giclée Fine Art Print' },
      { label: 'Paper', value: '300 GSM Archival Paper' },
      { label: 'Edition', value: 'Limited Edition — 100 Prints Only' },
    ],
    materials: [
      'Print — 300 GSM archival fine art paper',
      'Backing — 1150 GSM support board',
      'Protection sleeve — transparent eco sleeve',
      'Inner wrap — protective paper',
      'Packaging — secure courier packaging with cushioning',
      'Carry bag — premium reusable carry bag',
    ],
  },
  {
    id: 'art-002',
    slug: 'golden-valley-landscape',
    title: 'Golden Valley Landscape',
    category: 'landscapes',
    basePriceUsd: 149,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90',
    ],
    edition: '150 Prints Only',
    stock: 18,
    description:
      'A warm landscape composition designed for refined living rooms, offices and premium hospitality spaces.',
    story:
      'Golden Valley Landscape captures peaceful natural depth with warm tones and calm visual movement, suitable for premium interiors.',
    details: [
      { label: 'Style', value: 'Landscape Art' },
      { label: 'Theme', value: 'Nature, calm, warm interiors' },
      { label: 'Collection', value: 'Landscapes' },
      { label: 'Print Type', value: 'Fine Art Print' },
      { label: 'Paper', value: '300 GSM Archival Paper' },
      { label: 'Edition', value: 'Limited Edition — 150 Prints Only' },
    ],
    materials: [
      'Print — 300 GSM archival fine art paper',
      'Backing — premium support board',
      'Protection sleeve — transparent eco sleeve',
      'Packaging — secure courier packaging',
    ],
  },
  {
    id: 'art-003',
    slug: 'royal-portrait-study',
    title: 'Royal Portrait Study',
    category: 'portraits',
    basePriceUsd: 199,
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90',
    ],
    edition: '75 Prints Only',
    stock: 9,
    description:
      'A refined portrait artwork with strong visual presence for collectors, galleries and statement walls.',
    story:
      'Royal Portrait Study brings expressive presence and refined visual character to curated interior spaces.',
    details: [
      { label: 'Style', value: 'Portrait Art' },
      { label: 'Theme', value: 'Royalty, elegance, expression' },
      { label: 'Collection', value: 'Portraits' },
      { label: 'Print Type', value: 'Fine Art Print' },
      { label: 'Paper', value: '300 GSM Archival Paper' },
      { label: 'Edition', value: 'Limited Edition — 75 Prints Only' },
    ],
    materials: [
      'Print — 300 GSM archival fine art paper',
      'Backing — premium support board',
      'Protection sleeve — transparent eco sleeve',
      'Packaging — secure courier packaging',
    ],
  },
];
