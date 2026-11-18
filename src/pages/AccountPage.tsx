import { LogOut, Shield, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function AccountPage() {
  const {
    user,
    favoriteIds,
    loginWithPassword,
    registerClient,
    loginWithGoogle,
    logout,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await registerClient({ name, email, phone, password });
      } else {
        await loginWithPassword(email, password);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao processar solicitação.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível conectar com o Google.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-zinc-50 min-h-[75vh]">
      <section className="bg-[#111111] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#F47721]">
            Portal do Cliente Esparta
          </p>
          <h1 className="font-display text-3xl font-bold mt-1">
            Cadastro e Área do Cliente
          </h1>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 py-12">
        {user ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#111111] text-[#F47721] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#111111]">
                    {user.name}
                  </h2>
                  <p className="text-sm text-zinc-600">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 border border-zinc-300 rounded-md hover:bg-zinc-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-md flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Favoritos sincronizados</p>
                <p className="font-display text-lg font-bold text-[#111111] tabular-nums">
                  {favoriteIds.length} imóveis salvos
                </p>
              </div>
              <Link
                to="/favoritos"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded-md"
              >
                Ver favoritos
              </Link>
            </div>

            {user.role === 'admin' && (
              <div className="p-4 bg-[#111111] text-white rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-[#F47721]" />
                  <span className="text-sm font-semibold">
                    Perfil Administrativo Autorizado
                  </span>
                </div>
                <Link
                  to="/admin"
                  className="px-4 py-2 text-xs font-semibold bg-[#F47721] hover:bg-[#DC6514] rounded-md"
                >
                  Abrir Painel Admin
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex p-1 bg-zinc-100 rounded-md">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#111111] text-white'
                    : 'text-zinc-600 hover:text-[#111111]'
                }`}
              >
                Criar Cadastro
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#111111] text-white'
                    : 'text-zinc-600 hover:text-[#111111]'
                }`}
              >
                Já tenho conta
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label
                      htmlFor="client-name"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Nome completo
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="client-phone"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      WhatsApp / Telefone
                    </label>
                    <input
                      id="client-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                    />
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="client-email"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  E-mail
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com.br"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
              </div>

              <div>
                <label
                  htmlFor="client-password"
                  className="block text-xs font-semibold text-zinc-700 mb-1"
                >
                  Senha
                </label>
                <input
                  id="client-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-md focus:outline-none focus:border-[#F47721]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer disabled:opacity-60"
              >
                {submitting
                  ? 'Processando...'
                  : mode === 'register'
                  ? 'Cadastrar minha conta'
                  : 'Entrar na minha conta'}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-200" />
              <span className="shrink mx-4 text-xs text-zinc-400">ou</span>
              <div className="flex-grow border-t border-zinc-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="w-full py-2.5 px-4 text-sm font-semibold text-[#111111] bg-white border border-zinc-300 hover:border-[#111111] rounded-md transition-colors cursor-pointer"
            >
              Continuar com Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
