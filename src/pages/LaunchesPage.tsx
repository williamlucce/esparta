import { LaunchesShowcaseSection } from '../components/LaunchesShowcaseSection';

export function LaunchesPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <section className="bg-[#111111] text-white py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs font-semibold text-[#F47721] tracking-wide uppercase">
            Oportunidades na Planta
          </p>
          <h1
            id="lancamentos-heading"
            className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-tight max-w-3xl [text-wrap:balance]"
          >
            Garanta condições especiais de lançamento antes da entrega das
            chaves.
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
            A{' '}
            <strong className="font-semibold text-white">Esparta Imob</strong>{' '}
            é parceira oficial de grandes construtoras, como a{' '}
            <strong className="font-semibold text-white">
              Canopus Construções
            </strong>
            , trazendo os melhores lançamentos de Teresina e região com tabelas
            exclusivas de abertura.
          </p>
        </div>
      </section>

      <LaunchesShowcaseSection showHeader={false} />
    </div>
  );
}
