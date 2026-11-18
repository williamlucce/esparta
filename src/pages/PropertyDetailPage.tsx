import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Check,
  CheckCircle2,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LocationMap } from '../components/LocationMap';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyImage } from '../components/PropertyImage';
import { useApp } from '../context/AppContext';
import {
  buildWhatsAppUrl,
  formatBRL,
  validateLeadPayload,
} from '../lib/real-estate';
import { Property } from '../types';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { favoriteIds, toggleFavorite, settings } = useApp();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Lead form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setNotFound(false);
      setActivePhotoIndex(0);
      setSubmitted(false);
      try {
        const res = await fetch(`/api/properties/${slug}`);
        if (res.status === 404) {
          if (active) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Erro ao carregar imóvel.');
        const data = await res.json();
        if (active) {
          setProperty(data.property);
          setSimilar(data.similar || []);
          setMessage(
            `Olá, gostaria de receber mais informações e agendar uma visita para o imóvel "${data.property.title}".`
          );
        }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    if (slug) load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-[480px] rounded-lg bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-[#111111]">
          Imóvel não encontrado
        </h1>
        <p className="text-sm text-zinc-600">
          O imóvel procurado pode ter sido negociado ou removido do portfólio ativo.
        </p>
        <Link
          to="/comprar"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md"
        >
          Ver imóveis disponíveis
        </Link>
      </div>
    );
  }

  const photos =
    property.images && property.images.length > 0
      ? property.images
      : ['/src/assets/images/prop_penthouse_living_1794686197879.jpg'];

  const isFav = favoriteIds.includes(property.id);
  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    `Olá! Tenho interesse no imóvel "${property.title}" (${formatBRL(
      property.price
    )}) e gostaria de conversar com um corretor.`
  );

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateLeadPayload({ name, email, phone, message });
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          preferredDate: preferredDate || null,
          interestType: 'imovel',
          propertyId: property?.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar solicitação.');
      }
      setSubmitted(true);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error ? err.message : 'Falha ao enviar solicitação.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to={property.transactionType === 'aluguel' ? '/alugar' : '/comprar'}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-[#111111]"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para{' '}
            {property.transactionType === 'aluguel'
              ? 'Imóveis para Alugar'
              : 'Imóveis à Venda'}
          </Link>

          <button
            type="button"
            onClick={() => toggleFavorite(property.id)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-zinc-300 rounded-md hover:border-[#F47721] cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isFav ? 'fill-[#F47721] text-[#F47721]' : 'text-zinc-600'
              }`}
            />
            {isFav ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
          </button>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          <div className="lg:col-span-9 aspect-[16/10] bg-zinc-900 rounded-lg overflow-hidden">
            <PropertyImage
              src={photos[activePhotoIndex]}
              alt={`${property.title} — Foto principal`}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-3 grid grid-cols-3 lg:grid-cols-1 gap-3">
            {photos.map((photo, idx) => (
              <button
                key={`${photo}-${idx}`}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                aria-label={`Visualizar foto ${idx + 1} de ${property.title}`}
                className={`aspect-[4/3] rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  idx === activePhotoIndex
                    ? 'border-[#F47721]'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <PropertyImage
                  src={photo}
                  alt={`${property.title} — Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Detail + Lead Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3 pb-6 border-b border-zinc-200">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
                <span className="text-[#F47721]">
                  {property.transactionType === 'aluguel' ? 'Aluguel' : 'Venda'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{property.propertyType}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {property.neighborhood}, {property.city}
                </span>
                {property.exclusive && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#111111]">Exclusivo Esparta</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                {property.title}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-zinc-600">
                <MapPin className="w-4 h-4 text-[#F47721] shrink-0" />
                {property.address}
              </p>

              <div className="pt-2 flex flex-wrap items-baseline gap-6">
                <div>
                  <span className="text-xs text-zinc-500 block">
                    {property.transactionType === 'aluguel'
                      ? 'Valor da locação'
                      : 'Valor de venda'}
                  </span>
                  <span className="font-display text-3xl font-bold text-[#111111] tabular-nums">
                    {formatBRL(property.price)}
                    {property.transactionType === 'aluguel' && (
                      <span className="text-base font-normal text-zinc-500">
                        {' '}
                        / mês
                      </span>
                    )}
                  </span>
                </div>

                {property.condoFee > 0 && (
                  <div>
                    <span className="text-xs text-zinc-500 block">
                      Condomínio
                    </span>
                    <span className="text-base font-semibold text-[#111111] tabular-nums">
                      {formatBRL(property.condoFee)}/mês
                    </span>
                  </div>
                )}

                {property.iptu > 0 && (
                  <div>
                    <span className="text-xs text-zinc-500 block">IPTU</span>
                    <span className="text-base font-semibold text-[#111111] tabular-nums">
                      {formatBRL(property.iptu)}/mês
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-5 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#F47721]" />
                  Área construída
                </div>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {property.areaSqm} m²
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                  <BedDouble className="w-3.5 h-3.5 text-[#F47721]" />
                  Quartos
                </div>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {property.bedrooms}
                </p>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Suítes</div>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {property.suites}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                  <Bath className="w-3.5 h-3.5 text-[#F47721]" />
                  Banheiros
                </div>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {property.bathrooms}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                  <Car className="w-3.5 h-3.5 text-[#F47721]" />
                  Garagem
                </div>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {property.parkingSpots} vagas
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-display text-xl font-bold text-[#111111]">
                Sobre este imóvel
              </h2>
              <p className="text-base text-zinc-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-[#111111]">
                  Características e diferenciais
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2.5 text-sm text-zinc-700"
                    >
                      <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-[#111111]">
                Localização
              </h2>
              <LocationMap
                title={`${property.neighborhood}, ${property.city}`}
                address={property.address}
                latitude={property.latitude}
                longitude={property.longitude}
              />
            </div>
          </div>

          {/* Sticky Lead Capture Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-[#111111] text-white rounded-lg p-6 border border-zinc-800 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#F47721]">
                Atendimento Exclusivo
              </p>
              <h2 className="font-display text-xl font-bold mt-0.5">
                Solicitar informações
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Agende uma visita privada ou receba o dossiê completo deste imóvel.
              </p>
            </div>

            {submitted ? (
              <div className="p-5 bg-white/5 border border-white/10 rounded-md text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#F47721] mx-auto" />
                <h3 className="font-display text-lg font-bold">
                  Interesse registrado
                </h3>
                <p className="text-xs text-zinc-300">
                  Nosso consultor especializado recebeu seus dados e retornará em
                  instantes.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleLeadSubmit}
                className="space-y-3.5"
                noValidate
              >
                {errors.form && (
                  <p className="text-xs text-red-400">{errors.form}</p>
                )}

                <div>
                  <label
                    htmlFor="prop-lead-name"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    Seu nome
                  </label>
                  <input
                    id="prop-lead-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prop-lead-email"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="prop-lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com.br"
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prop-lead-phone"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="prop-lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="prop-lead-date"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    Data preferencial para visita
                  </label>
                  <input
                    id="prop-lead-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F47721]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prop-lead-msg"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="prop-lead-msg"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting
                    ? 'Enviando solicitação...'
                    : 'Agendar visita / Receber dossiê'}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Conversar pelo WhatsApp
              </a>
            </div>
          </aside>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-200">
            <h2 className="font-display text-2xl font-bold text-[#111111] mb-6">
              Imóveis semelhantes que podem interessar você
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
