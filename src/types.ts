export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  transactionType: 'venda' | 'aluguel' | string;
  propertyType: string;
  price: number;
  condoFee: number;
  iptu: number;
  city: string;
  neighborhood: string;
  address: string;
  latitude: string;
  longitude: string;
  areaSqm: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  features: string[];
  images: string[];
  featured: boolean;
  mostSearched: boolean;
  exclusive: boolean;
  status: string;
  viewsCount: number;
  createdAt?: string;
}

export interface FloorPlan {
  name: string;
  area: string;
  suites: string;
  image: string;
}

export interface Launch {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  developer: string;
  city: string;
  neighborhood: string;
  address: string;
  startingPrice: number;
  deliveryForecast: string;
  areaRange: string;
  suitesRange: string;
  parkingRange: string;
  differentials: string[];
  images: string[];
  floorPlans: FloorPlan[];
  status: string;
  featured: boolean;
  createdAt?: string;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  quote: string;
  outcome: string;
  active: boolean;
  createdAt?: string;
}

export interface SiteSettings {
  id: number;
  key: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  creci: string;
  totalVisits: number;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  interestType: string;
  propertyId: number | null;
  launchId: number | null;
  preferredDate: string | null;
  status: string;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'client';
}
