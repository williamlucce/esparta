import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppUrl, validateLeadPayload } from '../lib/real-estate';

export function ConsultantModal() {
  const { consultantModalOpen, setConsultantModalOpen, settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState(
    'Gostaria de receber atendimento personalizado de um consultor Esparta.'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!consultantModalOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateLeadPayload({ name, email, phone, message });
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          preferredDate: preferredDate || null,
          interestType: 'consultoria',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar solicitação.');
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Falha ao enviar solicitação.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setConsultantModalOpen(false);
    setSubmitted(false);
    setErrors({});
    setServerError(null);
  }

  const whatsappDirect = buildWhatsAppUrl(
    settings.whatsapp,
    'Olá! Gostaria de falar com um consultor da Esparta Imobiliária.'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultant-modal-title"
    >
      <div className="bg-white text-[#111111] w-full max-w-lg rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-[#111111] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#F47721]">
              Atendimento Consultivo
            </p>
            <h2
              id="consultant-modal-title"
              className="font-display text-xl font-bold mt-0.5"
            >
              Fale com um consultor Esparta
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar janela de atendimento"
            className="w-9 h-9 rounded-md flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#F47721] mx-auto" />
              <h3 className="font-display text-xl font-bold">
                Solicitação registrada com sucesso
              </h3>
              <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                Um especialista da Esparta Imobiliária entrará em contato em breve
                para apresentar as melhores oportunidades para o seu perfil.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Iniciar no WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-semibold text-[#111111] border border-zinc-300 rounded-md hover:bg-zinc-50 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {serverError && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                  {serverError}
                </div>
              )}

              <div>
                <label
                  htmlFor="consult-name"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  Nome completo
                </label>
                <input
                  id="consult-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Mariana Albuquerque"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="consult-email"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com.br"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="consult-phone"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="consult-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="consult-date"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  Data preferencial para atendimento ou visita (opcional)
                </label>
                <input
                  id="consult-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
              </div>

              <div>
                <label
                  htmlFor="consult-msg"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  Como podemos ajudar?
                </label>
                <textarea
                  id="consult-msg"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Enviando...' : 'Solicitar atendimento'}
                </button>
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#111111] border border-zinc-300 hover:border-[#111111] rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                  WhatsApp direto
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
