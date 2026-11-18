import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildWhatsAppUrl,
  filterAndSortProperties,
  formatBRL,
  getSimilarProperties,
  slugify,
  validateContactPayload,
  validateLeadPayload,
} from './real-estate';

const sampleProperties = [
  {
    id: 1,
    title: 'Residência Jardins Contemporânea',
    description: 'Casa de alto padrão com piscina aquecida e jardim privativo.',
    transactionType: 'venda',
    propertyType: 'Casa',
    price: 4800000,
    city: 'São Paulo',
    neighborhood: 'Jardins',
    bedrooms: 4,
    bathrooms: 6,
    parkingSpots: 4,
    areaSqm: 520,
    status: 'ativo',
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 2,
    title: 'Cobertura Duplex Itaim Bibi',
    description: 'Vista panorâmica e terraço gourmet completo.',
    transactionType: 'venda',
    propertyType: 'Cobertura',
    price: 7200000,
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    bedrooms: 4,
    bathrooms: 5,
    parkingSpots: 4,
    areaSqm: 410,
    status: 'ativo',
    createdAt: '2026-11-01T12:00:00Z',
  },
  {
    id: 3,
    title: 'Apartamento Vila Nova Conceição',
    description: 'Mobiliado próximo ao Parque Ibirapuera.',
    transactionType: 'aluguel',
    propertyType: 'Apartamento',
    price: 22000,
    city: 'São Paulo',
    neighborhood: 'Vila Nova Conceição',
    bedrooms: 3,
    bathrooms: 4,
    parkingSpots: 3,
    areaSqm: 210,
    status: 'ativo',
    createdAt: '2026-11-05T12:00:00Z',
  },
];

test('slugify normalizes Portuguese diacritics cleanly', () => {
  assert.equal(slugify('Mansão São Paulo – Jardins!'), 'mansao-sao-paulo-jardins');
});

test('formatBRL formats currency without decimals', () => {
  const formatted = formatBRL(4800000);
  assert.match(formatted, /4\.800\.000/);
});

test('filterAndSortProperties filters by transaction, price, bedrooms, and query', () => {
  const sale = filterAndSortProperties(sampleProperties, {
    transactionType: 'venda',
    sort: 'menor_preco',
  });
  assert.equal(sale.length, 2);
  assert.equal(sale[0].id, 1);

  const highPrice = filterAndSortProperties(sampleProperties, {
    transactionType: 'venda',
    sort: 'maior_preco',
  });
  assert.equal(highPrice[0].id, 2);

  const searchIbirapuera = filterAndSortProperties(sampleProperties, {
    q: 'ibirapuera',
  });
  assert.equal(searchIbirapuera.length, 1);
  assert.equal(searchIbirapuera[0].id, 3);
});

test('getSimilarProperties prioritizes matching transaction type and excludes self', () => {
  const similar = getSimilarProperties(sampleProperties[0], sampleProperties, 2);
  assert.equal(similar.length, 2);
  assert.equal(similar[0].id, 2);
  assert.ok(!similar.some((p) => p.id === 1));
});

test('buildWhatsAppUrl formats Brazilian number with country code and encoded message', () => {
  const url = buildWhatsAppUrl('(11) 99988-7766', 'Olá Esparta!');
  assert.equal(url, 'https://wa.me/5511999887766?text=Ol%C3%A1%20Esparta!');
});

test('validateLeadPayload and validateContactPayload reject invalid fields and accept valid ones', () => {
  const invalid = validateLeadPayload({
    name: 'A',
    email: 'invalid',
    phone: '123',
    message: 'Oi',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);

  const valid = validateContactPayload({
    name: 'Mariana Costa',
    email: 'mariana@empresa.com.br',
    phone: '11999998888',
    subject: 'Agendar visita',
    message: 'Gostaria de agendar uma visita nesta semana.',
  });
  assert.equal(valid.valid, true);
});
