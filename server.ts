import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import {
  createContactMessage,
  createLead,
  ensureSeeded,
  generateUniqueLaunchSlug,
  generateUniquePropertySlug,
  getAdminOverview,
  getPropertyBySlugAndTrackView,
  getPublicBootstrap,
  getUserFavoriteIds,
  toggleUserFavorite,
} from './src/db/repository.ts';
import {
  launches,
  leads,
  messages,
  properties,
  siteSettings,
  testimonials,
} from './src/db/schema.ts';
import { createLocalUser, getUserByEmail } from './src/db/users.ts';
import {
  hashPassword,
  signSessionToken,
  verifyPassword,
} from './src/lib/auth-crypto.ts';
import {
  filterAndSortProperties,
  getSimilarProperties,
  validateContactPayload,
  validateLeadPayload,
} from './src/lib/real-estate.ts';
import {
  AuthRequest,
  requireAdmin,
  requireAuth,
} from './src/middleware/auth.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

app.use(express.json({ limit: '15mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Public bootstrap (properties, launches, testimonials, settings)
app.get('/api/bootstrap', async (req, res) => {
  try {
    const trackVisit = req.query.visit === '1';
    const data = await getPublicBootstrap(trackVisit);
    res.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno.';
    res.status(500).json({ error: msg });
  }
});

// Public filtered properties endpoint
app.get('/api/properties', async (req, res) => {
  try {
    const { properties: allProperties } = await getPublicBootstrap(false);
    const filtered = filterAndSortProperties(allProperties, {
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      transactionType:
        typeof req.query.transactionType === 'string'
          ? req.query.transactionType
          : undefined,
      propertyType:
        typeof req.query.propertyType === 'string'
          ? req.query.propertyType
          : undefined,
      city: typeof req.query.city === 'string' ? req.query.city : undefined,
      neighborhood:
        typeof req.query.neighborhood === 'string'
          ? req.query.neighborhood
          : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
      minBedrooms: req.query.minBedrooms ? Number(req.query.minBedrooms) : null,
      minParking: req.query.minParking ? Number(req.query.minParking) : null,
      sort: typeof req.query.sort === 'string' ? req.query.sort : 'recentes',
    });
    res.json(filtered);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno.';
    res.status(500).json({ error: msg });
  }
});

// Single property by slug + similar suggestions
app.get('/api/properties/:slug', async (req, res) => {
  try {
    const property = await getPropertyBySlugAndTrackView(req.params.slug);
    if (!property) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }
    const { properties: allProperties } = await getPublicBootstrap(false);
    const similar = getSimilarProperties(property, allProperties, 3);
    res.json({ property, similar });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno.';
    res.status(500).json({ error: msg });
  }
});

// Public launches
app.get('/api/launches', async (_req, res) => {
  try {
    const { launches: allLaunches } = await getPublicBootstrap(false);
    res.json(allLaunches);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro interno.';
    res.status(500).json({ error: msg });
  }
});

// Create Lead (property interest, launch info, visit scheduling)
app.post('/api/leads', async (req, res) => {
  try {
    await ensureSeeded();
    const {
      name,
      email,
      phone,
      message,
      interestType,
      propertyId,
      launchId,
      preferredDate,
    } = req.body || {};

    const validation = validateLeadPayload({ name, email, phone, message });
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Verifique os campos obrigatórios.',
        errors: validation.errors,
      });
    }

    const created = await createLead({
      name,
      email,
      phone,
      message,
      interestType: interestType || 'imovel',
      propertyId: propertyId ? Number(propertyId) : null,
      launchId: launchId ? Number(launchId) : null,
      preferredDate: preferredDate || null,
    });

    res.status(201).json(created);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao registrar contato.';
    res.status(500).json({ error: msg });
  }
});

// Create Contact Message
app.post('/api/messages', async (req, res) => {
  try {
    await ensureSeeded();
    const { name, email, phone, subject, message } = req.body || {};
    const validation = validateContactPayload({
      name,
      email,
      phone,
      subject,
      message,
    });
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Verifique os campos do formulário.',
        errors: validation.errors,
      });
    }

    const created = await createContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json(created);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao enviar mensagem.';
    res.status(500).json({ error: msg });
  }
});

// Client Registration (Email + Password)
app.post('/api/auth/register', async (req, res) => {
  try {
    await ensureSeeded();
    const { name, email, phone, password } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: 'Informe seu nome completo.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Informe um e-mail válido.' });
    }
    if (!password || String(password).length < 6) {
      return res
        .status(400)
        .json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existing = await getUserByEmail(String(email));
    if (existing) {
      return res
        .status(409)
        .json({ error: 'Já existe uma conta cadastrada com este e-mail.' });
    }

    const user = await createLocalUser({
      uid: `client_${crypto.randomUUID()}`,
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      passwordHash: hashPassword(String(password)),
      role: 'client',
    });

    const token = signSessionToken({
      userId: user.id,
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: 'client',
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao criar conta.';
    res.status(500).json({ error: msg });
  }
});

