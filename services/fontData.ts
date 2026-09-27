export interface FontStyle {
  name: string;
  weight: number;
  italic?: boolean;
  fileFormat?: string;
}

export interface VariableAxis {
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export interface FontItem {
  id: string;
  name: string;
  designer: string;
  foundry: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace' | 'variable' | 'luxury';
  fontFamily: string; // CSS font family
  colorFamily?: string;
  colorGradient?: string;
  glowShadow?: string;
  accentColor?: string;
  googleFont?: string;
  description: string;
  stylesCount: number;
  styles: FontStyle[];
  isVariable?: boolean;
  variableAxes?: VariableAxis[];
  sampleText: string;
  tags: string[];
  glyphCount: number;
  languages: string[];
  features: string[];
  prices: {
    personal: number;
    commercial: number;
    extended: number;
    enterprise: number;
  };
  creditPrice: number;
  badge?: string;
  trending?: boolean;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  downloads: number;
  releaseYear: number;
  specimenImage?: string;
  watermarkImage?: string;
}

export const FONT_CATALOG: FontItem[] = [
  {
    id: 'abdullah-martel',
    name: 'Abdullah Martel',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'luxury',
    fontFamily: "'Abdullah Martel', serif",
    colorFamily: "'Abdullah Martel', serif",
    accentColor: '#38bdf8',
    colorGradient: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 35%, #818cf8 65%, #c084fc 100%)',
    glowShadow: '0 4px 25px rgba(56, 189, 248, 0.5)',
    googleFont: 'Cinzel:wght@400;600;700;900',
    description: 'Ultra-exclusive luxury haute serif crafted with monumental architectural proportions, sharp chisels, and commanding regal poise. Features complete Regular, SemiBold, Bold, Black, Color, and Vector styles.',
    stylesCount: 6,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Black', weight: 900 },
      { name: 'Color OTF', weight: 800 },
      { name: 'Vector Edition', weight: 800 }
    ],
    sampleText: 'MONUMENTAL HAUTE COUTURE & REGAL ARCHITECTURE',
    tags: ['Luxury', 'Haute-Serif', 'Editorial', 'Chiseled', 'DRM Protected'],
    glyphCount: 680,
    languages: ['Latin Extended', 'Western European', 'Central European'],
    features: ['Capital Sharp Terminals', 'Monumental Ligatures', 'Roman Numeral Sets', 'Kerning Protection'],
    prices: { personal: 49, commercial: 99, extended: 249, enterprise: 799 },
    creditPrice: 990,
    badge: 'FLAGSHIP LUXE',
    trending: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 128,
    downloads: 14200,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-martel-specimen.png',
    watermarkImage: '/specimens/abdullah-martel-watermark.png'
  },
  {
    id: 'abdullah-metallic-chrome',
    name: 'Abdullah Metallic Chrome',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'display',
    fontFamily: "'Abdullah Metallic Chrome', sans-serif",
    colorFamily: "'Abdullah Metallic Chrome', sans-serif",
    accentColor: '#38bdf8',
    colorGradient: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 28%, #475569 50%, #94a3b8 72%, #ffffff 100%)',
    glowShadow: '0 0 28px rgba(56, 189, 248, 0.6)',
    googleFont: 'Syne:wght@700;800;900',
    description: 'High-octane polished metallic chrome titling typeface with razor-sharp specular bevels, liquid silver contours, and kinetic luxury styling.',
    stylesCount: 5,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Color Chrome', weight: 800 },
      { name: 'Vector Mesh', weight: 800 }
    ],
    sampleText: 'POLISHED METALLIC CHROME // SPECULAR VELOCITY',
    tags: ['Chrome', 'Metallic', 'Cyber-Luxe', '3D Display', 'DRM Protected'],
    glyphCount: 650,
    languages: ['Latin Extended'],
    features: ['Specular Bevels', 'Chrome Terminals', 'Ligature Sets'],
    prices: { personal: 45, commercial: 89, extended: 220, enterprise: 699 },
    creditPrice: 890,
    badge: 'CHROME EXCLUSIVE',
    trending: true,
    featured: true,
    rating: 4.99,
    reviewsCount: 94,
    downloads: 11600,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-metallic-chrome-specimen.png',
    watermarkImage: '/specimens/abdullah-metallic-chrome-watermark.png'
  },
  {
    id: 'abdullah-molten-chrome',
    name: 'Abdullah Molten Chrome',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'display',
    fontFamily: "'Abdullah Molten Chrome', sans-serif",
    colorFamily: "'Abdullah Molten Chrome', sans-serif",
    accentColor: '#818cf8',
    colorGradient: 'linear-gradient(135deg, #ffffff 0%, #818cf8 35%, #a855f7 65%, #38bdf8 100%)',
    glowShadow: '0 0 28px rgba(129, 140, 248, 0.6)',
    googleFont: 'Syne:wght@700;800;900',
    description: 'Organic liquid metal typography with morphing molten curvatures, extreme surface tension ligatures, and fluid futuristic character geometry.',
    stylesCount: 5,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Color Molten', weight: 800 },
      { name: 'Vector Flow', weight: 800 }
    ],
    sampleText: 'MOLTEN LIQUID MERCURY & ORGANIC FLUIDITY',
    tags: ['Molten', 'Fluid', 'Liquid Metal', 'Avant-Garde', 'DRM Protected'],
    glyphCount: 610,
    languages: ['Latin Extended'],
    features: ['Molten Ligatures', 'Liquid Terminals', 'Fluid Contour Vectors'],
    prices: { personal: 45, commercial: 89, extended: 220, enterprise: 699 },
    creditPrice: 890,
    badge: 'MOLTEN DRM',
    trending: true,
    featured: true,
    rating: 4.97,
    reviewsCount: 82,
    downloads: 9400,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-molten-chrome-specimen.png',
    watermarkImage: '/specimens/abdullah-molten-chrome-watermark.png'
  },
  {
    id: 'abdullah-moon-chrome',
    name: 'Abdullah Moon Chrome',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'display',
    fontFamily: "'Abdullah Moon Chrome', sans-serif",
    colorFamily: "'Abdullah Moon Chrome', sans-serif",
    accentColor: '#c084fc',
    colorGradient: 'linear-gradient(135deg, #ffffff 0%, #c084fc 30%, #38bdf8 65%, #f43f5e 100%)',
    glowShadow: '0 0 30px rgba(192, 132, 252, 0.65)',
    googleFont: 'Syne:wght@700;800;900',
    description: 'Futuristic iridescent chrome titling typeface with fluid liquid metal curvatures, deep lunar bevels, and high-impact cyber-luxe aesthetics. Available in Regular, SemiBold, Bold, Color, and Vector master layers.',
    stylesCount: 5,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Color Edition', weight: 800 },
      { name: 'Vector Cut', weight: 800 }
    ],
    sampleText: 'LIQUID LUNAR REFLECTION // CHROMATIC VELOCITY',
    tags: ['Chrome', '3D Display', 'Futurism', 'Metallic', 'DRM Protected'],
    glyphCount: 620,
    languages: ['Latin Extended', 'Cyberpunk Diacritics'],
    features: ['Chrome Terminals', 'Liquid Ligatures', 'High-Contrast Bevels'],
    prices: { personal: 45, commercial: 89, extended: 220, enterprise: 699 },
    creditPrice: 890,
    badge: 'LUNAR CHROME',
    trending: true,
    featured: true,
    rating: 4.98,
    reviewsCount: 76,
    downloads: 9800,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-moon-chrome-specimen.png',
    watermarkImage: '/specimens/abdullah-moon-chrome-watermark.png'
  },
  {
    id: 'abdullah-stone-chrome',
    name: 'Abdullah Stone Chrome',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'display',
    fontFamily: "'Abdullah Stone Chrome', sans-serif",
    colorFamily: "'Abdullah Stone Chrome', sans-serif",
    accentColor: '#38bdf8',
    colorGradient: 'linear-gradient(180deg, #ffffff 0%, #38bdf8 35%, #818cf8 60%, #c084fc 100%)',
    glowShadow: '0 0 25px rgba(56, 189, 248, 0.55)',
    googleFont: 'Unbounded:wght@600;700;800;900',
    description: 'Heavyweight monolith display typeface blending ancient petroglyphic stone geometry with hyper-polished titanium chrome edges. Engineered for monumental branding, album art, and luxury physical packaging.',
    stylesCount: 5,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Color Layer', weight: 800 },
      { name: 'Vector Mesh', weight: 800 }
    ],
    sampleText: 'PETROGLYPHIC STONE MEETS TITANIUM CHROME',
    tags: ['Monolith', 'Titanium', 'Brutalist', 'Heavyweight', 'DRM Protected'],
    glyphCount: 590,
    languages: ['Latin Extended'],
    features: ['Heavy Terminals', 'Stone Inscriptions', 'Brutalist Geometry'],
    prices: { personal: 42, commercial: 85, extended: 210, enterprise: 650 },
    creditPrice: 850,
    badge: 'TITANIUM DRM',
    trending: false,
    featured: true,
    rating: 4.96,
    reviewsCount: 54,
    downloads: 7900,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-stone-chrome-specimen.png',
    watermarkImage: '/specimens/abdullah-stone-chrome-watermark.png'
  },
  {
    id: 'abdullah-stone-moon',
    name: 'Abdullah Stone Moon',
    designer: 'Abdullah Foundry Lab',
    foundry: 'Alphaxen Exclusive',
    category: 'luxury',
    fontFamily: "'Abdullah Stone Moon', serif",
    colorFamily: "'Abdullah Stone Moon', serif",
    accentColor: '#818cf8',
    colorGradient: 'linear-gradient(135deg, #ffffff 0%, #c084fc 30%, #818cf8 60%, #38bdf8 100%)',
    glowShadow: '0 0 28px rgba(129, 140, 248, 0.6)',
    googleFont: 'Cinzel:wght@600;700;900',
    description: 'Celestial architectural display font inspired by lunar eclipses and ancient stone megaliths. Distinctive flared apexes and sharp planetary angles create an imposing, transcendent typographic hierarchy.',
    stylesCount: 5,
    styles: [
      { name: 'Regular', weight: 400 },
      { name: 'SemiBold', weight: 600 },
      { name: 'Bold', weight: 700 },
      { name: 'Color Lunar', weight: 800 },
      { name: 'Vector Master', weight: 800 }
    ],
    sampleText: 'CELESTIAL MEGALITHS & ASTRAL GEOMETRY',
    tags: ['Astral', 'Megalith', 'Serif Display', 'DRM Protected'],
    glyphCount: 640,
    languages: ['Latin Extended', 'Greek'],
    features: ['Astral Terminals', 'Celestial Ligatures', 'Roman Serifs'],
    prices: { personal: 45, commercial: 89, extended: 220, enterprise: 699 },
    creditPrice: 890,
    badge: 'ASTRAL DRM',
    trending: true,
    featured: true,
    rating: 4.97,
    reviewsCount: 62,
    downloads: 8400,
    releaseYear: 2026,
    specimenImage: '/specimens/abdullah-stone-moon-specimen.png',
    watermarkImage: '/specimens/abdullah-stone-moon-watermark.png'
  }
];

export interface PurchasedFontLicense {
  licenseKey: string;
  fontId: string;
  fontName: string;
  tier: 'Personal' | 'Commercial' | 'Extended' | 'Enterprise';
  purchaseDate: string;
  registeredTo: string;
  allowedDomains: string[];
  maxPageviews: string;
  pricePaid: number;
  status: 'active' | 'revoked';
  downloadFormats: string[];
}

export interface SellerFontSubmission {
  id: string;
  fontName: string;
  category: string;
  stylesCount: number;
  designerName: string;
  description: string;
  commercialPrice: number;
  personalPrice: number;
  fileUrl?: string;
  submissionDate: string;
  status: 'active' | 'in_review' | 'paused';
  salesCount: number;
  grossRevenue: number;
}
