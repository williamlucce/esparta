import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { useApp } from '../context/AppContext';
import { filterAndSortProperties, SortOption } from '../lib/real-estate';

interface CatalogPageProps {
  mode: 'venda' | 'aluguel';
}

export function CatalogPage({ mode }: CatalogPageProps) {
  const { properties, loading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [q, setQ] = useState(() => searchParams.get('q') || '');
  const [propertyType, setPropertyType] = useState(
    () => searchParams.get('type') || 'Todos'
  );
  const [city, setCity] = useState(() => searchParams.get('city') || 'Todas');
  const [neighborhood, setNeighborhood] = useState(
    () => searchParams.get('neighborhood') || ''
  );
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get('minPrice') || ''
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get('maxPrice') || ''
  );
  const [minBedrooms, setMinBedrooms] = useState(
    () => searchParams.get('bedrooms') || ''
  );
  const [minParking, setMinParking] = useState(
    () => searchParams.get('parking') || ''
  );
  const [sort, setSort] = useState<SortOption>('recentes');

  const cities = useMemo(() => {
    const unique = new Set(
      properties
        .filter((p) => p.transactionType === mode)
        .map((p) => p.city)
    );
    return Array.from(unique).sort();
  }, [properties, mode]);

  const filtered = useMemo(() => {
    return filterAndSortProperties(properties, {
      transactionType: mode,
      q,
      propertyType: propertyType === 'Todos' ? undefined : propertyType,
      city: city === 'Todas' ? undefined : city,
      neighborhood: neighborhood || undefined,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      minBedrooms: minBedrooms ? Number(minBedrooms) : null,
      minParking: minParking ? Number(minParking) : null,
      sort,
    });
  }, [
    properties,
    mode,
    q,
    propertyType,
    city,
    neighborhood,
    minPrice,
    maxPrice,
    minBedrooms,
    minParking,
    sort,
  ]);

  function resetFilters() {
    setQ('');
    setPropertyType('Todos');
    setCity('Todas');
    setNeighborhood('');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms('');
    setMinParking('');
    setSort('recentes');
    setSearchParams({});
  }

  const isRent = mode === 'aluguel';

  return (
    <div className="bg-zinc-50 min-h-[75vh]">
      <section className="bg-[#111111] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#F47721]">
            {isRent ? 'Locação Residencial & Corporativa' : 'Acervo Exclusivo'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            {isRent ? 'Imóveis para Alugar' : 'Imóveis à Venda'}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            {isRent
              ? 'Imóveis residenciais e comerciais disponíveis.'
              : 'Empreendimentos habitacionais e casas selecionadas em Teresina, Altos, Demerval Lobão e Timon.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Advanced Filter Panel */}
        <div className="bg-white border border-zinc-200 rounded-lg p-5 mb-8 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
              <SlidersHorizontal className="w-4 h-4 text-[#F47721]" />
              Filtros avançados
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#F47721] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="filter-q"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Buscar por palavra-chave
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="filter-q"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Título, rua ou diferencial..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="filter-city"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Cidade
              </label>
              <select
                id="filter-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
              >
                <option value="Todas">Todas as cidades</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-neighborhood"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Bairro
              </label>
              <input
                id="filter-neighborhood"
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex.: Zona Norte, Zona Leste, Grande Dirceu..."
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
              />
            </div>

            <div>
              <label
                htmlFor="filter-type"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Tipo de imóvel
              </label>
              <select
                id="filter-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
              >
                <option value="Todos">Todos os tipos</option>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Condomínio">Condomínio</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-min-price"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                {isRent ? 'Aluguel mínimo (R$)' : 'Valor mínimo (R$)'}
              </label>
              <input
                id="filter-min-price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={isRent ? 'Ex.: 15000' : 'Ex.: 300000'}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721] tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="filter-max-price"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                {isRent ? 'Aluguel máximo (R$)' : 'Valor máximo (R$)'}
              </label>
              <input
                id="filter-max-price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={isRent ? 'Ex.: 80000' : 'Ex.: 1000000'}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721] tabular-nums"
              />
            </div>

            <div>
              <label
                htmlFor="filter-bedrooms"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Quartos mínimos
              </label>
              <select
                id="filter-bedrooms"
                value={minBedrooms}
                onChange={(e) => setMinBedrooms(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
              >
                <option value="">Qualquer quantidade</option>
                <option value="1">1+ quartos</option>
                <option value="2">2+ quartos</option>
                <option value="3">3+ quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-parking"
                className="block text-xs font-semibold text-zinc-600 mb-1"
              >
                Vagas de garagem
              </label>
              <select
                id="filter-parking"
                value={minParking}
                onChange={(e) => setMinParking(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
              >
                <option value="">Qualquer quantidade</option>
                <option value="1">1+ vagas</option>
                <option value="2">2+ vagas</option>
                <option value="3">3+ vagas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Result header + Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-zinc-600 tabular-nums">
            <strong className="text-[#111111]">{filtered.length}</strong>{' '}
            {filtered.length === 1
              ? 'imóvel encontrado'
              : 'imóveis encontrados'}
          </p>

          <div className="flex items-center gap-2">
            <label
              htmlFor="catalog-sort"
              className="text-xs font-semibold text-zinc-600 whitespace-nowrap"
            >
              Ordenar por:
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white focus:outline-none focus:border-[#F47721]"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor_preco">Menor preço</option>
              <option value="maior_preco">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 bg-white border border-zinc-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center space-y-4">
            <h2 className="font-display text-xl font-bold text-[#111111]">
              Nenhum imóvel encontrado com esses filtros
            </h2>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              Ajuste os critérios de preço, localização ou tipologia, ou fale com
              um consultor para acessar nosso portfólio reservado.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md cursor-pointer"
            >
              Limpar todos os filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
