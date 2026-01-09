import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import { authService, analyticsService } from '../services/api';
import SEO from '../components/SEO';
import HybridGraph from '../components/charts/HybridGraph';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Brand Colors: Orange, Pink, Blue and their variations
const COLORS = ['#f59e0b', '#ec4899', '#0ea5e9', '#f97316', '#a855f7', '#06b6d4', '#e11d48'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<'revenue' | 'expense'>('revenue');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await analyticsService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        toast.error('Failed to load dashboard data');
        if (!authService.isAuthenticated()) {
           navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <SEO title="Dashboard | Digi-World Promotions" description="Admin Dashboard" />

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, Admin</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fas fa-wallet text-6xl text-brand-blue"></i>
          </div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(stats.scorecards.revenue)}</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue w-3/4"></div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fas fa-shopping-cart text-6xl text-brand-pink"></i>
          </div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Expenses</h3>
          <p className="text-3xl font-bold text-white mt-2">{formatCurrency(stats.scorecards.expense)}</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-brand-pink w-1/2"></div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="fas fa-chart-line text-6xl text-brand-orange"></i>
          </div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Net Profit</h3>
          <p className={`text-3xl font-bold mt-2 ${stats.scorecards.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(stats.scorecards.netProfit)}
          </p>
           <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-brand-orange w-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <motion.div 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => navigate('/vendors')}
           className="glass-card p-6 rounded-2xl border border-white/5 cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 group"
         >
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all">
                    <i className="fas fa-users-cog text-xl"></i>
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-lg">Vendor Management</h3>
                    <p className="text-slate-400 text-sm">Manage agencies & services</p>
                 </div>
             </div>
         </motion.div>
         
         <motion.div 
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => navigate('/clients')}
           className="glass-card p-6 rounded-2xl border border-white/5 cursor-pointer bg-gradient-to-bl from-slate-800 to-slate-900 group"
         >
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <i className="fas fa-user-tie text-xl"></i>
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-lg">Client Management</h3>
                    <p className="text-slate-400 text-sm">Manage entries & cycles</p>
                 </div>
             </div>
         </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue vs Expense Chart (Hybrid) */}
        {/* Revenue vs Expense Chart (Hybrid) */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 lg:col-span-2">
           <h3 className="text-xl font-bold text-white mb-6">Financial Overview</h3>
           <HybridGraph 
             data={stats.chartData}
             xKey="name"
             barKeys={[
                { key: 'revenue', name: 'Revenue', color: '#0ea5e9' },
                { key: 'expense', name: 'Expenses', color: '#ec4899' }
             ]}
             lineKeys={[]}
             height={400}
           />
        </div>

        {/* Combined Distribution Chart */}
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-white">
                {chartView === 'revenue' ? 'Revenue by Service' : 'Expense Distribution'}
             </h3>
             
             {/* Toggle Switch */}
             <div className="bg-slate-800 p-1 rounded-xl flex gap-1">
                 <button
                    onClick={() => setChartView('revenue')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                       chartView === 'revenue' 
                       ? 'bg-brand-blue text-white shadow-lg' 
                       : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    Revenue
                 </button>
                 <button
                    onClick={() => setChartView('expense')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                       chartView === 'expense' 
                       ? 'bg-brand-pink text-white shadow-lg' 
                       : 'text-slate-400 hover:text-white'
                    }`}
                 >
                    Expense
                 </button>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartView === 'revenue' ? stats.serviceData : stats.expenseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(chartView === 'revenue' ? stats.serviceData : stats.expenseDistribution)?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', borderColor: '#334155', borderRadius: '0.8rem', color: '#f8f8f8', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                   itemStyle={{ color: '#f8f8f8', fontSize: '14px', fontWeight: '500' }}
                   formatter={(value: number) => formatCurrency(value)}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
             {(chartView === 'expense' && (!stats.expenseDistribution || stats.expenseDistribution.length === 0)) && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-900/50 backdrop-blur-sm rounded-xl">
                   No expense data available
                </div>
             )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
