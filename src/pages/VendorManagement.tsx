import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { vendorService } from '../services/api';
import SEO from '../components/SEO';

const VendorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Vendor Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    agencyName: '',
    workStartDate: '',
    services: [{ name: 'Marketing', rate: 0 }], // Start with one service
  });

  const [showArchived, setShowArchived] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await vendorService.getAll();
      setVendors(data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
      try {
          await vendorService.deletePermanently(id);
          toast.success('Vendor deleted permanently');
          setShowDeleteConfirm(null);
          fetchVendors(); 
      } catch (error) {
          toast.error('Failed to delete vendor');
      }
  };

  const handleAddService = () => {
    setNewVendor({
      ...newVendor,
      services: [...newVendor.services, { name: 'Marketing', rate: 0 }]
    });
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updatedServices = [...newVendor.services];
    // @ts-ignore
    updatedServices[index][field] = value;
    setNewVendor({ ...newVendor, services: updatedServices });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorService.create(newVendor);
      toast.success('Vendor added successfully');
      setShowAddModal(false);
      fetchVendors();
      setNewVendor({
        agencyName: '',
        workStartDate: '',
        services: [{ name: 'Marketing', rate: 0 }],
      });
    } catch (error) {
       toast.error('Failed to create vendor');
    }
  };

  const SERVICE_OPTS = ['Ads Management', 'Video Editing', 'Service Charge', 'Cameraman', 'Graphics Designer', 'Broker', 'Others', 'Marketing'];
  
  const filteredVendors = vendors.filter(v => showArchived ? v.isArchived : !v.isArchived);

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
      <SEO title="Vendor Management | Digi-World" description="Manage your vendors" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-orange">
            Vendor Management
          </h1>
          <p className="text-slate-400 mt-2">Manage external agencies and service providers</p>
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
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 brand-gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-brand-pink/20 transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Add Vendor
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
          {filteredVendors.map((vendor) => (
            <motion.div
              layout
              key={vendor._id}
              whileHover={!showArchived ? { y: -5 } : {}}
              className="relative group"
            >
             <div
               onClick={() => !showArchived && navigate(`/vendors/${vendor._id}`)}
               className={`glass-card p-6 rounded-2xl border border-white/5 transition-colors ${showArchived ? 'opacity-70 border-red-500/10 bg-red-500/5' : 'cursor-pointer hover:border-brand-blue/30'}`}
             >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl text-brand-blue font-bold">
                  {vendor.agencyName.charAt(0)}
                </div>
                {!showArchived && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        vendor.cycles?.[vendor.cycles.length-1]?.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-brand-orange/20 text-brand-orange'
                    }`}>
                        {vendor.cycles?.[vendor.cycles.length-1]?.status || 'Active'}
                    </div>
                )}
                {showArchived && <span className="text-xxs bg-red-500 text-white px-2 py-0.5 rounded uppercase">Archived</span>}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">
                {vendor.agencyName}
              </h3>
              
              <div className="text-slate-400 text-sm mb-4">
                 {vendor.services && vendor.services.length > 0 
                    ? vendor.services.map((s:any) => s.name).join(', ')
                    : vendor.serviceType
                 }
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="text-sm text-slate-500">Monthly Bill</div>
                <div className="text-lg font-bold text-white">₹{vendor.monthlyRate?.toLocaleString()}</div>
              </div>
             </div>

             {/* Permanent Delete Button */}
             {showArchived && (
                  <button 
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDeleteConfirm(vendor._id);
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
          
          {filteredVendors.length === 0 && (
             <div className="col-span-full text-center text-slate-500 py-12 border border-dashed border-slate-700 rounded-2xl">
                {showArchived ? 'No archived vendors found.' : 'No active vendors found.'}
             </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                        This action <strong>cannot be undone</strong>. All financial history for this vendor will be wiped.
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

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Vendor</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Agency Name</label>
                <input 
                  type="text" 
                  required
                  value={newVendor.agencyName}
                  onChange={e => setNewVendor({...newVendor, agencyName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none"
                  placeholder="e.g. Acme Marketing"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Work Start Date</label>
                <input 
                  type="date" 
                  required
                  value={newVendor.workStartDate}
                  onChange={e => setNewVendor({...newVendor, workStartDate: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue outline-none"
                />
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <label className="block text-sm text-slate-400">Services</label>
                   <button type="button" onClick={handleAddService} className="text-xs text-brand-blue hover:underline">+ Add Service</button>
                 </div>
                 
                 {newVendor.services.map((service, idx) => (
                   <div key={idx} className="flex gap-2 items-center">
                      <select 
                        value={service.name}
                        onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        {SERVICE_OPTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <input 
                        type="number"
                        placeholder="Rate"
                        value={service.rate}
                        onChange={(e) => handleServiceChange(idx, 'rate', Number(e.target.value))}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                      />
                      {newVendor.services.length > 1 && (
                        <button type="button" onClick={() => {
                           const ns = [...newVendor.services];
                           ns.splice(idx, 1);
                           setNewVendor({...newVendor, services: ns});
                        }} className="text-red-400 hover:text-red-300">
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                   </div>
                 ))}
                 
                 <div className="text-right text-sm text-slate-300 pt-2">
                    Total: <span className="font-bold text-white">₹{newVendor.services.reduce((acc, curr) => acc + (curr.rate || 0), 0)}</span>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 mt-4 brand-gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-brand-pink/20 transition-all"
              >
                Create Vendor
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
