import {
  ArrowRight,
  Building2,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { useApp } from '../context/AppContext';
import { CONSULTANT_PORTRAIT, HERO_BANNER_IMAGE } from '../lib/assetImages';
import { buildWhatsAppUrl } from '../lib/real-estate';

const DIFFERENTIALS = [
  {
    number: '01.',
    title: 'Compra e Venda de Imóveis',
    description:
      'Residências e empreendimentos habitacionais selecionados nas zonas Norte, Leste, Sudeste e Sul de Teresina, além de Altos, Demerval Lobão e Timon.',
  },
  {
    number: '02.',
    title: 'Minha Casa Minha Vida & Crédito',
    description:
      'Simulação transparente, orientação para uso do FGTS e parceria com grandes construtoras, como a Canopus, para aprovar seu financiamento com tranquilidade.',
  },
  {
    number: '03.',
    title: 'Avaliação Técnica de Imóveis',
    description:
      'Análise precisa do valor de mercado com base na realidade de cada bairro, garantindo preço justo e segurança patrimonial para quem compra ou vende.',
  },
  {
    number: '04.',
    title: 'Assessoria até a Entrega das Chaves',
    description:
      'Cuidamos de toda a documentação, certidões, contratos e registro em cartório com atendimento próximo e descomplicado para a sua família.',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const {
    properties,
    testimonials,
    settings,
    loading,
    favoriteIds,
    setConsultantModalOpen,
  } = useApp();

  const [locationQuery, setLocationQuery] = useState('');
  const [propertyType, setPropertyType] = useState('Todos');
  const [priceRange, setPriceRange] = useState('');

  const featuredProperties = useMemo(
    () =>
      properties
        .filter((p) => p.status === 'ativo' && p.featured)
        .slice(0, 3),
    [properties]
  );

  const mostSearchedProperties = useMemo(
    () =>
      properties
        .filter((p) => p.status === 'ativo' && p.mostSearched)
        .slice(0, 4),
    [properties]
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationQuery.trim()) params.set('q', locationQuery.trim());
    if (propertyType && propertyType !== 'Todos') {
      params.set('type', propertyType);
    }
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    const queryStr = params.toString();
    navigate(queryStr ? `/comprar?${queryStr}` : '/comprar');
  }

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    'Olá! Gostaria de falar com um corretor da Esparta Imobiliária.'
  );

  return (
    <div>
      {/* 1. HERO BANNER + SEARCH */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BANNER_IMAGE}
            alt="Residência moderna selecionada pela Esparta Imobiliária"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-[#111111]/45" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold text-[#F47721] tracking-wide">
              ESPARTA IMOBILIÁRIA · Seu próximo capítulo começa aqui.
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.08] tracking-tight text-white [text-wrap:balance]">
              Encontre o imóvel que combina com o seu futuro.
            </h1>
            <p className="text-base sm:text-lg text-zinc-200 max-w-2xl leading-relaxed">
              Residências exclusivas, apartamentos bem localizados e oportunidades
              selecionadas com rigor técnico e transparência nos endereços mais
              valorizados do Piauí, para que cada escolha seja o início de uma
              grande conquista.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 bg-white text-[#111111] rounded-lg p-4 sm:p-5 border border-zinc-200 max-w-5xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-zinc-100">
              <div className="inline-flex items-center gap-2">
                <span className="px-4 py-1.5 text-sm font-semibold rounded bg-[#111111] text-white whitespace-nowrap">
                  Comprar
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
                <Link
                  to="/favoritos"
                  className="inline-flex items-center gap-1.5 hover:text-[#F47721] transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-[#F47721]" />
                  Favoritos ({favoriteIds.length})
                </Link>
                <Link
                  to="/minha-conta"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Área do Cliente
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5">
                <label
                  htmlFor="home-search-location"
                  className="block text-xs font-semibold text-zinc-600 mb-1"
                >
                  Localização ou palavra-chave
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="home-search-location"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Ex.: Parque Ville, Village Garden, Altos, Timon..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                <label
                  htmlFor="home-search-type"
                  className="block text-xs font-semibold text-zinc-600 mb-1"
                >
                  Tipo de imóvel
                </label>
                <select
                  id="home-search-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
                >
                  <option value="Todos">Todos os tipos</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Condomínio">Condomínio</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="home-search-price"
                  className="block text-xs font-semibold text-zinc-600 mb-1"
                >
                  Faixa de preço
                </label>
                <select
                  id="home-search-price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
                >
                  <option value="">Qualquer valor</option>
                  <option value="0-220000">Até R$ 220 mil</option>
                  <option value="220000-260000">R$ 220 mil a R$ 260 mil</option>
                  <option value="260000-350000">R$ 260 mil a R$ 350 mil</option>
                  <option value="0-500000">Até R$ 500 mil</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 2. KPI / TRUST STRIP */}
      <section className="bg-[#18181B] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-display text-2xl font-bold text-[#F47721] tabular-nums">
              R$ 40 milhões
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Em volume geral de vendas assessoradas
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white tabular-nums">
              {properties.length}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Empreendimentos e ofertas em destaque
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white tabular-nums">
              Teresina &amp; Região
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Teresina, Altos, Demerval Lobão e Timon
            </p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white tabular-nums">
              98,4%
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Satisfação na entrega das chaves
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#F47721] tracking-wide">
                Curadoria Esparta
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-1 tracking-tight">
                Imóveis em Destaque
              </h2>
            </div>
            <Link
              to="/comprar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#F47721] transition-colors whitespace-nowrap"
            >
              Explorar todo o acervo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-lg bg-zinc-100 animate-pulse border border-zinc-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. MOST SEARCHED PROPERTIES */}
      <section className="py-16 lg:py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#F47721] tracking-wide">
                Alta Demanda
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-1 tracking-tight">
                Imóveis Mais Procurados
              </h2>
            </div>
            <Link
              to="/comprar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:text-[#F47721] transition-colors whitespace-nowrap"
            >
              Ver imóveis disponíveis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {mostSearchedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRESENTATION & DIFFERENTIALS */}
      <section className="py-16 lg:py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-[#F47721] tracking-wide">
                  Sobre a ESPARTA IMOBILIÁRIA
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight [text-wrap:balance]">
                  Seu sonho da casa própria conduzido com clareza, agilidade e confiança.
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed">
                  Especialistas em compra, venda e avaliação de imóveis no Piauí
                  e em Timon, com foco em empreendimentos habitacionais e
                  programas como o Minha Casa Minha Vida. Da simulação de crédito
                  à entrega das chaves, sua conquista tem acompanhamento real.
                </p>
              </div>

              <div className="rounded-lg overflow-hidden border border-white/10 aspect-square max-w-sm">
                <img
                  src={CONSULTANT_PORTRAIT}
                  alt="Diretoria de Consultoria da Esparta Imobiliária"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <Link
                  to="/sobre"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F47721] hover:text-white transition-colors"
                >
                  Conhecer nossa história e equipe
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {DIFFERENTIALS.map((item) => (
                <div
                  key={item.number}
                  className="p-6 rounded-lg bg-[#18181B] border border-white/10 flex flex-col justify-between gap-4"
                >
                  <span className="font-display text-2xl font-bold text-[#F47721] tabular-nums">
                    {item.number}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#F47721] tracking-wide">
              Clientes Esparta
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] mt-1 tracking-tight">
              Histórias de quem realizou o sonho da casa própria conosco.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="p-6 rounded-lg border border-zinc-200 bg-zinc-50 flex flex-col justify-between gap-6"
              >
                <p className="text-sm text-zinc-700 leading-relaxed">
                  “{t.quote}”
                </p>
                <footer className="pt-4 border-t border-zinc-200 space-y-1">
                  <p className="font-display text-base font-semibold text-[#111111]">
                    {t.clientName}
                  </p>
                  <p className="text-xs text-zinc-500">{t.clientRole}</p>
                  <p className="text-xs font-semibold text-[#F47721] pt-1">
                    {t.outcome}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONSULTANT CONVERSION BANNER */}
      <section className="py-16 bg-[#18181B] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F47721]" />
                Segurança Documental
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#F47721]" />
                Minha Casa Minha Vida
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#F47721]" />
                Atendimento Humanizado
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold [text-wrap:balance]">
              Quer encontrar o imóvel ideal e simular seu financiamento?
            </h2>
            <p className="text-sm text-zinc-300">
              Converse agora com um consultor da ESPARTA IMOBILIÁRIA e receba uma
              simulação personalizada para compra ou avaliação do seu imóvel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setConsultantModalOpen(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Agendar consultoria
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-white/25 hover:border-[#F47721] rounded-md transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-[#F47721]" />
              Conversar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
