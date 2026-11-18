import { and, desc, eq, sql } from 'drizzle-orm';
import { hashPassword } from '../lib/auth-crypto.ts';
import { slugify } from '../lib/real-estate.ts';
import { db } from './index.ts';
import {
  favorites,
  launches,
  leads,
  messages,
  properties,
  siteSettings,
  testimonials,
  users,
} from './schema.ts';

let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function runSeed(): Promise<void> {
  try {
    // 1. Seed default admin user if absent
    const existingAdmin = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, 'admin@espartaimobiliaria.com.br'))
      .limit(1);

    if (existingAdmin.length === 0) {
      await db
        .insert(users)
        .values({
          uid: 'admin-esparta-master',
          name: 'Diretoria Esparta',
          email: 'admin@espartaimobiliaria.com.br',
          phone: '(11) 99842-7700',
          passwordHash: hashPassword('Esparta@2026'),
          role: 'admin',
        })
        .onConflictDoNothing();
    }

    // 2. Seed site settings
    const existingSettings = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .where(eq(siteSettings.key, 'default'))
      .limit(1);

    if (existingSettings.length === 0) {
      await db
        .insert(siteSettings)
        .values({
          key: 'default',
          whatsapp: '5586981331132',
          phone: '(86) 98133-1132',
          email: 'marcelodeassisveras@gmail.com',
          address: 'ESPARTA IMOB, EDIF HOTEL EXPRESS ARREY - Av. João XXIII, 3800 - SALA 9 - Recanto das Palmeiras, Teresina - PI, 64045-795',
          businessHours: 'Seg a Sex: 07h às 19h · Sáb: 07h às 14h',
          instagramUrl: 'https://www.instagram.com/esparta_imob/',
          facebookUrl: 'https://www.facebook.com/p/Esparta-imob-61565846159585/',
          linkedinUrl: 'https://linkedin.com/company/espartaimobiliaria',
          youtubeUrl: 'https://youtube.com/@espartaimobiliaria',
          creci: 'CRECI 0727/PJ',
          totalVisits: 3840,
        })
        .onConflictDoNothing();
    }

    // 3. Seed properties if table empty
    const existingProps = await db.select({ id: properties.id }).from(properties).limit(1);
    if (existingProps.length === 0) {
      await db.insert(properties).values([
        {
          slug: 'parque-ville-village-parque-ville-zona-norte',
          title: 'Parque Ville / Village Parque Ville',
          description:
            'Empreendimento residencial planejado na Zona Norte de Teresina, unindo infraestrutura completa de condomínio, ruas pavimentadas, área de lazer para toda a família e condições facilitadas de financiamento pelo programa Minha Casa Minha Vida.',
          transactionType: 'venda',
          propertyType: 'Condomínio',
          price: 238000,
          condoFee: 240,
          iptu: 420,
          city: 'Teresina',
          neighborhood: 'Zona Norte',
          address: 'Região Parque Ville / Village Parque Ville — Zona Norte, Teresina/PI',
          latitude: '-5.0124',
          longitude: '-42.8152',
          areaSqm: 58,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 1,
          features: [
            'Portaria e segurança 24 horas',
            'Área de lazer com piscina e salão de festas',
            'Condições facilitadas Minha Casa Minha Vida',
            'Ruas pavimentadas e iluminação em LED',
            'Fácil acesso ao comércio e serviços da Zona Norte',
          ],
          images: [
            '/src/assets/images/parque_ville_norte_1794702371479.jpg',
            '/src/assets/images/casa_dirceu_clean_1794690147926.jpg',
          ],
          featured: true,
          mostSearched: false,
          exclusive: true,
          status: 'ativo',
          viewsCount: 412,
        },
        {
          slug: 'village-garden-ii-zona-leste-teresina',
          title: 'Village Garden II',
          description:
            'Localizado na valorizada Zona Leste de Teresina, o Village Garden II oferece residências funcionais em condomínio fechado com paisagismo integrado, área gourmet de convivência e acesso rápido a faculdades, supermercados e shoppings.',
          transactionType: 'venda',
          propertyType: 'Condomínio',
          price: 279000,
          condoFee: 280,
          iptu: 510,
          city: 'Teresina',
          neighborhood: 'Zona Leste',
          address: 'Residencial Village Garden II — Zona Leste, Teresina/PI',
          latitude: '-5.0618',
          longitude: '-42.7429',
          areaSqm: 64,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 2,
          features: [
            'Localização estratégica na Zona Leste',
            'Condomínio fechado com controle de acesso',
            'Espaço gourmet, piscina e playground',
            'Acabamento moderno com piso porcelanato',
            'Compatível com financiamento habitacional',
          ],
          images: [
            '/src/assets/images/village_garden_leste_1794702372472.jpg',
            '/src/assets/images/prop_modern_house_facade_1794686198698.jpg',
          ],
          featured: true,
          mostSearched: false,
          exclusive: true,
          status: 'ativo',
          viewsCount: 389,
        },
        {
          slug: 'village-natureza-grande-dirceu-teresina',
          title: 'Village Natureza — Grande Dirceu',
          description:
            'Casas confortáveis no Village Natureza, na região da Zona Sudeste / Grande Dirceu em Teresina. Projeto pensado para proporcionar qualidade de vida, quintal privativo, ventilação natural e documentação pronta para financiamento.',
          transactionType: 'venda',
          propertyType: 'Casa',
          price: 229000,
          condoFee: 190,
          iptu: 380,
          city: 'Teresina',
          neighborhood: 'Zona Sudeste · Grande Dirceu',
          address: 'Residencial Village Natureza — Grande Dirceu, Zona Sudeste, Teresina/PI',
          latitude: '-5.1062',
          longitude: '-42.7351',
          areaSqm: 56,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 1,
          features: [
            'Região consolidada do Grande Dirceu',
            'Próximo a comércios, escolas e serviços',
            'Quintal privativo com possibilidade de ampliação',
            'Áreas verdes e lazer para crianças',
            'Subsídio e facilidades no financiamento',
          ],
          images: [
            '/src/assets/images/casa_dirceu_clean_1794690147926.jpg',
            '/src/assets/images/parque_ville_norte_1794702371479.jpg',
          ],
          featured: true,
          mostSearched: false,
          exclusive: false,
          status: 'ativo',
          viewsCount: 345,
        },
        {
          slug: 'manuel-ayres-vamos-ver-o-sol-zona-sul-teresina',
          title: 'Manuel Ayres / Vamos Ver o Sol',
          description:
            'Excelente oportunidade na Zona Sul de Teresina, na região do conjunto Manuel Ayres e Vamos Ver o Sol. Casas com planta inteligente, dois quartos, vaga de garagem e assessoria completa da Esparta Imob para aprovação de crédito.',
          transactionType: 'venda',
          propertyType: 'Casa',
          price: 208000,
          condoFee: 0,
          iptu: 310,
          city: 'Teresina',
          neighborhood: 'Zona Sul',
          address: 'Região Manuel Ayres / Vamos Ver o Sol — Zona Sul, Teresina/PI',
          latitude: '-5.1642',
          longitude: '-42.7715',
          areaSqm: 54,
          bedrooms: 2,
          suites: 0,
          bathrooms: 1,
          parkingSpots: 1,
          features: [
            'Localização em expansão na Zona Sul de Teresina',
            'Lote amplo com recuo frontal e quintal',
            'Isenção de taxa condominial',
            'Pronta para financiamento bancário e uso do FGTS',
            'Acompanhamento jurídico completo',
          ],
          images: [
            '/src/assets/images/casa_zonasul_clean_1794690148412.jpg',
            '/src/assets/images/casa_dirceu_clean_1794690147926.jpg',
          ],
          featured: false,
          mostSearched: true,
          exclusive: true,
          status: 'ativo',
          viewsCount: 362,
        },
        {
          slug: 'casas-em-altos-piaui',
          title: 'Casas em Altos',
          description:
            'Residências espaçosas em Altos (PI) com varanda ampla, acabamento moderno e fácil acesso à BR-343 rumo a Teresina. Opção ideal para famílias que desejam tranquilidade, conforto e excelente custo-benefício.',
          transactionType: 'venda',
          propertyType: 'Casa',
          price: 219000,
          condoFee: 0,
          iptu: 290,
          city: 'Altos',
          neighborhood: 'Residencial · PI',
          address: 'Bairros residenciais selecionados — Altos/PI',
          latitude: '-5.0394',
          longitude: '-42.4606',
          areaSqm: 68,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 2,
          features: [
            'Terreno amplo e quintal murado',
            'Varanda gourmet coberta',
            'Acesso rápido pela BR-343',
            'Documentação regularizada para financiamento',
            'Avaliação e vistoria técnica inclusas',
          ],
          images: [
            '/src/assets/images/casa_altos_piaui_1794690136551.jpg',
            '/src/assets/images/casa_timon_maranhao_1794702372242.jpg',
          ],
          featured: false,
          mostSearched: true,
          exclusive: false,
          status: 'ativo',
          viewsCount: 284,
        },
        {
          slug: 'casas-em-demerval-lobao-piaui',
          title: 'Casas em Demerval Lobão',
          description:
            'Oportunidades de casas novas e prontas para morar em Demerval Lobão (PI), a poucos quilômetros da capital pela BR-316. Plantas bem distribuídas, acabamento em porcelanato e condições especiais de entrada.',
          transactionType: 'venda',
          propertyType: 'Casa',
          price: 198000,
          condoFee: 0,
          iptu: 250,
          city: 'Demerval Lobão',
          neighborhood: 'Residencial · PI',
          address: 'Loteamentos residenciais — Demerval Lobão/PI',
          latitude: '-5.3578',
          longitude: '-42.6756',
          areaSqm: 62,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 2,
          features: [
            'Imóveis prontos para morar e financiamento imediato',
            'Acabamento em porcelanato e bancadas em granito',
            'Acesso facilitado pela BR-316',
            'Subsídios habitacionais disponíveis',
            'Assessoria completa até a entrega das chaves',
          ],
          images: [
            '/src/assets/images/prop_modern_house_facade_1794686198698.jpg',
            '/src/assets/images/casa_zonasul_clean_1794690148412.jpg',
          ],
          featured: false,
          mostSearched: true,
          exclusive: false,
          status: 'ativo',
          viewsCount: 249,
        },
        {
          slug: 'casas-em-timon-maranhao',
          title: 'Casas em Timon',
          description:
            'Seleção de casas em Timon (MA) com localização estratégica próxima às pontes de ligação com Teresina. Unidades com garagem coberta, sala integrada à cozinha e facilidade de aprovação bancária.',
          transactionType: 'venda',
          propertyType: 'Casa',
          price: 225000,
          condoFee: 0,
          iptu: 340,
          city: 'Timon',
          neighborhood: 'Parque Alvorada · MA',
          address: 'Regiões valorizadas de Timon — Timon/MA',
          latitude: '-5.0956',
          longitude: '-42.8351',
          areaSqm: 66,
          bedrooms: 2,
          suites: 1,
          bathrooms: 2,
          parkingSpots: 2,
          features: [
            'Acesso rápido ao Centro e zonas de Teresina',
            'Garagem coberta e área de serviço individual',
            'Ruas asfaltadas e infraestrutura urbana completa',
            'Uso do FGTS e financiamento habitacional',
            'Atendimento presencial pela equipe Esparta Imob',
          ],
          images: [
            '/src/assets/images/casa_timon_maranhao_1794702372242.jpg',
            '/src/assets/images/casa_altos_piaui_1794690136551.jpg',
          ],
          featured: false,
          mostSearched: true,
          exclusive: true,
          status: 'ativo',
          viewsCount: 318,
        },
      ]);
    }

    // 4. Seed launches if table empty
    const existingLaunches = await db.select({ id: launches.id }).from(launches).limit(1);
    if (existingLaunches.length === 0) {
      await db.insert(launches).values([
        {
          slug: 'esparta-horizon-jardins',
          title: 'Esparta Horizon Jardins',
          subtitle: 'Arquitetura orgânica e terraços suspensos no ponto mais nobre dos Jardins',
          description:
            'Torre única com apenas 28 residências suspensas. Fachada escultural em concreto arquitetônico, paisagismo vertical irrigado automaticamente e rooftop com piscina aquecida e vista 360° de São Paulo.',
          developer: 'Grupo Vanguarda Incorporações',
          city: 'São Paulo',
          neighborhood: 'Jardins',
          address: 'Rua Haddock Lobo, 1520 — Jardins, São Paulo/SP',
          startingPrice: 4650000,
          deliveryForecast: 'Novembro / 2027',
          areaRange: '215m² a 390m²',
          suitesRange: '3 a 4 suítes',
          parkingRange: '3 a 5 vagas',
          differentials: [
            'Rooftop lounge com piscina de borda infinita no 32º andar',
            'Infraestrutura para carregamento de veículos elétricos em todas as vagas',
            'Elevadores sociais privativos com velocidade de 4m/s',
            'Concierge 24h padrão hotelaria internacional',
            'Spa privativo com sauna seca, úmida e sala de massagem',
          ],
          images: [
            '/src/assets/images/launch_horizon_tower_1794686200386.jpg',
            '/src/assets/images/prop_penthouse_living_1794686197879.jpg',
            '/src/assets/images/prop_luxury_apartment_suite_1794686198842.jpg',
          ],
          floorPlans: [
            {
              name: 'Planta Tipo A — 260m² · 4 Suítes',
              area: '260m²',
              suites: '4 suítes',
              image: '/src/assets/images/launch_floorplan_blueprint_1794686201081.jpg',
            },
            {
              name: 'Planta Duplex — 390m² · 4 Suítes + Terraço',
              area: '390m²',
              suites: '4 suítes',
              image: '/src/assets/images/launch_floorplan_blueprint_1794686201081.jpg',
            },
          ],
          status: 'lancamento',
          featured: true,
        },
        {
          slug: 'reserva-itaim-residences',
          title: 'Reserva Itaim Residences',
          subtitle: 'Sofisticação urbana a passos dos melhores restaurantes e escritórios da Faria Lima',
          description:
            'Empreendimento boutique desenvolvido para executivos e famílias que exigem mobilidade sem abrir mão de silêncio acústico e acabamento impecável.',
          developer: 'Construtora Atlântica Prime',
          city: 'São Paulo',
          neighborhood: 'Itaim Bibi',
          address: 'Rua João Cachoeira, 890 — Itaim Bibi, São Paulo/SP',
          startingPrice: 3290000,
          deliveryForecast: 'Junho / 2027',
          areaRange: '155m² a 240m²',
          suitesRange: '3 suítes',
          parkingRange: '2 a 4 vagas',
          differentials: [
            'Esquadrias acústicas de alta performance',
            'Coworking e salas de reunião executivas no térreo',
            'Piscina coberta climatizada com raia de 20m',
            'Adega individual climatizada por unidade',
          ],
          images: [
            '/src/assets/images/prop_penthouse_living_1794686197879.jpg',
            '/src/assets/images/launch_horizon_tower_1794686200386.jpg',
          ],
          floorPlans: [
            {
              name: 'Planta Garden — 240m² · 3 Suítes',
              area: '240m²',
              suites: '3 suítes',
              image: '/src/assets/images/launch_floorplan_blueprint_1794686201081.jpg',
            },
          ],
          status: 'em_obras',
          featured: true,
        },
      ]);
    }

    // 5. Seed testimonials if empty
    const existingTestimonials = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .limit(1);

    if (existingTestimonials.length === 0) {
      await db.insert(testimonials).values([
        {
          clientName: 'Maria das Graças Oliveira',
          clientRole: 'Professora · Zona Sudeste, Teresina',
          quote:
            'Eu achava muito difícil conseguir financiar minha casa própria, mas a equipe da Esparta explicou tudo com calma, simulou minhas parcelas no Minha Casa Minha Vida e hoje moro no meu lar com minha família.',
          outcome: 'Casa própria conquistada no Grande Dirceu',
          active: true,
        },
        {
          clientName: 'José Ribamar Sousa',
          clientRole: 'Comerciante · Parque Ville, Zona Norte',
          quote:
            'Atendimento simples, honesto e sem enrolação. Eles cuidaram de toda a papelada e do meu FGTS desde a primeira visita até o dia em que peguei as chaves no Parque Ville.',
          outcome: 'Financiamento aprovado com uso do FGTS',
          active: true,
        },
        {
          clientName: 'Antônia Ferreira & Carlos Lima',
          clientRole: 'Auxiliar Administrativa · Timon, MA',
          quote:
            'Procurávamos uma casa boa em Timon que coubesse no nosso orçamento. A Esparta mostrou exatamente o que precisávamos e acompanhou cada passo no banco e no cartório.',
          outcome: 'Compra concluída com segurança em Timon',
          active: true,
        },
      ]);
    }
  } catch (error) {
    console.error('Database seed failed:', error);
    throw new Error('Falha ao inicializar dados padrão.', { cause: error });
  }
}

