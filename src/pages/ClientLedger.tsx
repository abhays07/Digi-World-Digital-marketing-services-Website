import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { clientService } from '@/services/api';

interface Client {
  _id: string;
  name: string;
  serviceType: string;
  totalAgreedAmount: number;
  totalPaid: number;
  balanceRemaining: number;
  isArchived: boolean;
}

const ClientLedger: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false); // Tab state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null); // For permanent delete
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    serviceType: 'Video Editing',
    totalAgreedAmount: '',
    workStartDate: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error: any) {
      console.error('Client Fetch Error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load clients';
      toast.error(`Error: ${msg}`);
      if (error.response?.status === 404) {
          toast.error('Backend route not found. PLEASE RESTART SERVER.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await clientService.create({
        ...formData,
        totalAgreedAmount: Number(formData.totalAgreedAmount)
      });
      toast.success('Client added successfully');
      setShowModal(false);
      setFormData({ name: '', serviceType: 'Video Editing', totalAgreedAmount: '', workStartDate: '' });
      fetchClients();
    } catch (error) {
      toast.error('Failed to create client');
    }
  };

  const handlePermanentDelete = async (id: string) => {
      try {
          await clientService.deletePermanently(id);
          toast.success('Client deleted permanently');
          setShowDeleteConfirm(null);
          fetchClients(); // Refresh list
      } catch (error) {
          toast.error('Failed to delete client');
      }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading Ledger...</div>;

  const filteredClients = clients.filter(c => showArchived ? c.isArchived : !c.isArchived);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Ledger</h1>
          <p className="text-slate-400 mt-1">Track client payments and balances</p>
        </div>

        <div className="flex gap-4 items-center">
            {/* Toggle Tabs */}
            <div className="bg-slate-800 p-1 rounded-xl flex">
                <button 
                  onClick={() => setShowArchived(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!showArchived ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setShowArchived(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${showArchived ? 'bg-red-500/20 text-red-400 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Archived
                </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="brand-gradient-bg text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-all flex items-center shadow-lg shadow-brand-blue/20"
            >
              <i className="fas fa-plus mr-2"></i> Add Client
            </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
        {filteredClients.map((client) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={client._id}
              className="relative group"
            >
              <Link to={!client.isArchived ? `/clients/${client._id}` : '#'} className={client.isArchived ? 'pointer-events-none' : ''}>
                <div 
                  className={`bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl transition-colors ${
                      client.isArchived ? 'opacity-70 border-red-500/10 bg-red-500/5' : 'hover:border-brand-blue/50 cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {client.name}
                          {client.isArchived && <span className="text-xxs bg-red-500 text-white px-2 py-0.5 rounded uppercase">Archived</span>}
                      </h3>
                      <span className="text-xs text-brand-blue bg-brand-blue/10 px-2 py-1 rounded-full">{client.serviceType}</span>
                    </div>
                    {client.balanceRemaining === 0 ? (
                      <span className="text-green-400 text-2xl"><i className="fas fa-check-circle"></i></span>
                    ) : (
                      <span className="text-brand-orange text-2xl"><i className="fas fa-clock"></i></span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Total Deal:</span>
                      <span className="font-semibold text-white">₹{client.totalAgreedAmount.toLocaleString()}</span>
                    </div>
                    {/* Only show full stats for active clients usually, but keeping it simple */}
                    <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                       <span className="font-bold text-brand-pink">Balance:</span>
                       <span className="font-bold text-white">₹{client.balanceRemaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Permanent Delete for Archived */}
              {showArchived && (
                  <button 
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDeleteConfirm(client._id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-10"
                    title="Delete Permanently"
                  >
                      <i className="fas fa-times"></i>
                  </button>
              )}
            </motion.div>
        ))}
        </AnimatePresence>
        
        {filteredClients.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-12 border border-dashed border-slate-700 rounded-2xl">
            {showArchived ? 'No archived clients found.' : 'No active clients found. Add one to get started.'}
          </div>
        )}
      </div>

      {/* Hard Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-slate-900 border border-red-600/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                >
                    <div className="text-red-500 text-center mb-4 text-4xl">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white text-center mb-2">Delete Permanently?</h3>
                    <p className="text-slate-400 text-center text-sm mb-6">
                        This action <strong>cannot be undone</strong>. All financial history for this client will be wiped from the database.
                    </p>
                    <div className="flex gap-3">
                         <button 
                            onClick={() => handlePermanentDelete(showDeleteConfirm)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold transition-all"
                         >
                             Yes, Delete
                         </button>
                         <button 
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 bg-slate-800 text-white py-2 rounded-xl font-bold hover:bg-slate-700 transition-all"
                         >
                             Cancel
                         </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add New Client</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Client Name</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Service Type</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  >
                    <option>Video Editing</option>
                    <option>Ads Services</option>
                    <option>Management Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Total Agreed Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                    value={formData.totalAgreedAmount}
                    onChange={(e) => setFormData({...formData, totalAgreedAmount: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Work Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                    value={formData.workStartDate}
                    onChange={(e) => setFormData({...formData, workStartDate: e.target.value})}
                  />
                  <p className="text-xs text-slate-500 mt-1">Billing cycles will start from this date.</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 brand-gradient-bg text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientLedger;
