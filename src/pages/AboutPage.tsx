import { Award, Compass, Eye, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CONSULTANT_PORTRAIT, HERO_BANNER_IMAGE } from '../lib/assetImages';

const TEAM = [
  {
    name: 'Marcelo Bomfim Veras',
    role: 'Corretor Responsável · CRECI 0727/PJ',
    creci: 'CRECI 0727/PJ',
    specialty: 'Teresina, Altos, Demerval Lobão (PI) e Timon (MA)',
    bio: 'Atuação dedicada na compra, venda e avaliação de imóveis, guiando famílias desde a escolha da região até a assinatura segura da escritura.',
  },
  {
    name: 'Equipe Habitacional',
    role: 'Especialistas em Minha Casa Minha Vida',
    creci: 'Parcerias Canopus & Construtoras',
    specialty: 'Parque Ville, Village Garden II, Village Natureza e Vamos Ver o Sol',
    bio: 'Orientação completa para aprovação de crédito habitacional, uso do FGTS e acesso às melhores condições dos principais empreendimentos de Teresina.',
  },
  {
    name: 'Assessoria Documental',
    role: 'Avaliação, Contratos e Cartório',
    creci: 'Suporte Jurídico Imobiliário PI/MA',
    specialty: 'Regularização, certidões e financiamento bancário',
    bio: 'Verificação prévia de matrículas e certidões no Piauí e no Maranhão para garantir transparência e tranquilidade em cada negociação.',
  },
];

export function AboutPage() {
  const { setConsultantModalOpen } = useApp();

  return (
    <div className="bg-white">
      <section className="bg-[#111111] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold text-[#F47721]">
              Sobre a ESPARTA IMOBILIÁRIA · Teresina/PI &amp; Timon/MA
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight [text-wrap:balance]">
              Raízes em Teresina, atuação estratégica entre o Piauí e o Maranhão.
            </h1>
            <p className="text-base text-zinc-300 leading-relaxed max-w-2xl">
              Nascida em Teresina (PI), a ESPARTA IMOBILIÁRIA surgiu para elevar o
              padrão da consultoria imobiliária na região integrada da Grande
              Teresina — unindo conhecimento profundo da capital piauiense e
              presença ativa em Timon (MA) com inteligência patrimonial e
              curadoria criteriosa.
            </p>
          </div>
          <div className="lg:col-span-5 aspect-[16/10] rounded-lg overflow-hidden border border-white/10">
            <img
              src={HERO_BANNER_IMAGE}
              alt="Arquitetura selecionada pela Esparta Imobiliária em Teresina e Timon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nossa História + Compromisso */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
              Nossa História em Teresina/PI
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Sediada na Av. João XXIII, 3800 (Edifício Hotel Express Arrey, Sala
              9 — Recanto das Palmeiras), a{' '}
              <strong className="font-semibold text-[#111111]">
                ESPARTA IMOBILIÁRIA (Marcelo Bomfim Veras - ME, CRECI 0727/PJ)
              </strong>{' '}
              atua com foco na compra, venda e avaliação de imóveis em toda a
              capital piauiense e cidades vizinhas.
            </p>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Acompanhamos o crescimento das zonas Norte, Leste, Sudeste e Sul
              de Teresina, além de{' '}
              <strong className="font-semibold text-[#111111]">
                Altos (PI), Demerval Lobão (PI) e Timon (MA)
              </strong>
              , aproximando famílias dos principais empreendimentos habitacionais
              e parcerias sólidas com construtoras como a Canopus.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111111]">
              Serviços Disponíveis &amp; Compromisso
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Oferecemos atendimento próximo e transparente para quem busca
              adquirir o primeiro imóvel ou investir com segurança — incluindo
              orientação completa no programa Minha Casa Minha Vida, simulação
              de parcelas e uso do FGTS.
            </p>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Também realizamos avaliação técnica de mercado e cuidamos de toda
              a verificação documental nos cartórios do Piauí e Maranhão, para
              que cada cliente tenha tranquilidade do primeiro contato até a
              entrega das chaves.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                <p className="font-display text-lg font-bold text-[#111111]">
                  Teresina &amp; Cidades Vizinhas
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Atuação em Teresina, Altos e Demerval Lobão com foco em
                  empreendimentos habitacionais.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                <p className="font-display text-lg font-bold text-[#111111]">
                  Timon · MA
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Consultoria dedicada na compra, venda e avaliação de imóveis
                  residenciais em Timon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg border border-zinc-200 bg-zinc-50 space-y-3">
            <Compass className="w-6 h-6 text-[#F47721]" />
            <h3 className="font-display text-xl font-bold text-[#111111]">
              Nossa Missão
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Tornar a compra, venda e avaliação de imóveis um processo simples,
              acessível e seguro para cada família do Piauí e de Timon.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 bg-zinc-50 space-y-3">
            <Eye className="w-6 h-6 text-[#F47721]" />
            <h3 className="font-display text-xl font-bold text-[#111111]">
              Nossa Visão
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Ser referência regional em intermediação imobiliária e acesso à
              moradia, reconhecida pela honestidade e confiança dos clientes.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-zinc-200 bg-zinc-50 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#F47721]" />
            <h3 className="font-display text-xl font-bold text-[#111111]">
              Nossos Valores
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Clareza nas informações, respeito ao orçamento de cada família,
              segurança documental e atendimento humano do início ao fim.
            </p>
          </div>
        </div>
      </section>

      {/* Equipe de Consultores */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#F47721]">
                Liderança & Especialistas
              </p>
              <h2 className="font-display text-3xl font-bold text-[#111111] mt-1">
                Equipe de Consultores
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setConsultantModalOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md transition-colors cursor-pointer"
            >
              Agendar reunião com a diretoria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-zinc-900 overflow-hidden">
                  <img
                    src={CONSULTANT_PORTRAIT}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[#111111]">
                      {member.name}
                    </h3>
                    <Award className="w-4 h-4 text-[#F47721] shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-[#F47721]">
                    {member.role}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {member.creci} · {member.specialty}
                  </p>
                  <p className="text-sm text-zinc-600 pt-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
