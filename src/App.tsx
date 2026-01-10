import React from 'react';
import { BrowserRouter as Router, useLocation, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

import FullScreenLoader from '@/components/FullScreenLoader';

const Home = React.lazy(() => import('@/pages/Home'));
const About = React.lazy(() => import('@/pages/About'));
const Services = React.lazy(() => import('@/pages/Services'));
const Packages = React.lazy(() => import('@/pages/Packages'));
const Portfolio = React.lazy(() => import('@/pages/Portfolio'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Login = React.lazy(() => import('@/pages/Login'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const VendorManagement = React.lazy(() => import('@/pages/VendorManagement'));
const ViewVendor = React.lazy(() => import('@/pages/ViewVendor'));

import ScrollToTop from '@/components/ScrollToTop';

const BackgroundAnimation = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Pink Blob */}
    <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
    {/* Orange Blob */}
    <div className="absolute top-0 -right-4 w-96 h-96 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    {/* Blue Blob */}
    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    {/* Grid Overlay for Texture */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
  </div>
);

const AdminLayout = React.lazy(() => import('@/components/AdminLayout'));
const ClientLedger = React.lazy(() => import('@/pages/ClientLedger'));
const ClientDetail = React.lazy(() => import('@/pages/ClientDetail'));

const AppContent = () => {
  const location = useLocation();
  const isAdmin = ['/dashboard', '/vendors', '/clients', '/admin-portal-secure-access'].some(path => location.pathname.startsWith(path));
  const [initialLoad, setInitialLoad] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial asset loading/app preparation for smoother entrance
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
      <div className="flex flex-col min-h-screen bg-brand-dark text-slate-100 relative overflow-x-hidden">
        <BackgroundAnimation />
        <Toaster position="top-right" reverseOrder={false} toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}/>
        
        {/* Initial Splash Screen */}
        <AnimatePresence>
            {initialLoad && (
                <motion.div
                    key="splash-loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-brand-dark"
                >
                    <FullScreenLoader />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Main App Content - Fades in slightly after splash */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: initialLoad ? 0 : 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col min-h-screen"
        >
            {!isAdmin && <Navbar />}
            
            <main className={`flex-grow ${!isAdmin ? 'pt-20' : ''} relative z-10`}>
                <AnimatePresence mode="wait">
                <div key={location.pathname}>
                    <React.Suspense fallback={<div className="min-h-screen"></div>}>
                        {/* We use a blank div for suspense fallback during nav because the splash handles initial, 
                            and for subsequent nav, we might want a subtler loader or keep previous page.
                            Actually, let's keep FullScreenLoader but maybe transparent? 
                            Let's use a non-fixed version or valid fallback. 
                            For now, to be "smooth", we avoid flashing the splash screen on every click. 
                            Let's just rely on old-content-persistence or PageSkeleton if needed.
                            However, user wanted 'smooth', so let's use PageSkeleton for internal Nav.
                         */}
                        <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/packages" element={<Packages />} />
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/admin-portal-secure-access" element={<Login />} />
                            
                            <Route element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/clients" element={<ClientLedger />} />
                                <Route path="/clients/:id" element={<ClientDetail />} />
                                <Route path="/vendors" element={<VendorManagement />} />
                                <Route path="/vendors/:id" element={<ViewVendor />} />
                            </Route>
                        </Routes>
                    </React.Suspense>
                </div>
                </AnimatePresence>
            </main>
            
            {!isAdmin && (
                <div className="relative z-10">
                <Chatbot />
                <Footer />
                </div>
            )}
        </motion.div>
      </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
        <AuthProvider>
            <ScrollToTop />
            <AppContent />
        </AuthProvider>
    </Router>
  );
};

export default App;