export async function getPublicBootstrap(incrementVisit = false) {
  try {
    await ensureSeeded();

    if (incrementVisit) {
      await db
        .update(siteSettings)
        .set({ totalVisits: sql`${siteSettings.totalVisits} + 1` })
        .where(eq(siteSettings.key, 'default'));
    }

    const [allProperties, allLaunches, allTestimonials, settingsRows] =
      await Promise.all([
        db.select().from(properties).orderBy(desc(properties.createdAt)),
        db.select().from(launches).orderBy(desc(launches.createdAt)),
        db
          .select()
          .from(testimonials)
          .where(eq(testimonials.active, true))
          .orderBy(desc(testimonials.createdAt)),
        db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.key, 'default'))
          .limit(1),
      ]);

    return {
      properties: allProperties,
      launches: allLaunches,
      testimonials: allTestimonials,
      settings: settingsRows[0] || null,
    };
  } catch (error) {
    console.error('Database query failed (getPublicBootstrap):', error);
    throw new Error('Erro ao carregar catálogo de imóveis.', { cause: error });
  }
}

export async function getPropertyBySlugAndTrackView(slug: string) {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);

    const property = rows[0];
    if (!property) return null;

    await db
      .update(properties)
      .set({ viewsCount: sql`${properties.viewsCount} + 1` })
      .where(eq(properties.id, property.id));

    return {
      ...property,
      viewsCount: property.viewsCount + 1,
    };
  } catch (error) {
    console.error('Database query failed (getPropertyBySlug):', error);
    throw new Error('Erro ao carregar detalhes do imóvel.', { cause: error });
  }
}

