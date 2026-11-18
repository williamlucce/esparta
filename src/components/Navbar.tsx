import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EspartaLogo } from './EspartaLogo';

const NAV_ITEMS = [
  { label: 'Início', to: '/' },
  { label: 'Comprar', to: '/comprar' },
  { label: 'Lançamentos', to: '/lancamentos' },
  { label: 'Sobre Nós', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
];

export function Navbar() {
  const { setConsultantModalOpen, favoriteIds } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <Link
          to="/"
          aria-label="Esparta Imobiliária - Página inicial"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721] rounded-sm"
        >
          <EspartaLogo light />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721] ${
                  isActive
                    ? 'text-white border-[#F47721]'
                    : 'text-zinc-300 border-transparent hover:text-white hover:border-[#F47721]/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setConsultantModalOpen(true)}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Fale com um consultor
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-zinc-200 hover:text-white rounded-md border border-white/15 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#111111] border-t border-white/10 px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-white/10 text-[#F47721]'
                    : 'text-zinc-200 hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/favoritos"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Favoritos ({favoriteIds.length})
            </Link>
            <Link
              to="/minha-conta"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Área do Cliente
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-zinc-300 hover:text-white"
            >
              Painel Administrativo
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setConsultantModalOpen(true);
              }}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] rounded-md text-center cursor-pointer"
            >
              Fale com um consultor
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
