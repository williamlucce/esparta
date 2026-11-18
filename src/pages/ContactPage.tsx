import {
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { LocationMap } from '../components/LocationMap';
import { useApp } from '../context/AppContext';
import {
  buildWhatsAppUrl,
  validateContactPayload,
} from '../lib/real-estate';

export function ContactPage() {
  const { settings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(
    settings.whatsapp,
    'Olá! Gostaria de falar com a equipe da Esparta Imobiliária.'
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = validateContactPayload({
      name,
      email,
      phone,
      subject,
      message,
    });
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao enviar mensagem.');
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Erro ao enviar mensagem.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <section className="bg-[#111111] text-white py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#F47721]">
            Canais Oficiais
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            Fale com a ESPARTA IMOBILIÁRIA
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            Atendimento presencial em nossa sede em Teresina (PI) ou direto pelo
            WhatsApp para toda a região do Piauí e Timon (MA).
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#111111]">
              Informações de Contato
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    WhatsApp Comercial
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#111111] hover:text-[#F47721] tabular-nums"
                  >
                    Iniciar conversa imediata →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    Telefone de Contato
                  </p>
                  <p className="font-semibold text-[#111111] tabular-nums">
                    {settings.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">E-mail</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-semibold text-[#111111] hover:text-[#F47721] break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    Endereço da Sede
                  </p>
                  <p className="font-medium text-[#111111]">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    Horário de Atendimento
                  </p>
                  <p className="font-medium text-[#111111]">
                    {settings.businessHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#F47721] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-500">
                    Registro Profissional
                  </p>
                  <p className="font-semibold text-[#111111] tabular-nums">
                    {settings.creci}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500 mb-3">
                Redes Sociais
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border border-zinc-200 rounded-md hover:border-[#F47721] text-[#111111]"
                >
                  <Instagram className="w-4 h-4 text-[#F47721]" />
                  Instagram
                </a>
                <a
                  href={settings.facebookUrl || 'https://www.facebook.com/p/Esparta-imob-61565846159585/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border border-zinc-200 rounded-md hover:border-[#F47721] text-[#111111]"
                >
                  <Facebook className="w-4 h-4 text-[#F47721]" />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <LocationMap
            title="ESPARTA IMOB · Teresina/PI"
            address={settings.address}
            latitude="-5.0835"
            longitude="-42.7712"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-[#111111]">
            Envie uma mensagem
          </h2>
          <p className="text-sm text-zinc-600 mt-1 mb-6">
            Deseja vender seu imóvel com a Esparta, agendar uma visita ou tirar
            dúvidas? Responderemos rapidamente.
          </p>

          {submitted ? (
            <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-lg text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#F47721] mx-auto" />
              <h3 className="font-display text-xl font-bold text-[#111111]">
                Mensagem recebida com sucesso
              </h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Obrigado por entrar em contato com a ESPARTA IMOBILIÁRIA. Nossa
                equipe retornará em breve.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 text-sm font-semibold text-[#111111] border border-zinc-300 rounded-md hover:bg-zinc-100 cursor-pointer"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {errors.form && (
                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                  {errors.form}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Nome completo
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(86) 99999-9999"
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="contact-email"
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
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Assunto
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex.: Anunciar meu imóvel, Visita..."
                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-600 mt-1">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  Mensagem
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva sua necessidade com detalhes..."
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
                {errors.message && (
                  <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
