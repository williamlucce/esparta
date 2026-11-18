import {
  BarChart3,
  Building,
  Building2,
  Edit3,
  Eye,
  Lock,
  LogOut,
  Mail,
  MessageSquareQuote,
  Plus,
  Settings,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { PropertyImage } from '../components/PropertyImage';
import { useApp } from '../context/AppContext';
import { GALLERY_PRESETS } from '../lib/assetImages';
import { formatBRL } from '../lib/real-estate';
import {
  ContactMessage,
  Launch,
  Lead,
  Property,
  SiteSettings,
  Testimonial,
} from '../types';

type AdminTab =
  | 'overview'
  | 'properties'
  | 'launches'
  | 'leads'
  | 'messages'
  | 'testimonials'
  | 'settings';

interface AdminOverviewData {
  properties: Property[];
  launches: Launch[];
  leads: Lead[];
  messages: ContactMessage[];
  testimonials: Testimonial[];
  settings: SiteSettings | null;
  clients: Array<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
  }>;
}

const EMPTY_PROPERTY_FORM = {
  id: 0,
  title: '',
  description: '',
  transactionType: 'venda',
  propertyType: 'Apartamento',
  price: 3500000,
  condoFee: 2500,
  iptu: 900,
  city: 'São Paulo',
  neighborhood: 'Jardins',
  address: '',
  areaSqm: 220,
  bedrooms: 3,
  suites: 3,
  bathrooms: 4,
  parkingSpots: 3,
  featuresText: 'Varanda gourmet, Automação residencial, Portaria 24h',
  images: ['/src/assets/images/prop_penthouse_living_1794686197879.jpg'],
  featured: false,
  mostSearched: false,
  exclusive: false,
  status: 'ativo',
};

