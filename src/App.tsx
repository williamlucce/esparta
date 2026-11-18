/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ConsultantModal } from './components/ConsultantModal';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { AppProvider } from './context/AppContext';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { CatalogPage } from './pages/CatalogPage';
import { ContactPage } from './pages/ContactPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HomePage } from './pages/HomePage';
import { LaunchesPage } from './pages/LaunchesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-[#111111]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/comprar" element={<CatalogPage mode="venda" />} />
              <Route path="/alugar" element={<CatalogPage mode="aluguel" />} />
              <Route path="/imovel/:slug" element={<PropertyDetailPage />} />
              <Route path="/lancamentos" element={<LaunchesPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/minha-conta" element={<AccountPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <ConsultantModal />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
