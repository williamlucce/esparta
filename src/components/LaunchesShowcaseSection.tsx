import {
  CalendarClock,
  Check,
  FileSpreadsheet,
  Home,
  MapPin,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LAUNCH_PARQUE_VILLE_IMAGE,
  LAUNCH_POR_DO_SOL_IMAGE,
} from '../lib/assetImages';
import { buildWhatsAppUrl } from '../lib/real-estate';

const LAUNCH_BENEFITS = [
  {
    icon: FileSpreadsheet,
    title: 'Tabela de Lançamento',
    description: 'Preços e condições especiais de abertura de vendas.',
  },
  {
    icon: CalendarClock,
    title: 'Entrada Facilitada',
    description:
      'Sinal acessível e parcelamento direto da entrada em até 72 vezes.',
  },
  {
    icon: Home,
    title: 'Minha Casa Minha Vida',
    description: 'Subsídios do governo e possibilidade de usar o FGTS.',
  },
  {
    icon: TrendingUp,
    title: 'Valorização Garantida',
    description: 'Seu imóvel valorizando desde o início das obras.',
  },
];

const FEATURED_LAUNCHES = [
  {
    id: 'village-parque-ville',
    name: 'Village Parque Ville',
    location: 'Zona Norte, Teresina - PI',
    image: LAUNCH_PARQUE_VILLE_IMAGE,
    imageAlt:
      'Condomínio clube completo do lançamento Village Parque Ville na Zona Norte de Teresina',
    summary:
      'Condomínio clube completo na Zona Norte com lazer equipado, segurança e condições facilitadas pelo programa Minha Casa Minha Vida.',
    highlights: [
      'Condomínio clube completo',
      'Condições Minha Casa Minha Vida',
      'Possibilidade de usar o FGTS',
      'Tabela especial de lançamento',
    ],
    whatsappMessage:
      'Olá! Vim pelo site da Esparta Imob e gostaria de receber a tabela de lançamento e plantas do Village Parque Ville.',
  },
  {
    id: 'village-por-do-sol',
    name: 'Village Pôr do Sol',
    location: 'Zona Leste, Teresina - PI',
    image: LAUNCH_POR_DO_SOL_IMAGE,
    imageAlt:
      'Condomínio moderno do lançamento Village Pôr do Sol na Zona Leste de Teresina',
    summary:
      'Localização privilegiada na Zona Leste de Teresina, unindo infraestrutura moderna e uma entrada super facilitada direto na planta.',
    highlights: [
      'Localização privilegiada na Zona Leste',
      'Entrada super facilitada',
      'Parcelamento direto em até 72x',
      'Potencial de valorização na obra',
    ],
    whatsappMessage:
      'Olá! Vim pelo site da Esparta Imob e gostaria de receber a tabela de lançamento e plantas do Village Pôr do Sol.',
  },
];

function formatPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return digits;
}