export function AdminPage() {
  const {
    user,
    authToken,
    loginWithPassword,
    loginWithGoogle,
    logout,
    refreshData,
  } = useApp();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Property Editor Modal
  const [propModalOpen, setPropModalOpen] = useState(false);
  const [propForm, setPropForm] = useState(EMPTY_PROPERTY_FORM);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingProp, setSavingProp] = useState(false);

  // Launch Form Modal
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [launchForm, setLaunchForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    developer: '',
    city: 'São Paulo',
    neighborhood: 'Itaim Bibi',
    address: '',
    startingPrice: 4200000,
    deliveryForecast: 'Dezembro / 2027',
    areaRange: '180m² a 320m²',
    suitesRange: '3 a 4 suítes',
    parkingRange: '2 a 4 vagas',
    differentialsText: 'Rooftop lounge, Academia completa, Carregador EV',
    image: '/src/assets/images/launch_horizon_tower_1794686200386.jpg',
  });

  // Testimonial Form
  const [testForm, setTestForm] = useState({
    clientName: '',
    clientRole: '',
    quote: '',
    outcome: '',
  });

  // Settings Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  const loadOverview = useCallback(async () => {
    if (!authToken || user?.role !== 'admin') return;
    setLoadingOverview(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error('Erro ao carregar dados administrativos.');
      const data = (await res.json()) as AdminOverviewData;
      setOverview(data);
      if (data.settings) setSettingsForm(data.settings);
    } catch (err) {
      setStatusFeedback(
        err instanceof Error ? err.message : 'Erro ao carregar painel.'
      );
    } finally {
      setLoadingOverview(false);
    }
  }, [authToken, user]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const logged = await loginWithPassword(loginEmail, loginPassword);
      if (logged.role !== 'admin') {
        setLoginError(
          'Esta conta não possui permissão administrativa. Use o acesso de administrador.'
        );
      }
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : 'Credenciais inválidas.'
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function showToast(msg: string) {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(null), 4000);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !authToken) return;
    setUploadingPhoto(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
          reader.readAsDataURL(file);
        });
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ filename: file.name, dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro no upload.');
        uploadedUrls.push(data.url);
      }
      setPropForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      showToast('Foto(s) enviada(s) com sucesso.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar foto.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  function openNewPropertyModal() {
    setPropForm(EMPTY_PROPERTY_FORM);
    setNewPhotoUrl('');
    setPropModalOpen(true);
  }

  function openEditPropertyModal(prop: Property) {
    setPropForm({
      id: prop.id,
      title: prop.title,
      description: prop.description,
      transactionType: prop.transactionType,
      propertyType: prop.propertyType,
      price: prop.price,
      condoFee: prop.condoFee,
      iptu: prop.iptu,
      city: prop.city,
      neighborhood: prop.neighborhood,
      address: prop.address,
      areaSqm: prop.areaSqm,
      bedrooms: prop.bedrooms,
      suites: prop.suites,
      bathrooms: prop.bathrooms,
      parkingSpots: prop.parkingSpots,
      featuresText: (prop.features || []).join(', '),
      images: prop.images || [],
      featured: prop.featured,
      mostSearched: prop.mostSearched,
      exclusive: prop.exclusive,
      status: prop.status,
    });
    setNewPhotoUrl('');
    setPropModalOpen(true);
  }

  async function handleSaveProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!authToken) return;
    setSavingProp(true);
    try {
      const payload = {
        ...propForm,
        features: propForm.featuresText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const isEdit = propForm.id > 0;
      const res = await fetch(
        isEdit
          ? `/api/admin/properties/${propForm.id}`
          : '/api/admin/properties',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar imóvel.');
      setPropModalOpen(false);
      await loadOverview();
      await refreshData();
      showToast(
        isEdit
          ? 'Imóvel atualizado com sucesso.'
          : 'Novo imóvel cadastrado no catálogo.'
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao salvar imóvel.');
    } finally {
      setSavingProp(false);
    }
  }

  async function handleDeleteProperty(id: number) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await loadOverview();
      await refreshData();
      showToast('Imóvel excluído.');
    }
  }

  async function handleToggleFeatured(prop: Property) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/properties/${prop.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ ...prop, featured: !prop.featured }),
    });
    if (res.ok) {
      await loadOverview();
      await refreshData();
      showToast('Status de destaque atualizado.');
    }
  }

  async function handleSaveLaunch(e: React.FormEvent) {
    e.preventDefault();
    if (!authToken) return;
    const res = await fetch('/api/admin/launches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...launchForm,
        differentials: launchForm.differentialsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        images: [launchForm.image],
      }),
    });
    if (res.ok) {
      setLaunchModalOpen(false);
      await loadOverview();
      await refreshData();
      showToast('Lançamento cadastrado com sucesso.');
    }
  }

  async function handleDeleteLaunch(id: number) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/launches/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await loadOverview();
      await refreshData();
      showToast('Lançamento excluído.');
    }
  }

  async function handleLeadStatusChange(id: number, status: string) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await loadOverview();
      showToast('Status do interessado atualizado.');
    }
  }

  async function handleMessageStatusChange(id: number, status: string) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await loadOverview();
      showToast('Status da mensagem atualizado.');
    }
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    if (!authToken) return;
    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(testForm),
    });
    if (res.ok) {
      setTestForm({ clientName: '', clientRole: '', quote: '', outcome: '' });
      await loadOverview();
      await refreshData();
      showToast('Depoimento adicionado.');
    }
  }

  async function handleDeleteTestimonial(id: number) {
    if (!authToken) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await loadOverview();
      await refreshData();
      showToast('Depoimento excluído.');
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!authToken || !settingsForm) return;
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(settingsForm),
    });
    if (res.ok) {
      await loadOverview();
      await refreshData();
      showToast('Informações de contato atualizadas em todo o site.');
    }
  }

  // Admin Login Gate
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] bg-[#111111] text-white flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#18181B] border border-white/10 rounded-lg p-8 space-y-6">
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-md bg-[#F47721]/15 text-[#F47721] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              Painel Administrativo Esparta
            </h1>
            <p className="text-xs text-zinc-400">
              Acesso exclusivo para gestão de imóveis, lançamentos, leads e
              configurações do portal.
            </p>
          </div>

          {loginError && (
            <div className="p-3 text-xs text-red-300 bg-red-950/50 border border-red-800 rounded-md">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-zinc-300 mb-1"
              >
                E-mail Administrativo
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@espartaimobiliaria.com.br"
                className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F47721]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-zinc-300 mb-1"
              >
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/15 rounded-md text-white focus:outline-none focus:border-[#F47721]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md transition-colors cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? 'Autenticando...' : 'Entrar no Painel'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => loginWithGoogle().catch(() => {})}
            className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-200 border border-white/15 hover:border-white/40 rounded-md transition-colors cursor-pointer"
          >
            Entrar com Conta Google Autorizada
          </button>

          <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">
              Credenciais iniciais do responsável:
            </p>
            <p className="tabular-nums">
              E-mail: admin@espartaimobiliaria.com.br
            </p>
            <p className="tabular-nums">Senha: Esparta@2026</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPropertyViews = (overview?.properties || []).reduce(
    (sum, p) => sum + (p.viewsCount || 0),
    0
  );
  const unreadMessages = (overview?.messages || []).filter(
    (m) => m.status === 'nao_lida'
  ).length;

  const TABS: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'overview',
      label: 'Estatísticas',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'properties',
      label: `Imóveis (${overview?.properties.length ?? 0})`,
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: 'launches',
      label: `Lançamentos (${overview?.launches.length ?? 0})`,
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'leads',
      label: `Interessados (${overview?.leads.length ?? 0})`,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'messages',
      label: `Mensagens (${overview?.messages.length ?? 0})`,
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: 'testimonials',
      label: 'Depoimentos',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Contatos do Site',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="bg-[#111111] text-white rounded-lg px-6 py-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#F47721]">
              Gestão Esparta Imobiliária
            </p>
            <h1 className="font-display text-xl font-bold">
              Painel Administrativo
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-300">{user.email}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white border border-white/20 hover:border-[#F47721] rounded-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>

        {statusFeedback && (
          <div className="mb-6 px-4 py-3 text-sm font-medium text-white bg-[#111111] border border-[#F47721] rounded-md">
            {statusFeedback}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white border border-zinc-200 rounded-lg p-2 space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-md transition-colors cursor-pointer text-left ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span
                  className={
                    activeTab === tab.id ? 'text-[#F47721]' : 'text-zinc-500'
                  }
                >
                  {tab.icon}
                </span>
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* Main Workspace */}
          <div className="lg:col-span-9 space-y-6">
            {loadingOverview && !overview ? (
              <div className="h-64 bg-white border border-zinc-200 rounded-lg animate-pulse" />
            ) : (
              <>
                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && overview && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white border border-zinc-200 rounded-lg p-5">
                        <p className="text-xs text-zinc-500">
                          Acessos ao Portal
                        </p>
                        <p className="font-display text-2xl font-bold text-[#111111] tabular-nums mt-1">
                          {overview.settings?.totalVisits ?? 0}
                        </p>
                      </div>
                      <div className="bg-white border border-zinc-200 rounded-lg p-5">
                        <p className="text-xs text-zinc-500">
                          Visualizações em Imóveis
                        </p>
                        <p className="font-display text-2xl font-bold text-[#111111] tabular-nums mt-1">
                          {totalPropertyViews}
                        </p>
                      </div>
                      <div className="bg-white border border-zinc-200 rounded-lg p-5">
                        <p className="text-xs text-zinc-500">
                          Clientes Interessados
                        </p>
                        <p className="font-display text-2xl font-bold text-[#F47721] tabular-nums mt-1">
                          {overview.leads.length}
                        </p>
                      </div>
                      <div className="bg-white border border-zinc-200 rounded-lg p-5">
                        <p className="text-xs text-zinc-500">
                          Mensagens Não Lidas
                        </p>
                        <p className="font-display text-2xl font-bold text-[#111111] tabular-nums mt-1">
                          {unreadMessages}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-lg p-6">
                      <h2 className="font-display text-lg font-bold text-[#111111] mb-4">
                        Imóveis Mais Visualizados
                      </h2>
                      <div className="divide-y divide-zinc-100">
                        {[...overview.properties]
                          .sort((a, b) => b.viewsCount - a.viewsCount)
                          .slice(0, 5)
                          .map((p) => (
                            <div
                              key={p.id}
                              className="py-3 flex items-center justify-between gap-4 text-sm"
                            >
                              <div>
                                <p className="font-semibold text-[#111111]">
                                  {p.title}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {p.transactionType === 'aluguel'
                                    ? 'Aluguel'
                                    : 'Venda'}{' '}
                                  · {p.neighborhood} · {formatBRL(p.price)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 tabular-nums">
                                <Eye className="w-4 h-4 text-[#F47721]" />
                                {p.viewsCount} acessos
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PROPERTIES */}
                {activeTab === 'properties' && overview && (
                  <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#111111]">
                          Gerenciar Imóveis
                        </h2>
                        <p className="text-xs text-zinc-500">
                          Cadastre, edite preços, adicione fotos ou altere o
                          destaque na página inicial.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openNewPropertyModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Novo Imóvel
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                            <th className="py-2.5 pr-4 font-semibold">Imóvel</th>
                            <th className="py-2.5 px-3 font-semibold">Tipo</th>
                            <th className="py-2.5 px-3 font-semibold">Preço</th>
                            <th className="py-2.5 px-3 font-semibold">
                              Destaque
                            </th>
                            <th className="py-2.5 pl-3 text-right font-semibold">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {overview.properties.map((prop) => (
                            <tr key={prop.id} className="hover:bg-zinc-50">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-9 rounded overflow-hidden bg-zinc-200 shrink-0">
                                    <PropertyImage
                                      src={prop.images?.[0]}
                                      alt={prop.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[#111111] line-clamp-1">
                                      {prop.title}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                      {prop.neighborhood}, {prop.city}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-xs font-medium text-zinc-700 whitespace-nowrap">
                                {prop.transactionType === 'aluguel'
                                  ? 'Aluguel'
                                  : 'Venda'}{' '}
                                · {prop.propertyType}
                              </td>
                              <td className="py-3 px-3 font-semibold text-[#111111] tabular-nums whitespace-nowrap">
                                {formatBRL(prop.price)}
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatured(prop)}
                                  aria-label={`Alternar destaque para ${prop.title}`}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border cursor-pointer ${
                                    prop.featured
                                      ? 'bg-[#F47721]/10 text-[#F47721] border-[#F47721]/40'
                                      : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                  }`}
                                >
                                  <Star
                                    className={`w-3 h-3 ${
                                      prop.featured ? 'fill-[#F47721]' : ''
                                    }`}
                                  />
                                  {prop.featured ? 'Sim' : 'Não'}
                                </button>
                              </td>
                              <td className="py-3 pl-3 text-right whitespace-nowrap space-x-2">
                                <button
                                  type="button"
                                  onClick={() => openEditPropertyModal(prop)}
                                  aria-label={`Editar ${prop.title}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#111111] border border-zinc-300 rounded hover:border-[#F47721] cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProperty(prop.id)}
                                  aria-label={`Excluir ${prop.title}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB: LAUNCHES */}
                {activeTab === 'launches' && overview && (
                  <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-display text-xl font-bold text-[#111111]">
                        Lançamentos Cadastrados
                      </h2>
                      <button
                        type="button"
                        onClick={() => setLaunchModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Novo Lançamento
                      </button>
                    </div>

                    <div className="divide-y divide-zinc-200">
                      {overview.launches.map((l) => (
                        <div
                          key={l.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <h3 className="font-display text-base font-bold text-[#111111]">
                              {l.title}
                            </h3>
                            <p className="text-xs text-zinc-500">
                              Construtora: {l.developer} · {l.neighborhood},{' '}
                              {l.city} · Entrega: {l.deliveryForecast}
                            </p>
                            <p className="text-sm font-semibold text-[#F47721] tabular-nums mt-1">
                              A partir de {formatBRL(l.startingPrice)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteLaunch(l.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded hover:bg-red-50 cursor-pointer self-start"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: LEADS */}
                {activeTab === 'leads' && overview && (
                  <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
                    <h2 className="font-display text-xl font-bold text-[#111111]">
                      Clientes Interessados & Agendamentos
                    </h2>
                    {overview.leads.length === 0 ? (
                      <p className="text-sm text-zinc-500 py-8 text-center">
                        Nenhum lead registrado ainda.
                      </p>
                    ) : (
                      <div className="divide-y divide-zinc-200">
                        {overview.leads.map((lead) => (
                          <div
                            key={lead.id}
                            className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                <span className="font-semibold text-[#F47721]">
                                  {lead.interestType}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">
                                  {new Date(lead.createdAt).toLocaleDateString(
                                    'pt-BR'
                                  )}
                                </span>
                                {lead.preferredDate && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>Visita: {lead.preferredDate}</span>
                                  </>
                                )}
                              </div>
                              <p className="font-semibold text-[#111111]">
                                {lead.name}
                              </p>
                              <p className="text-xs text-zinc-600">
                                {lead.email} · {lead.phone}
                              </p>
                              <p className="text-sm text-zinc-700 pt-1">
                                {lead.message}
                              </p>
                            </div>

                            <select
                              aria-label={`Alterar status de ${lead.name}`}
                              value={lead.status}
                              onChange={(e) =>
                                handleLeadStatusChange(lead.id, e.target.value)
                              }
                              className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 rounded bg-white"
                            >
                              <option value="novo">Novo</option>
                              <option value="em_atendimento">
                                Em Atendimento
                              </option>
                              <option value="visitado">Visitado</option>
                              <option value="convertido">Convertido</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: MESSAGES */}
                {activeTab === 'messages' && overview && (
                  <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
                    <h2 className="font-display text-xl font-bold text-[#111111]">
                      Mensagens Recebidas
                    </h2>
                    {overview.messages.length === 0 ? (
                      <p className="text-sm text-zinc-500 py-8 text-center">
                        Nenhuma mensagem recebida pelo formulário de contato.
                      </p>
                    ) : (
                      <div className="divide-y divide-zinc-200">
                        {overview.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-[#F47721]">
                                {msg.subject}
                              </p>
                              <p className="font-semibold text-[#111111]">
                                {msg.name} ({msg.phone})
                              </p>
                              <p className="text-xs text-zinc-500">{msg.email}</p>
                              <p className="text-sm text-zinc-700 pt-1">
                                {msg.message}
                              </p>
                            </div>
                            <select
                              aria-label={`Status da mensagem de ${msg.name}`}
                              value={msg.status}
                              onChange={(e) =>
                                handleMessageStatusChange(
                                  msg.id,
                                  e.target.value
                                )
                              }
                              className="px-3 py-1.5 text-xs font-semibold border border-zinc-300 rounded bg-white"
                            >
                              <option value="nao_lida">Não lida</option>
                              <option value="lida">Lida</option>
                              <option value="respondida">Respondida</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: TESTIMONIALS */}
                {activeTab === 'testimonials' && overview && (
                  <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-6">
                    <h2 className="font-display text-xl font-bold text-[#111111]">
                      Gerenciar Depoimentos
                    </h2>

                    <form
                      onSubmit={handleAddTestimonial}
                      className="p-4 bg-zinc-50 border border-zinc-200 rounded-md space-y-3"
                    >
                      <p className="text-xs font-semibold text-zinc-700">
                        Adicionar novo depoimento
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          required
                          value={testForm.clientName}
                          onChange={(e) =>
                            setTestForm({
                              ...testForm,
                              clientName: e.target.value,
                            })
                          }
                          placeholder="Nome do cliente"
                          className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white"
                        />
                        <input
                          type="text"
                          required
                          value={testForm.clientRole}
                          onChange={(e) =>
                            setTestForm({
                              ...testForm,
                              clientRole: e.target.value,
                            })
                          }
                          placeholder="Cargo / Empresa"
                          className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white"
                        />
                        <input
                          type="text"
                          required
                          value={testForm.outcome}
                          onChange={(e) =>
                            setTestForm({
                              ...testForm,
                              outcome: e.target.value,
                            })
                          }
                          placeholder="Resultado (ex.: Compra em 15 dias)"
                          className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        value={testForm.quote}
                        onChange={(e) =>
                          setTestForm({ ...testForm, quote: e.target.value })
                        }
                        placeholder="Depoimento do cliente..."
                        className="w-full px-3 py-2 text-sm border border-zinc-300 rounded bg-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded cursor-pointer"
                      >
                        Publicar depoimento
                      </button>
                    </form>

                    <div className="divide-y divide-zinc-200">
                      {overview.testimonials.map((t) => (
                        <div
                          key={t.id}
                          className="py-4 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold text-[#111111]">
                              {t.clientName}{' '}
                              <span className="text-xs font-normal text-zinc-500">
                                — {t.clientRole}
                              </span>
                            </p>
                            <p className="text-sm text-zinc-700">“{t.quote}”</p>
                            <p className="text-xs font-semibold text-[#F47721]">
                              {t.outcome}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="text-xs font-semibold text-red-600 hover:underline cursor-pointer shrink-0"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: SETTINGS */}
                {activeTab === 'settings' && settingsForm && (
                  <form
                    onSubmit={handleSaveSettings}
                    className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4"
                  >
                    <h2 className="font-display text-xl font-bold text-[#111111]">
                      Informações de Contato & Redes Sociais
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          WhatsApp (apenas dígitos com DDD)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsapp}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              whatsapp: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Telefone Fixo
                        </label>
                        <input
                          type="text"
                          value={settingsForm.phone}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          E-mail de Atendimento
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          CRECI
                        </label>
                        <input
                          type="text"
                          value={settingsForm.creci}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              creci: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Endereço da Sede
                        </label>
                        <input
                          type="text"
                          value={settingsForm.address}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Horário de Atendimento
                        </label>
                        <input
                          type="text"
                          value={settingsForm.businessHours}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              businessHours: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={settingsForm.instagramUrl}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              instagramUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={settingsForm.facebookUrl || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              facebookUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md cursor-pointer"
                    >
                      Salvar alterações
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* PROPERTY CREATE/EDIT MODAL */}
      {propModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-zinc-200">
            <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="font-display text-lg font-bold">
                {propForm.id > 0 ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
              </h2>
              <button
                type="button"
                onClick={() => setPropModalOpen(false)}
                aria-label="Fechar modal de imóvel"
                className="text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Título do Imóvel
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.title}
                    onChange={(e) =>
                      setPropForm({ ...propForm, title: e.target.value })
                    }
                    placeholder="Ex.: Cobertura Duplex Jardim Paulista"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Finalidade
                  </label>
                  <select
                    value={propForm.transactionType}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        transactionType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white"
                  >
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) =>
                      setPropForm({ ...propForm, propertyType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md bg-white"
                  >
                    <option value="Casa">Casa</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Condomínio">Condomínio</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    required
                    value={propForm.price}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    required
                    value={propForm.areaSqm}
                    onChange={(e) =>
                      setPropForm({
                        ...propForm,
                        areaSqm: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.city}
                    onChange={(e) =>
                      setPropForm({ ...propForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.neighborhood}
                    onChange={(e) =>
                      setPropForm({ ...propForm, neighborhood: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Endereço completo ou aproximado
                  </label>
                  <input
                    type="text"
                    value={propForm.address}
                    onChange={(e) =>
                      setPropForm({ ...propForm, address: e.target.value })
                    }
                    placeholder="Rua, número aproximado e bairro"
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-4 gap-3 sm:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Quartos
                    </label>
                    <input
                      type="number"
                      value={propForm.bedrooms}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          bedrooms: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Suítes
                    </label>
                    <input
                      type="number"
                      value={propForm.suites}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          suites: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      value={propForm.bathrooms}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          bathrooms: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Vagas
                    </label>
                    <input
                      type="number"
                      value={propForm.parkingSpots}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          parkingSpots: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Descrição completa
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={propForm.description}
                    onChange={(e) =>
                      setPropForm({ ...propForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Diferenciais (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={propForm.featuresText}
                    onChange={(e) =>
                      setPropForm({ ...propForm, featuresText: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
                  />
                </div>

                {/* Multi-photo manager */}
                <div className="sm:col-span-2 space-y-3 p-4 bg-zinc-50 border border-zinc-200 rounded-md">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-zinc-700">
                      Fotos do Imóvel ({propForm.images.length})
                    </span>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#111111] hover:bg-[#F47721] rounded cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingPhoto ? 'Enviando...' : 'Upload de Imagens'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Ou cole uma URL de imagem..."
                      className="flex-1 px-3 py-1.5 text-xs border border-zinc-300 rounded bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPhotoUrl.trim()) return;
                        setPropForm((prev) => ({
                          ...prev,
                          images: [...prev.images, newPhotoUrl.trim()],
                        }));
                        setNewPhotoUrl('');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 rounded cursor-pointer"
                    >
                      Adicionar URL
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {GALLERY_PRESETS.slice(0, 5).map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() =>
                          setPropForm((prev) => ({
                            ...prev,
                            images: prev.images.includes(preset.url)
                              ? prev.images
                              : [...prev.images, preset.url],
                          }))
                        }
                        className="px-2 py-1 text-[11px] bg-white border border-zinc-200 rounded hover:border-[#F47721] cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {propForm.images.map((img, i) => (
                      <div
                        key={`${img}-${i}`}
                        className="relative aspect-[4/3] rounded overflow-hidden border border-zinc-300"
                      >
                        <PropertyImage
                          src={img}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPropForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== i),
                            }))
                          }
                          aria-label="Remover foto"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center text-xs cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-5 pt-2">
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={propForm.featured}
                      onChange={(e) =>
                        setPropForm({ ...propForm, featured: e.target.checked })
                      }
                    />
                    Marcar como Destaque
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={propForm.mostSearched}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          mostSearched: e.target.checked,
                        })
                      }
                    />
                    Mais Procurado
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={propForm.exclusive}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          exclusive: e.target.checked,
                        })
                      }
                    />
                    Exclusivo Esparta
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPropModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 border border-zinc-300 rounded-md cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingProp}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#F47721] hover:bg-[#DC6514] rounded-md cursor-pointer disabled:opacity-60"
                >
                  {savingProp ? 'Salvando...' : 'Salvar Imóvel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LAUNCH CREATE MODAL */}
      {launchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg w-full max-w-xl border border-zinc-200 overflow-hidden">
            <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Cadastrar Lançamento
              </h2>
              <button
                type="button"
                onClick={() => setLaunchModalOpen(false)}
                className="text-zinc-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLaunch} className="p-6 space-y-3">
              <input
                type="text"
                required
                placeholder="Nome do empreendimento"
                value={launchForm.title}
                onChange={(e) =>
                  setLaunchForm({ ...launchForm, title: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
              />
              <input
                type="text"
                required
                placeholder="Subtítulo de destaque"
                value={launchForm.subtitle}
                onChange={(e) =>
                  setLaunchForm({ ...launchForm, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Construtora"
                  value={launchForm.developer}
                  onChange={(e) =>
                    setLaunchForm({ ...launchForm, developer: e.target.value })
                  }
                  className="px-3 py-2 text-sm border border-zinc-300 rounded-md"
                />
                <input
                  type="number"
                  required
                  placeholder="Valor inicial (R$)"
                  value={launchForm.startingPrice}
                  onChange={(e) =>
                    setLaunchForm({
                      ...launchForm,
                      startingPrice: Number(e.target.value),
                    })
                  }
                  className="px-3 py-2 text-sm border border-zinc-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bairro"
                  value={launchForm.neighborhood}
                  onChange={(e) =>
                    setLaunchForm({
                      ...launchForm,
                      neighborhood: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-zinc-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Previsão de entrega"
                  value={launchForm.deliveryForecast}
                  onChange={(e) =>
                    setLaunchForm({
                      ...launchForm,
                      deliveryForecast: e.target.value,
                    })
                  }
                  className="px-3 py-2 text-sm border border-zinc-300 rounded-md"
                />
              </div>
              <textarea
                rows={3}
                required
                placeholder="Descrição do empreendimento..."
                value={launchForm.description}
                onChange={(e) =>
                  setLaunchForm({ ...launchForm, description: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLaunchModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-zinc-300 rounded-md cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#F47721] rounded-md cursor-pointer"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