// Login (Email + Password for both Clients & Admin)
app.post('/api/auth/login', async (req, res) => {
  try {
    await ensureSeeded();
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    const user = await getUserByEmail(String(email));
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const valid = verifyPassword(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const role = user.role === 'admin' ? 'admin' : 'client';
    const token = signSessionToken({
      userId: user.id,
      uid: user.uid,
      email: user.email,
      name: user.name,
      role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao autenticar.';
    res.status(500).json({ error: msg });
  }
});

// Sync Firebase Auth user profile
app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const favoriteIds = await getUserFavoriteIds(req.authUser!.id);
    res.json({
      user: req.authUser,
      favoriteIds,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao carregar perfil.';
    res.status(500).json({ error: msg });
  }
});

// Favorites for authenticated users
app.get('/api/favorites', requireAuth, async (req: AuthRequest, res) => {
  try {
    const favoriteIds = await getUserFavoriteIds(req.authUser!.id);
    res.json({ favoriteIds });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao carregar favoritos.';
    res.status(500).json({ error: msg });
  }
});

app.post('/api/favorites/toggle', requireAuth, async (req: AuthRequest, res) => {
  try {
    const propertyId = Number(req.body?.propertyId);
    if (!propertyId) {
      return res.status(400).json({ error: 'Imóvel inválido.' });
    }
    const isFavorite = await toggleUserFavorite(req.authUser!.id, propertyId);
    const favoriteIds = await getUserFavoriteIds(req.authUser!.id);
    res.json({ isFavorite, favoriteIds });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar favorito.';
    res.status(500).json({ error: msg });
  }
});

// ========================
// ADMIN ROUTES (requireAdmin)
// ========================

app.get('/api/admin/overview', requireAdmin, async (_req, res) => {
  try {
    const data = await getAdminOverview();
    res.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao carregar painel.';
    res.status(500).json({ error: msg });
  }
});

// Upload base64 image file to local /uploads storage
app.post('/api/admin/upload', requireAdmin, async (req, res) => {
  try {
    const { filename, dataUrl } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'Arquivo de imagem inválido.' });
    }
    const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
    if (!match) {
      return res
        .status(400)
        .json({ error: 'Formato suportado: PNG, JPG ou WEBP.' });
    }

    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const safeName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    res.status(201).json({
      url: `/uploads/${safeName}`,
      originalName: filename || safeName,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro no upload de imagem.';
    res.status(500).json({ error: msg });
  }
});

// Admin Properties CRUD
app.post('/api/admin/properties', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title || !body.price || !body.city || !body.neighborhood) {
      return res
        .status(400)
        .json({ error: 'Título, preço, cidade e bairro são obrigatórios.' });
    }
    const slug = await generateUniquePropertySlug(String(body.title));
    const inserted = await db
      .insert(properties)
      .values({
        slug,
        title: String(body.title).trim(),
        description: String(body.description || '').trim(),
        transactionType:
          body.transactionType === 'aluguel' ? 'aluguel' : 'venda',
        propertyType: String(body.propertyType || 'Apartamento'),
        price: Number(body.price),
        condoFee: Number(body.condoFee || 0),
        iptu: Number(body.iptu || 0),
        city: String(body.city).trim(),
        neighborhood: String(body.neighborhood).trim(),
        address: String(body.address || `${body.neighborhood}, ${body.city}`).trim(),
        latitude: String(body.latitude || '-23.5649'),
        longitude: String(body.longitude || '-46.6689'),
        areaSqm: Number(body.areaSqm || 100),
        bedrooms: Number(body.bedrooms || 0),
        suites: Number(body.suites || 0),
        bathrooms: Number(body.bathrooms || 0),
        parkingSpots: Number(body.parkingSpots || 0),
        features: Array.isArray(body.features) ? body.features : [],
        images:
          Array.isArray(body.images) && body.images.length > 0
            ? body.images
            : ['/src/assets/images/prop_penthouse_living_1794686197879.jpg'],
        featured: Boolean(body.featured),
        mostSearched: Boolean(body.mostSearched),
        exclusive: Boolean(body.exclusive),
        status: String(body.status || 'ativo'),
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao cadastrar imóvel.';
    res.status(500).json({ error: msg });
  }
});