export function LaunchesShowcaseSection({
  showHeader = true,
}: {
  showHeader?: boolean;
}) {
  const { settings } = useApp();
  const [vipName, setVipName] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [vipError, setVipError] = useState<string | null>(null);
  const [vipSubmittedUrl, setVipSubmittedUrl] = useState<string | null>(null);

  const whatsappNumber = settings.whatsapp || '5586981331132';

  function handleVipSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = vipName.trim();
    const digits = vipPhone.replace(/\D/g, '');

    if (cleanName.length < 2) {
      setVipError('Informe seu nome para entrar na Lista VIP.');
      return;
    }
    if (digits.length < 10) {
      setVipError('Informe um número de WhatsApp válido com DDD.');
      return;
    }

    setVipError(null);

    const message = `Olá! Meu nome é ${cleanName} (WhatsApp: ${vipPhone.trim()}) e quero entrar na Lista VIP de Pré-Lançamentos da Esparta Imob para receber os próximos lançamentos em primeira mão.`;
    const url = buildWhatsAppUrl(whatsappNumber, message);
    setVipSubmittedUrl(url);

    // Trigger anchor navigation cleanly without window.open
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <section
      id="lancamentos-imobiliarios"
      aria-labelledby="lancamentos-heading"
      className="py-16 lg:py-20 bg-zinc-50 border-b border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Cabeçalho de destaque */}
        {showHeader && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold text-[#F47721] tracking-wide uppercase">
                Oportunidades na Planta
              </p>
              <h2
                id="lancamentos-heading"
                className="font-display text-3xl sm:text-4xl font-bold text-[#111111] leading-[1.12] tracking-tight [text-wrap:balance]"
              >
                Garanta condições especiais de lançamento antes da entrega das
                chaves.
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">
                A{' '}
                <strong className="font-semibold text-[#111111]">
                  Esparta Imob
                </strong>{' '}
                é parceira oficial de grandes construtoras, como a{' '}
                <strong className="font-semibold text-[#111111]">
                  Canopus Construções
                </strong>
                , trazendo os melhores lançamentos de Teresina e região com
                tabelas exclusivas de abertura.
              </p>
            </div>
          </div>
        )}

        {/* 2. Faixa com 4 benefícios rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LAUNCH_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white border border-zinc-200 rounded-lg p-5 space-y-2.5 transition-colors hover:border-[#F47721]/60"
              >
                <div className="w-10 h-10 rounded-md bg-[#F47721]/10 text-[#F47721] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#111111]">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3. Cards dos 2 lançamentos principais em destaque */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FEATURED_LAUNCHES.map((launch) => {
            const whatsappHref = buildWhatsAppUrl(
              whatsappNumber,
              launch.whatsappMessage
            );
            return (
              <article
                key={launch.id}
                className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="relative aspect-[16/9] bg-zinc-900 overflow-hidden">
                  <img
                    src={launch.image}
                    alt={launch.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                  <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded bg-[#F47721] text-white text-xs font-bold uppercase tracking-wider">
                    LANÇAMENTO
                  </span>

                  <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-white pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-100">
                      <MapPin className="w-4 h-4 text-[#F47721] shrink-0" />
                      {launch.location}
                    </span>
                    <span className="text-xs font-semibold text-zinc-200 bg-[#111111]/75 px-2.5 py-1 rounded border border-white/15">
                      Canopus Construções
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#111111] tracking-tight">
                        {launch.name}
                      </h3>
                      <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">
                        {launch.summary}
                      </p>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-zinc-100 text-sm text-zinc-700">
                      {launch.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#F47721] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md transition-colors duration-150 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    Receber Tabela e Plantas
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* 4. Banner Lista VIP de Pré-Lançamentos */}
        <div className="bg-[#111111] text-white rounded-lg p-6 sm:p-8 border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F47721] tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Lista VIP de Pré-Lançamentos
              </p>
              <h3 className="font-display text-2xl font-bold leading-tight">
                Receba os próximos lançamentos em primeira mão.
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Deixe seu nome e WhatsApp para garantir acesso antecipado às
                tabelas promocionais antes da abertura oficial de vendas.
              </p>
            </div>

            <form
              onSubmit={handleVipSubmit}
              className="lg:col-span-7 space-y-3"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="vip-lead-name"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    Seu Nome
                  </label>
                  <input
                    id="vip-lead-name"
                    type="text"
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    placeholder="Ex.: João Silva"
                    className="w-full px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#F47721]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="vip-lead-phone"
                    className="block text-xs font-medium text-zinc-300 mb-1"
                  >
                    Seu WhatsApp
                  </label>
                  <input
                    id="vip-lead-phone"
                    type="tel"
                    value={vipPhone}
                    onChange={(e) =>
                      setVipPhone(formatPhoneMask(e.target.value))
                    }
                    placeholder="(86) 99999-9999"
                    className="w-full px-3.5 py-2.5 text-sm bg-white/10 border border-white/15 rounded-md text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#F47721] tabular-nums"
                  />
                </div>

                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Quero Acesso VIP
                  </button>
                </div>
              </div>

              {vipError && (
                <p className="text-xs text-[#F47721] font-medium" role="alert">
                  {vipError}
                </p>
              )}

              {vipSubmittedUrl && !vipError && (
                <p className="text-xs text-zinc-300" role="status">
                  Tudo pronto! Caso o WhatsApp não abra automaticamente,{' '}
                  <a
                    href={vipSubmittedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F47721] font-semibold underline hover:text-white"
                  >
                    clique aqui para enviar seus dados
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
