import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { useApp } from '../context/AppContext';

export function FavoritesPage() {
  const { properties, favoriteIds, user } = useApp();
  const favProperties = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="bg-zinc-50 min-h-[70vh]">
      <section className="bg-[#111111] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#F47721]">
              Sua Seleção Pessoal
            </p>
            <h1 className="font-display text-3xl font-bold mt-1">
              Imóveis Favoritos ({favProperties.length})
            </h1>
          </div>

          {!user && (
            <Link
              to="/minha-conta"
              className="px-4 py-2 text-xs font-semibold text-white border border-white/25 hover:border-[#F47721] rounded-md whitespace-nowrap"
            >
              Entrar para sincronizar na nuvem
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favProperties.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center space-y-4">
            <Heart className="w-10 h-10 text-zinc-300 mx-auto" />
            <h2 className="font-display text-xl font-bold text-[#111111]">
              Você ainda não favoritou nenhum imóvel
            </h2>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              Explore os empreendimentos e casas disponíveis e clique no ícone
              de coração para salvar seus imóveis preferidos.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                to="/comprar"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md"
              >
                Ver imóveis disponíveis
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
