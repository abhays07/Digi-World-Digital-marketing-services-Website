import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminLayout: React.FC = () => {
  // Use false by default so it is hidden on mobile initial load
  // Desktop is handled by CSS (lg:translate-x-0) ignoring this state when false
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to Home if unauthorized (Stealth Mode)
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    setSidebarOpen(false); // Ensure sidebar closes on mobile
    navigate('/'); // Redirect to Home, hiding the login URL
    toast.success('Logged out successfully');
  };
  
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const navItems = [
    { name: 'Analytics Dashboard', path: '/dashboard', icon: 'fa-chart-line' },
    { name: 'Client Ledger', path: '/clients', icon: 'fa-file-invoice-dollar' },
    { name: 'Vendor Management', path: '/vendors', icon: 'fa-store' }, // Placeholder for future
  ];

  // Modified to check partial match for active state
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center justify-center border-b border-slate-700">
          <Link to="/" onClick={handleNavClick} className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">
            DIGI-ADMIN
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? item.path === '/dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-brand-blue/10 text-brand-blue font-semibold border border-brand-blue/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                 isActive(item.path)
                   ? item.path === '/dashboard'
                     ? 'bg-white/20'
                     : 'bg-brand-blue text-white'
                   : 'bg-slate-800 group-hover:bg-slate-700'
              }`}>
                <i className={`fas ${item.icon} text-xs`}></i>
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-400 mb-1">Logged in as</p>
              <p className="font-semibold text-sm truncate">{localStorage.getItem('adminEmail') || 'Admin'}</p>
           </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl transition-all duration-200"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        
        {/* Mobile Header (Top) */}
        <header className="h-16 lg:hidden flex items-center justify-between px-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-md sticky top-0 z-30">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-orange to-brand-pink bg-clip-text text-transparent">
            DIGI-ADMIN
          </Link>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Mobile Bottom Navigation (Thumb Reachable) */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 lg:hidden pb-safe">
           <div className="flex justify-around items-center h-16 px-2">
              {navItems.map((item) => (
                 <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                      isActive(item.path) ? 'text-brand-blue' : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    <i className={`fas ${item.icon} text-lg ${isActive(item.path) ? 'animate-bounce' : ''}`}></i>
                    <span className="text-[10px] font-medium">{item.name.split(' ')[0]}</span>
                 </Link>
              ))}
              <button 
                 onClick={handleLogout}
                 className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-red-400"
              >
                  <i className="fas fa-sign-out-alt text-lg"></i>
                  <span className="text-[10px] font-medium">Logout</span>
              </button>
           </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
             {/* Background Effects */}
             <div className="fixed inset-0 z-0 pointer-events-none">
                 <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[100px] opacity-30"></div>
                 <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] opacity-30"></div>
            </div>
            <div className="relative z-10">
              <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