app.put('/api/admin/properties/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body || {};
    const updated = await db
      .update(properties)
      .set({
        title: String(body.title).trim(),
        description: String(body.description || '').trim(),
        transactionType:
          body.transactionType === 'aluguel' ? 'aluguel' : 'venda',
        propertyType: String(body.propertyType || 'Apartamento'),
        price: Number(body.price),
        condoFee: Number(body.condoFee || 0),
        iptu: Number(body.iptu || 0),
        city: String(body.city).trim(),
        neighborhood: String(body.neighborhood).trim(),
        address: String(body.address || '').trim(),
        areaSqm: Number(body.areaSqm || 100),
        bedrooms: Number(body.bedrooms || 0),
        suites: Number(body.suites || 0),
        bathrooms: Number(body.bathrooms || 0),
        parkingSpots: Number(body.parkingSpots || 0),
        features: Array.isArray(body.features) ? body.features : [],
        images: Array.isArray(body.images) ? body.images : [],
        featured: Boolean(body.featured),
        mostSearched: Boolean(body.mostSearched),
        exclusive: Boolean(body.exclusive),
        status: String(body.status || 'ativo'),
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Imóvel não encontrado.' });
    }
    res.json(updated[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar imóvel.';
    res.status(500).json({ error: msg });
  }
});

app.delete('/api/admin/properties/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(properties).where(eq(properties.id, id));
    res.json({ deleted: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir imóvel.';
    res.status(500).json({ error: msg });
  }
});

// Admin Launches CRUD
app.post('/api/admin/launches', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title || !body.developer || !body.startingPrice) {
      return res.status(400).json({
        error: 'Nome, construtora e valor inicial são obrigatórios.',
      });
    }
    const slug = await generateUniqueLaunchSlug(String(body.title));
    const inserted = await db
      .insert(launches)
      .values({
        slug,
        title: String(body.title).trim(),
        subtitle: String(body.subtitle || '').trim(),
        description: String(body.description || '').trim(),
        developer: String(body.developer).trim(),
        city: String(body.city || 'São Paulo').trim(),
        neighborhood: String(body.neighborhood || 'Jardins').trim(),
        address: String(body.address || '').trim(),
        startingPrice: Number(body.startingPrice),
        deliveryForecast: String(body.deliveryForecast || '2027').trim(),
        areaRange: String(body.areaRange || '150m² a 300m²').trim(),
        suitesRange: String(body.suitesRange || '3 a 4 suítes').trim(),
        parkingRange: String(body.parkingRange || '2 a 4 vagas').trim(),
        differentials: Array.isArray(body.differentials) ? body.differentials : [],
        images:
          Array.isArray(body.images) && body.images.length > 0
            ? body.images
            : ['/src/assets/images/launch_horizon_tower_1794686200386.jpg'],
        floorPlans: Array.isArray(body.floorPlans)
          ? body.floorPlans
          : [
              {
                name: 'Planta Padrão',
                area: String(body.areaRange || '180m²'),
                suites: String(body.suitesRange || '3 suítes'),
                image:
                  '/src/assets/images/launch_floorplan_blueprint_1794686201081.jpg',
              },
            ],
        status: String(body.status || 'lancamento'),
        featured: Boolean(body.featured ?? true),
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao criar lançamento.';
    res.status(500).json({ error: msg });
  }
});

app.delete('/api/admin/launches/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(launches).where(eq(launches.id, id));
    res.json({ deleted: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir lançamento.';
    res.status(500).json({ error: msg });
  }
});

// Admin Leads Management
app.patch('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body?.status || 'em_atendimento');
    const updated = await db
      .update(leads)
      .set({ status })
      .where(eq(leads.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar lead.';
    res.status(500).json({ error: msg });
  }
});

app.delete('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(leads).where(eq(leads.id, id));
    res.json({ deleted: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao excluir lead.';
    res.status(500).json({ error: msg });
  }
});

// Admin Messages Management
app.patch('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body?.status || 'lida');
    const updated = await db
      .update(messages)
      .set({ status })
      .where(eq(messages.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao atualizar mensagem.';
    res.status(500).json({ error: msg });
  }
});

// Admin Testimonials Management
app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
  try {
    const { clientName, clientRole, quote, outcome, active } = req.body || {};
    if (!clientName || !quote) {
      return res
        .status(400)
        .json({ error: 'Nome do cliente e depoimento são obrigatórios.' });
    }
    const inserted = await db
      .insert(testimonials)
      .values({
        clientName: String(clientName).trim(),
        clientRole: String(clientRole || 'Cliente Esparta').trim(),
        quote: String(quote).trim(),
        outcome: String(outcome || 'Negócio concluído com sucesso').trim(),
        active: active !== false,
      })
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao salvar depoimento.';
    res.status(500).json({ error: msg });
  }
});

app.patch('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await db
      .update(testimonials)
      .set({ active: Boolean(req.body?.active) })
      .where(eq(testimonials.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Erro ao atualizar depoimento.';
    res.status(500).json({ error: msg });
  }
});

app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(testimonials).where(eq(testimonials.id, id));
    res.json({ deleted: true });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Erro ao excluir depoimento.';
    res.status(500).json({ error: msg });
  }
});

// Admin Site Contact Settings
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const body = req.body || {};
    const updated = await db
      .update(siteSettings)
      .set({
        whatsapp: String(body.whatsapp || '').trim(),
        phone: String(body.phone || '').trim(),
        email: String(body.email || '').trim(),
        address: String(body.address || '').trim(),
        businessHours: String(body.businessHours || '').trim(),
        instagramUrl: String(body.instagramUrl || '').trim(),
        facebookUrl: String(body.facebookUrl || '').trim(),
        linkedinUrl: String(body.linkedinUrl || '').trim(),
        youtubeUrl: String(body.youtubeUrl || '').trim(),
        creci: String(body.creci || '').trim(),
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.key, 'default'))
      .returning();
    res.json(updated[0]);
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : 'Erro ao atualizar configurações.';
    res.status(500).json({ error: msg });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Esparta Imobiliária server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
