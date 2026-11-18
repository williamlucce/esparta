import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  Launch,
  Property,
  SiteSettings,
  Testimonial,
  UserProfile,
} from '../types';

interface AppContextValue {
  properties: Property[];
  launches: Launch[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  favoriteIds: number[];
  user: UserProfile | null;
  authToken: string | null;
  consultantModalOpen: boolean;
  setConsultantModalOpen: (open: boolean) => void;
  refreshData: () => Promise<void>;
  toggleFavorite: (propertyId: number) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<UserProfile>;
  registerClient: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  key: 'default',
  whatsapp: '5586981331132',
  phone: '(86) 98133-1132',
  email: 'marcelodeassisveras@gmail.com',
  address: 'ESPARTA IMOB, EDIF HOTEL EXPRESS ARREY - Av. João XXIII, 3800 - SALA 9 - Recanto das Palmeiras, Teresina - PI, 64045-795',
  businessHours: 'Seg a Sex: 07h às 19h · Sáb: 07h às 14h',
  instagramUrl: 'https://www.instagram.com/esparta_imob/',
  facebookUrl: 'https://www.facebook.com/p/Esparta-imob-61565846159585/',
  linkedinUrl: 'https://linkedin.com/company/espartaimobiliaria',
  youtubeUrl: 'https://youtube.com/@espartaimobiliaria',
  creci: 'CRECI 0727/PJ',
  totalVisits: 3840,
};

const GUEST_FAVORITES_KEY = 'esparta_guest_favorites';

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [consultantModalOpen, setConsultantModalOpen] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(GUEST_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const refreshData = useCallback(async (trackVisit = false) => {
    try {
      setError(null);
      const res = await fetch(`/api/bootstrap${trackVisit ? '?visit=1' : ''}`);
      if (!res.ok) {
        throw new Error('Não foi possível carregar os imóveis.');
      }
      const data = await res.json();
      setProperties(data.properties || []);
      setLaunches(data.launches || []);
      setTestimonials(data.testimonials || []);
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar informações.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const visited = sessionStorage.getItem('esparta_visited');
    if (!visited) {
      sessionStorage.setItem('esparta_visited', '1');
      refreshData(true);
    } else {
      refreshData(false);
    }
  }, [refreshData]);

  // Listen to Firebase Auth state (for Google Sign-In persistence within Firebase SDK)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          setAuthToken(token);
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            if (Array.isArray(data.favoriteIds)) {
              setFavoriteIds(data.favoriteIds);
            }
          }
        } catch {
          // Ignore transient Firebase check errors
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      if (authToken && user) {
        try {
          const res = await fetch('/api/favorites/toggle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ propertyId }),
          });
          if (res.ok) {
            const data = await res.json();
            setFavoriteIds(data.favoriteIds || []);
            return;
          }
        } catch {
          // Fallback below
        }
      }

      setFavoriteIds((prev) => {
        const exists = prev.includes(propertyId);
        const next = exists
          ? prev.filter((id) => id !== propertyId)
          : [...prev, propertyId];
        try {
          localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota issues
        }
        return next;
      });
    },
    [authToken, user]
  );

  const loginWithPassword = useCallback(
    async (email: string, password: string): Promise<UserProfile> => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha na autenticação.');
      }
      setAuthToken(data.token);
      setUser(data.user);

      // Sync server favorites
      const favRes = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (favRes.ok) {
        const favData = await favRes.json();
        setFavoriteIds(favData.favoriteIds || []);
      }

      return data.user;
    },
    []
  );

  const registerClient = useCallback(
    async (payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }): Promise<UserProfile> => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível concluir o cadastro.');
      }
      setAuthToken(data.token);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const loginWithGoogle = useCallback(async (): Promise<UserProfile> => {
    const cred = await signInWithPopup(auth, googleAuthProvider);
    const token = await cred.user.getIdToken();
    setAuthToken(token);
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Erro ao sincronizar conta Google.');
    }
    const data = await res.json();
    setUser(data.user);
    setFavoriteIds(data.favoriteIds || []);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // Ignore if not signed in via Firebase
    }
    try {
      const saved = localStorage.getItem(GUEST_FAVORITES_KEY);
      setFavoriteIds(saved ? JSON.parse(saved) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        properties,
        launches,
        testimonials,
        settings,
        loading,
        error,
        favoriteIds,
        user,
        authToken,
        consultantModalOpen,
        setConsultantModalOpen,
        refreshData: () => refreshData(false),
        toggleFavorite,
        loginWithPassword,
        registerClient,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
