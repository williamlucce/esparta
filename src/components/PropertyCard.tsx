import { Bath, BedDouble, Car, Heart, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBRL } from '../lib/real-estate';
import { Property } from '../types';
import { PropertyImage } from './PropertyImage';

export function PropertyCard({ property }: { property: Property }) {
  const { favoriteIds, toggleFavorite } = useApp();
  const isFav = favoriteIds.includes(property.id);
  const txLabel = property.transactionType === 'aluguel' ? 'Aluguel' : 'Venda';

  return (
    <article className="group bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        <Link
          to={`/imovel/${property.slug}`}
          className="block w-full h-full focus-visible:outline-none"
          aria-label={`Ver detalhes de ${property.title}`}
        >
          <PropertyImage
            src={property.images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </Link>

        <button
          type="button"
          onClick={() => toggleFavorite(property.id)}
          aria-label={
            isFav
              ? `Remover ${property.title} dos favoritos`
              : `Salvar ${property.title} nos favoritos`
          }
          aria-pressed={isFav}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#111111]/80 hover:bg-[#111111] text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721]"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-[#F47721] text-[#F47721]' : 'text-white'
            }`}
          />
        </button>

        <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between gap-2 pointer-events-none">
          <p className="font-display text-xl font-bold text-white tabular-nums drop-shadow-sm">
            {formatBRL(property.price)}
            {property.transactionType === 'aluguel' && (
              <span className="text-xs font-normal text-zinc-200"> / mês</span>
            )}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500">
            <span className="text-[#F47721] font-semibold">{txLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{property.propertyType}</span>
            {property.exclusive && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#111111] font-semibold">Exclusivo</span>
              </>
            )}
          </div>

          <h3 className="font-display text-lg font-semibold text-[#111111] leading-snug line-clamp-2">
            <Link
              to={`/imovel/${property.slug}`}
              className="hover:text-[#F47721] transition-colors"
            >
              {property.title}
            </Link>
          </h3>

          <p className="text-sm text-zinc-600 line-clamp-1">
            {property.neighborhood}, {property.city}
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-100 space-y-4">
          <div className="grid grid-cols-4 gap-2 text-xs text-zinc-600 tabular-nums">
            <div className="flex items-center gap-1" title="Quartos">
              <BedDouble className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{property.bedrooms} qts</span>
            </div>
            <div className="flex items-center gap-1" title="Banheiros">
              <Bath className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{property.bathrooms} ban</span>
            </div>
            <div className="flex items-center gap-1" title="Vagas de garagem">
              <Car className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{property.parkingSpots} vag</span>
            </div>
            <div className="flex items-center gap-1" title="Área útil">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>{property.areaSqm} m²</span>
            </div>
          </div>

          <Link
            to={`/imovel/${property.slug}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md transition-colors duration-150 whitespace-nowrap"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
