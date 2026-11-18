import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { buildWhatsAppUrl } from '../lib/real-estate';
import { EspartaLogo } from './EspartaLogo';

export function Footer() {
  const { settings, favoriteIds } = useApp();
  const whatsappLink = buildWhatsAppUrl(
    settings.whatsapp,
    'Olá! Gostaria de mais informações sobre os imóveis da Esparta Imobiliária.'
  );

  return (
    <footer className="bg-[#111111] text-zinc-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <EspartaLogo light size="lg" />
            <p className="font-display text-base font-medium text-white">
              Seu próximo capítulo começa aqui.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Compra, venda e avaliação de imóveis em Teresina, Altos, Demerval
              Lobão e Timon, com destaque para o Minha Casa Minha Vida.
            </p>
            <p className="text-xs text-zinc-500 tabular-nums">{settings.creci}</p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#F47721] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/comprar"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Comprar Imóveis
                </Link>
              </li>
              <li>
                <Link
                  to="/lancamentos"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Portal & Gestão
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/favoritos"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Imóveis Favoritos ({favoriteIds.length})
                </Link>
              </li>
              <li>
                <Link
                  to="/minha-conta"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Área do Cliente
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Painel Administrativo
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidade"
                  className="hover:text-[#F47721] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <h3 className="font-display text-sm font-semibold text-white mb-4">
              Atendimento
            </h3>
            <p className="flex items-start gap-2.5 text-zinc-400">
              <MapPin className="w-4 h-4 text-[#F47721] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2.5 text-zinc-400 tabular-nums">
              <Phone className="w-4 h-4 text-[#F47721] shrink-0" />
              <span>{settings.phone}</span>
            </p>
            <p className="flex items-center gap-2.5 text-zinc-400">
              <Mail className="w-4 h-4 text-[#F47721] shrink-0" />
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-white transition-colors truncate"
              >
                {settings.email}
              </a>
            </p>
            <p className="text-xs text-zinc-500">{settings.businessHours}</p>

            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Esparta Imobiliária"
                className="w-9 h-9 rounded-md border border-white/15 flex items-center justify-center text-zinc-300 hover:border-[#F47721] hover:text-[#F47721] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl || 'https://www.facebook.com/p/Esparta-imob-61565846159585/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Esparta Imobiliária"
                className="w-9 h-9 rounded-md border border-white/15 flex items-center justify-center text-zinc-300 hover:border-[#F47721] hover:text-[#F47721] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs font-semibold text-[#F47721] hover:underline whitespace-nowrap"
              >
                WhatsApp direto →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} ESPARTA IMOBILIÁRIA. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacidade" className="hover:text-zinc-300">
              Política de Privacidade
            </Link>
            <span>Teresina, PI · Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
