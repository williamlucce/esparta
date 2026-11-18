import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { buildWhatsAppUrl } from '../lib/real-estate';

export function WhatsAppFloat() {
  const { settings } = useApp();
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const href = buildWhatsAppUrl(
    settings.whatsapp,
    'Olá! Estou no site da Esparta Imobiliária e gostaria de falar com um corretor.'
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp com a Esparta Imobiliária"
      className="fixed bottom-4 right-4 z-30 inline-flex items-center justify-center gap-2 w-11 h-11 sm:w-auto sm:h-11 sm:px-4 rounded-full bg-[#111111] text-white border border-[#F47721] shadow-lg hover:bg-[#F47721] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721]"
    >
      <MessageCircle className="w-5 h-5 text-[#F47721] shrink-0" />
      <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
