export type TransactionType = 'venda' | 'aluguel';
export type SortOption = 'recentes' | 'menor_preco' | 'maior_preco';

export interface PropertyFilterable {
  id: number;
  title: string;
  description: string;
  transactionType: string;
  propertyType: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaSqm: number;
  status?: string;
  createdAt?: string | Date | null;
}

export interface PropertyFilters {
  q?: string;
  transactionType?: string;
  propertyType?: string;
  city?: string;
  neighborhood?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minBedrooms?: number | null;
  minParking?: number | null;
  sort?: SortOption | string;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filterAndSortProperties<T extends PropertyFilterable>(
  items: T[],
  filters: PropertyFilters
): T[] {
  const query = filters.q ? normalizeText(filters.q) : '';
  const tx = filters.transactionType ? normalizeText(filters.transactionType) : '';
  const propType = filters.propertyType ? normalizeText(filters.propertyType) : '';
  const city = filters.city ? normalizeText(filters.city) : '';
  const neighborhood = filters.neighborhood
    ? normalizeText(filters.neighborhood)
    : '';

  const filtered = items.filter((item) => {
    if (item.status && item.status !== 'ativo') {
      return false;
    }
    if (tx && tx !== 'todos' && normalizeText(item.transactionType) !== tx) {
      return false;
    }
    if (
      propType &&
      propType !== 'todos' &&
      normalizeText(item.propertyType) !== propType
    ) {
      return false;
    }
    if (city && city !== 'todas' && normalizeText(item.city) !== city) {
      return false;
    }
    if (
      neighborhood &&
      neighborhood !== 'todos' &&
      !normalizeText(item.neighborhood).includes(neighborhood)
    ) {
      return false;
    }
    if (
      filters.minPrice !== undefined &&
      filters.minPrice !== null &&
      filters.minPrice > 0 &&
      item.price < filters.minPrice
    ) {
      return false;
    }
    if (
      filters.maxPrice !== undefined &&
      filters.maxPrice !== null &&
      filters.maxPrice > 0 &&
      item.price > filters.maxPrice
    ) {
      return false;
    }
    if (
      filters.minBedrooms !== undefined &&
      filters.minBedrooms !== null &&
      filters.minBedrooms > 0 &&
      item.bedrooms < filters.minBedrooms
    ) {
      return false;
    }
    if (
      filters.minParking !== undefined &&
      filters.minParking !== null &&
      filters.minParking > 0 &&
      item.parkingSpots < filters.minParking
    ) {
      return false;
    }
    if (query) {
      const haystack = normalizeText(
        `${item.title} ${item.description} ${item.city} ${item.neighborhood} ${item.propertyType}`
      );
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  if (filters.sort === 'menor_preco') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'maior_preco') {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
      return dateB - dateA;
    });
  }

  return sorted;
}

export function getSimilarProperties<T extends PropertyFilterable>(
  current: T,
  all: T[],
  limit = 3
): T[] {
  return all
    .filter((item) => item.id !== current.id && (!item.status || item.status === 'ativo'))
    .map((item) => {
      let score = 0;
      if (item.transactionType === current.transactionType) score += 3;
      if (item.propertyType === current.propertyType) score += 2;
      if (item.city === current.city) score += 2;
      if (item.neighborhood === current.neighborhood) score += 2;
      const priceDiff = Math.abs(item.price - current.price);
      if (current.price > 0 && priceDiff / current.price < 0.35) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  const digits = phoneRaw.replace(/\D/g, '');
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadPayload(payload: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = 'Informe seu nome completo.';
  }
  if (!payload.email || !EMAIL_REGEX.test(payload.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }
  const phoneDigits = (payload.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.phone = 'Informe um WhatsApp ou telefone com DDD.';
  }
  if (!payload.message || payload.message.trim().length < 5) {
    errors.message = 'Escreva uma breve mensagem para o consultor.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateContactPayload(payload: {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}): ValidationResult {
  const base = validateLeadPayload(payload);
  const errors = { ...base.errors };
  if (!payload.subject || payload.subject.trim().length < 3) {
    errors.subject = 'Informe o assunto do contato.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