export async function getUserFavoriteIds(userId: number): Promise<number[]> {
  try {
    const rows = await db
      .select({ propertyId: favorites.propertyId })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    return rows.map((r) => r.propertyId);
  } catch (error) {
    console.error('Database query failed (getUserFavoriteIds):', error);
    throw new Error('Erro ao carregar favoritos.', { cause: error });
  }
}

export async function toggleUserFavorite(
  userId: number,
  propertyId: number
): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId))
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(favorites).where(eq(favorites.id, existing[0].id));
      return false;
    }

    await db.insert(favorites).values({ userId, propertyId });
    return true;
  } catch (error) {
    console.error('Database query failed (toggleUserFavorite):', error);
    throw new Error('Erro ao atualizar favorito.', { cause: error });
  }
}

export async function createLead(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  interestType: string;
  propertyId?: number | null;
  launchId?: number | null;
  preferredDate?: string | null;
}) {
  try {
    const result = await db
      .insert(leads)
      .values({
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        message: input.message.trim(),
        interestType: input.interestType || 'imovel',
        propertyId: input.propertyId ?? null,
        launchId: input.launchId ?? null,
        preferredDate: input.preferredDate ?? null,
        status: 'novo',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed (createLead):', error);
    throw new Error('Erro ao registrar interesse.', { cause: error });
  }
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const result = await db
      .insert(messages)
      .values({
        name: input.name.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        subject: input.subject.trim(),
        message: input.message.trim(),
        status: 'nao_lida',
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed (createContactMessage):', error);
    throw new Error('Erro ao enviar mensagem.', { cause: error });
  }
}

export async function getAdminOverview() {
  try {
    await ensureSeeded();
    const [
      allProperties,
      allLaunches,
      allLeads,
      allMessages,
      allTestimonials,
      settingsRows,
      clientsRows,
    ] = await Promise.all([
      db.select().from(properties).orderBy(desc(properties.createdAt)),
      db.select().from(launches).orderBy(desc(launches.createdAt)),
      db.select().from(leads).orderBy(desc(leads.createdAt)),
      db.select().from(messages).orderBy(desc(messages.createdAt)),
      db.select().from(testimonials).orderBy(desc(testimonials.createdAt)),
      db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'default'))
        .limit(1),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt)),
    ]);

    return {
      properties: allProperties,
      launches: allLaunches,
      leads: allLeads,
      messages: allMessages,
      testimonials: allTestimonials,
      settings: settingsRows[0] || null,
      clients: clientsRows,
    };
  } catch (error) {
    console.error('Database query failed (getAdminOverview):', error);
    throw new Error('Erro ao carregar dados do painel administrativo.', {
      cause: error,
    });
  }
}

export async function generateUniquePropertySlug(title: string): Promise<string> {
  const base = slugify(title) || 'imovel';
  const existing = await db
    .select({ id: properties.id })
    .from(properties)
    .where(eq(properties.slug, base))
    .limit(1);
  if (existing.length === 0) return base;
  return `${base}-${Date.now().toString().slice(-4)}`;
}

export async function generateUniqueLaunchSlug(title: string): Promise<string> {
  const base = slugify(title) || 'lancamento';
  const existing = await db
    .select({ id: launches.id })
    .from(launches)
    .where(eq(launches.slug, base))
    .limit(1);
  if (existing.length === 0) return base;
  return `${base}-${Date.now().toString().slice(-4)}`;
}
