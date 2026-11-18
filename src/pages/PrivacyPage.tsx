export function PrivacyPage() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <p className="text-xs font-semibold text-[#F47721]">
          Transparência & LGPD
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111]">
          Política de Privacidade
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          A ESPARTA IMOBILIÁRIA respeita integralmente a privacidade e a proteção
          dos dados pessoais de seus clientes, em conformidade com a Lei Geral de
          Proteção de Dados (Lei nº 13.709/2018 – LGPD).
        </p>
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <h2 className="font-display text-lg font-bold text-[#111111]">
            1. Coleta e Finalidade dos Dados
          </h2>
          <p>
            Coletamos nome, e-mail, telefone e preferências imobiliárias
            exclusivamente para realizar atendimentos consultivos, agendar visitas
            a imóveis, enviar informações de lançamentos solicitadas e manter sua
            lista de imóveis favoritos.
          </p>
          <h2 className="font-display text-lg font-bold text-[#111111]">
            2. Armazenamento e Segurança
          </h2>
          <p>
            Seus dados são armazenados em ambiente criptografado de banco de dados
            relacional e nunca são comercializados ou compartilhados com terceiros
            alheios à operação imobiliária solicitada.
          </p>
          <h2 className="font-display text-lg font-bold text-[#111111]">
            3. Direitos do Titular
          </h2>
          <p>
            Você pode solicitar a atualização, exportação ou exclusão definitiva
            dos seus dados pessoais a qualquer momento através do e-mail oficial da
            ESPARTA IMOBILIÁRIA.
          </p>
        </div>
      </div>
    </div>
  );
}
