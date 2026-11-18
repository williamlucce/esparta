import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export interface FloorPlan {
  name: string;
  area: string;
  suites: string;
  image: string;
}

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('client'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  transactionType: text('transaction_type').notNull(), // 'venda' | 'aluguel'
  propertyType: text('property_type').notNull(), // 'Casa' | 'Apartamento' | 'Cobertura' | 'Condomínio' | 'Comercial'
  price: integer('price').notNull(),
  condoFee: integer('condo_fee').notNull().default(0),
  iptu: integer('iptu').notNull().default(0),
  city: text('city').notNull(),
  neighborhood: text('neighborhood').notNull(),
  address: text('address').notNull(),
  latitude: text('latitude').notNull().default('-23.5649'),
  longitude: text('longitude').notNull().default('-46.6689'),
  areaSqm: integer('area_sqm').notNull(),
  bedrooms: integer('bedrooms').notNull().default(0),
  suites: integer('suites').notNull().default(0),
  bathrooms: integer('bathrooms').notNull().default(0),
  parkingSpots: integer('parking_spots').notNull().default(0),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  featured: boolean('featured').notNull().default(false),
  mostSearched: boolean('most_searched').notNull().default(false),
  exclusive: boolean('exclusive').notNull().default(false),
  status: text('status').notNull().default('ativo'),
  viewsCount: integer('views_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const launches = pgTable('launches', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  developer: text('developer').notNull(),
  city: text('city').notNull(),
  neighborhood: text('neighborhood').notNull(),
  address: text('address').notNull(),
  startingPrice: integer('starting_price').notNull(),
  deliveryForecast: text('delivery_forecast').notNull(),
  areaRange: text('area_range').notNull(),
  suitesRange: text('suites_range').notNull(),
  parkingRange: text('parking_range').notNull(),
  differentials: jsonb('differentials').$type<string[]>().notNull().default([]),
  images: jsonb('images').$type<string[]>().notNull().default([]),
  floorPlans: jsonb('floor_plans').$type<FloorPlan[]>().notNull().default([]),
  status: text('status').notNull().default('em_obras'),
  featured: boolean('featured').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  propertyId: integer('property_id')
    .references(() => properties.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  interestType: text('interest_type').notNull().default('imovel'),
  propertyId: integer('property_id').references(() => properties.id, {
    onDelete: 'set null',
  }),
  launchId: integer('launch_id').references(() => launches.id, {
    onDelete: 'set null',
  }),
  preferredDate: text('preferred_date'),
  status: text('status').notNull().default('novo'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('nao_lida'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientRole: text('client_role').notNull(),
  quote: text('quote').notNull(),
  outcome: text('outcome').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  whatsapp: text('whatsapp').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  businessHours: text('business_hours').notNull(),
  instagramUrl: text('instagram_url').notNull(),
  facebookUrl: text('facebook_url').notNull().default('https://facebook.com/espartaimobiliaria'),
  linkedinUrl: text('linkedin_url').notNull(),
  youtubeUrl: text('youtube_url').notNull(),
  creci: text('creci').notNull(),
  totalVisits: integer('total_visits').notNull().default(1420),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
}));

export const propertiesRelations = relations(properties, ({ many }) => ({
  favorites: many(favorites),
  leads: many(leads),
}));

export const launchesRelations = relations(launches, ({ many }) => ({
  leads: many(leads),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
  launch: one(launches, {
    fields: [leads.launchId],
    references: [launches.id],
  }),
}));
