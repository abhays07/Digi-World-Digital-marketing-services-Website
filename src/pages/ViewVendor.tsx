import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { vendorService } from '../services/api';
import SEO from '../components/SEO';

// --- Interfaces ---
interface Payment {
  _id: string;
  amount: number;
  date: string;
  transactionId: string;
  screenshotUrl?: string;
  note?: string;
  cycleName?: string;
}

interface VendorCycle {
  _id: string;
  cycleName: string;
  startDate: string;
  endDate: string;
  status: 'Unpaid' | 'Partial' | 'Settled' | 'Overdue';
  billAmount: number;
  balancePending: number;
  payments: Payment[];
}

interface ServiceItem {
    name: string;
    rate: number;
}

interface VendorDetail {
  _id: string;
  agencyName: string;
  serviceType: string;
  workStartDate: string;
  monthlyRate: number;
  services: ServiceItem[];
  cycles: VendorCycle[];
  totalPaid: number;
}

const ViewVendor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // --- EDIT SERVICES STATE ---
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [editServices, setEditServices] = useState<ServiceItem[]>([]);
  
  /* --- NEW ADDTIONS --- */
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  /* --- OVERPAYMENT LOGIC STATE --- */
  const [showOverpaymentModal, setShowOverpaymentModal] = useState(false);
  const [pendingOverpaymentAmt, setPendingOverpaymentAmt] = useState(0);

  // --- EXISTING LOGIC STATE ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  const handleArchive = async () => {
        try {
            await vendorService.archive(id!);
            toast.success("Vendor archived");
            navigate('/vendors');
        } catch (err) {
            toast.error("Failed to archive");
            setShowArchiveConfirm(false);
        }
  };

  const fetchVendorDetails = async () => {
    try {
      if (!id) return;
      const data = await vendorService.getById(id);
      setVendor(data);
      // Init edit form
      setEditServices(data.services?.length ? data.services : [{ name: data.serviceType, rate: data.monthlyRate }]);
    } catch (error) {
       toast.error('Failed to load vendor details');
       navigate('/vendors');
    } finally {
      setLoading(false);
    }
  };



  const handleSaveServices = async () => {
    try {
        const newRate = editServices.reduce((acc, s) => acc + Number(s.rate), 0);
        await vendorService.update(id!, {
            services: editServices,
            monthlyRate: newRate
        });
        toast.success("Services updated successfully");
        setIsEditingDocs(false);
        fetchVendorDetails();
    } catch (err) {
        toast.error("Failed to update services");
    }
  };

  const handleAddService = () => {
      setEditServices([...editServices, { name: 'Marketing', rate: 0 }]);
  };

  const handleServiceChange = (idx: number, field: keyof ServiceItem, value: any) => {
      const updated = [...editServices];
      // @ts-ignore
      updated[idx][field] = value;
      setEditServices(updated);
  };

  // --- ACTIVE CYCLE LOGIC ---
  const activeCycle = vendor?.cycles?.find(c => c.status !== 'Settled') || vendor?.cycles?.[(vendor?.cycles?.length || 1) - 1];

  // --- FLATTEN TRANSACTIONS ---
  const allPayments = vendor?.cycles?.filter(c => selectedCycleId ? c._id === selectedCycleId : true)
                      .flatMap(c => c.payments.map(p => ({...p, cycleName: c.cycleName}))) 
                      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];

  const handlePaymentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!id || !activeCycle) {
          toast.error("No active cycle found");
          return;
      }
      
      const amt = Number(paymentAmount);
      
      // Check for Overpayment (Carry Forward Logic)
      if (amt > activeCycle.balancePending && activeCycle.balancePending > 0) {
          setPendingOverpaymentAmt(amt);
          setShowPaymentModal(false);
          setShowOverpaymentModal(true);
      } else {
          // Normal Payment
          submitFinalPayment(amt, false);
      }
  };

  const submitFinalPayment = async (amt: number, carryForward: boolean) => {
      if(!id || !activeCycle) return;
      
      setIsSubmitting(true);
      try {
          const formData = new FormData();
          formData.append('amount', amt.toString());
          formData.append('date', paymentDate);
          formData.append('cycleId', activeCycle._id);
          formData.append('note', note);
          if (carryForward) formData.append('carryForward', 'true');
          if (file) formData.append('screenshot', file);

          await vendorService.addPayment(id, formData);
          
          toast.success(carryForward ? "Payment split & carried forward!" : "Payment recorded!");
          setShowPaymentModal(false);
          setShowOverpaymentModal(false);
          setPaymentAmount('');
          setNote('');
          setFile(null);
          fetchVendorDetails();
      } catch (err) {
          toast.error("Failed to record payment");
      } finally {
          setIsSubmitting(false);
      }
  };

  const SERVICE_OPTIONS = ['Ads Management', 'Video Editing', 'Service Charge', 'Cameraman', 'Graphics Designer', 'Broker', 'Others', 'Marketing'];

  if (loading) return <div className="text-center pt-24 text-white">Loading...</div>;
  if (!vendor) return null;

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
       <SEO title={`${vendor.agencyName} | Vendor Details`} description="Manage vendor" />
       
       {/* Header Section */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/vendors')} 
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors shrink-0 border border-slate-700"
            >
                <i className="fas fa-arrow-left text-slate-400"></i>
            </button>
            <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white max-w-2xl leading-tight truncate">{vendor.agencyName}</h1>
                <p className="text-brand-blue font-medium">{vendor.serviceType}</p>
            </div>
          </div>

          <div className="flex gap-4">
             <button
              onClick={() => setShowArchiveConfirm(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl font-bold border border-red-500/20 transition-all flex items-center justify-center"
              title="Archive Vendor"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Col: Cycle & Transactions */}
           <div className="lg:col-span-2 space-y-8">
               
               {/* Active Cycle Card (Restored Look) */}
               <div 
                 onClick={() => setSelectedCycleId(selectedCycleId === activeCycle?._id ? null : activeCycle?._id ?? null)}
                 className={`cursor-pointer transition-all bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 border shadow-2xl relative overflow-hidden group ${selectedCycleId === activeCycle?._id ? 'border-brand-blue ring-2 ring-brand-blue/50' : 'border-slate-700 hover:border-slate-600'}`}
               >
                  {/* Decorative Blur */}
                  <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/20 transition-all"></div>

                  <div className="relative z-10">
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                        <div>
                            <p className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-1">
                                Active Billing Cycle
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{activeCycle?.cycleName || 'No Active Cycle'}</h2>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                                activeCycle?.status === 'Settled' ? 'bg-green-500/20 text-green-400' : 
                                activeCycle?.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-brand-blue/20 text-brand-blue'
                            }`}>
                                {activeCycle?.status || 'Inactive'}
                            </span>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto bg-slate-800/50 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none">
                             <p className="text-slate-400 text-sm">Amount Due</p>
                             <div className="text-3xl md:text-4xl font-extrabold text-white mt-1">
                                ₹{activeCycle?.balancePending.toLocaleString() || '0'}
                             </div>
                             <p className="text-xs text-slate-500 mt-1">/ ₹{activeCycle?.billAmount.toLocaleString()} Total Bill</p>
                        </div>
                     </div>

                     {/* Progress Bar (Restored) */}
                     <div className="w-full bg-slate-700/50 rounded-full h-4 mb-8 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (((activeCycle?.billAmount || 0) - (activeCycle?.balancePending || 0)) / (activeCycle?.billAmount || 1)) * 100)}%` }}
                          className="h-full bg-gradient-to-r from-brand-blue to-purple-500"
                        ></motion.div>
                     </div>

                     <div className="flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowPaymentModal(true); }}
                            className="flex-1 brand-gradient-bg text-white py-3 md:py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-brand-blue/20 transition-all transform hover:scale-[1.01]"
                        >
                            <i className="fas fa-plus-circle mr-2"></i> Record Payment
                        </button>
                     </div>
                  </div>
               </div>

               {/* Cycle History List */}
               <div className="space-y-4">
                   <h3 className="text-xl font-bold text-white pl-2 border-l-4 border-slate-600 mb-4">Cycle History</h3>
                   {vendor.cycles?.slice(0).reverse().map((cycle) => (
                       <div 
                           key={cycle._id} 
                           onClick={() => setSelectedCycleId(selectedCycleId === cycle._id ? null : cycle._id)}
                           className={`p-4 md:p-5 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-2 cursor-pointer transition-all ${
                               selectedCycleId === cycle._id 
                               ? 'bg-slate-800 border-brand-blue ring-1 ring-brand-blue' 
                               : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                           }`}
                       >
                           <div>
                               <p className="font-bold text-white">{cycle.cycleName}</p>
                               <span className={`text-xs px-2 py-0.5 rounded ${cycle.status === 'Settled' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                   {cycle.status}
                               </span>
                           </div>
                           <div className="text-right">
                               <p className="text-slate-300">Bill: ₹{cycle.billAmount.toLocaleString()}</p>
                               {cycle.balancePending > 0 && <p className="text-red-400 text-sm font-bold">Due: ₹{cycle.balancePending.toLocaleString()}</p>}
                           </div>
                       </div>
                   ))}
               </div>

               {/* Transaction History Table (Restored) */}
               <div>
                  <h2 className="text-2xl font-bold text-white mt-8 mb-6 pl-2 border-l-4 border-brand-blue">
                      Transaction History
                  </h2>
                  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium">
                            <tr>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Cycle</th>
                              <th className="px-6 py-4">Amount</th>
                              <th className="px-6 py-4 text-center">Proof</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {allPayments.length > 0 ? (
                                allPayments.map((pay: any) => (
                                  <tr key={pay._id} className="hover:bg-slate-700/30">
                                      <td className="px-6 py-4">{new Date(pay.date).toLocaleDateString()}</td>
                                      <td className="px-6 py-4 text-xs text-slate-500">{pay.cycleName}</td>
                                      <td className="px-6 py-4 font-bold text-red-400">- ₹{pay.amount.toLocaleString()}</td>
                                      <td className="px-6 py-4 text-center">
                                          {pay.screenshotUrl ? (
                                              <button onClick={() => window.open(pay.screenshotUrl, '_blank')} className="text-brand-blue hover:text-white">
                                                  <i className="fas fa-image"></i>
                                              </button>
                                          ) : <span className="text-slate-600">-</span>}
                                      </td>
                                  </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No payment records found.</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                  </div>
               </div>
           </div>

           {/* Right Col: Stats & EDITABLE SERVICES */}
           <div className="space-y-6">
                
                {/* Financial Overview */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-slate-400 text-sm font-bold uppercase mb-4">Financial Overview</h3>
                    <div className="flex justify-between items-center text-white">
                        <span>Total Paid (Lifetime)</span>
                        <span className="text-xl font-bold text-green-400">₹{vendor.totalPaid.toLocaleString()}</span>
                    </div>
                </div>

                {/* --- SERVICES SECTION (NEW FEATURE) --- */}
                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-400"><i className="fas fa-briefcase mr-2"></i> Services</h4>
                        <button 
                             onClick={() => setIsEditingDocs(!isEditingDocs)}
                             className="text-xs text-slate-400 hover:text-white underline"
                        >
                            {isEditingDocs ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {!isEditingDocs ? (
                        <div className="space-y-3">
                             {vendor.services && vendor.services.length > 0 ? (
                                 vendor.services.map((s, idx) => (
                                     <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-900/50 rounded-lg">
                                         <span className="text-slate-300">{s.name}</span>
                                         <span className="text-white font-bold">₹{s.rate.toLocaleString()}</span>
                                     </div>
                                 ))
                             ) : (
                                 <div className="flex justify-between items-center text-sm">
                                      <span className="text-slate-300">{vendor.serviceType}</span>
                                      <span className="text-white font-bold">₹{vendor.monthlyRate.toLocaleString()}</span>
                                 </div>
                             )}
                             <div className="pt-3 mt-3 border-t border-slate-700 flex justify-between text-sm">
                                 <span className="text-slate-400">Monthly Total</span>
                                 <span className="text-white font-bold">₹{vendor.monthlyRate.toLocaleString()}</span>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                             {editServices.map((s, idx) => (
                                 <div key={idx} className="flex gap-2 items-center">
                                      <select 
                                          value={s.name}
                                          onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                                          className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                      >
                                          {SERVICE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                      <input 
                                          type="number"
                                          value={s.rate}
                                          onChange={(e) => handleServiceChange(idx, 'rate', e.target.value)}
                                          className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                      />
                                      <button onClick={() => {
                                          const ns = [...editServices];
                                          ns.splice(idx, 1);
                                          setEditServices(ns);
                                      }} className="text-red-400 hover:text-red-300">
                                          <i className="fas fa-trash"></i>
                                      </button>
                                 </div>
                             ))}
                             <button onClick={handleAddService} className="text-xs text-brand-blue hover:text-white block w-full text-left py-1">
                                 + Add Service
                             </button>
                             <button 
                                 onClick={handleSaveServices}
                                 className="w-full bg-brand-blue hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-bold mt-2"
                             >
                                 Save Changes
                             </button>
                        </div>
                    )}
                </div>

                <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                     <p className="text-sm text-slate-300"><strong>Started:</strong> {vendor.workStartDate ? new Date(vendor.workStartDate).toLocaleDateString() : 'N/A'}</p>
                </div>


           </div>
       </div>

       {/* Archive Confirmation Modal */}
       <AnimatePresence>
            {showArchiveConfirm && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-900 border border-red-600/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                    >
                        <div className="text-red-500 text-center mb-4 text-4xl">
                            <i className="fas fa-archive"></i>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Archive Vendor?</h3>
                        <p className="text-slate-400 text-center text-sm mb-6">
                            This will move <strong>{vendor.agencyName}</strong> to the archived list. You can restore them or delete them permanently later.
                        </p>
                        <div className="flex gap-3">
                             <button 
                                onClick={handleArchive}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold transition-all"
                             >
                                 Yes, Archive
                             </button>
                             <button 
                                onClick={() => setShowArchiveConfirm(false)}
                                className="flex-1 bg-slate-800 text-white py-2 rounded-xl font-bold hover:bg-slate-700 transition-all"
                             >
                                 Cancel
                             </button>
                        </div>
                    </motion.div>
                </div>
            )}
       </AnimatePresence>

       {/* OVERPAYMENT CONFLICT MODAL */}
       <AnimatePresence>
        {showOverpaymentModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
                >
                    {/* Warning Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/50 relative">
                             <i className="fas fa-exclamation-triangle text-4xl text-yellow-500"></i>
                             <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white text-center mb-2">Overpayment Detected</h2>
                    <p className="text-slate-400 text-center mb-8">
                       The active cycle only has <span className="text-white font-bold">₹{activeCycle?.balancePending.toLocaleString()}</span> remaining due, but you entered <span className="text-white font-bold">₹{pendingOverpaymentAmt.toLocaleString()}</span>.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                          onClick={() => submitFinalPayment(pendingOverpaymentAmt, true)}
                          className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-between group"
                        >
                            <span className="flex flex-col text-left">
                                <span className="text-sm uppercase tracking-wide opacity-80">Recommended</span>
                                <span className="text-lg">Carry Forward Excess</span>
                            </span>
                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </button>
                        
                        <button 
                             onClick={() => {
                                 setShowOverpaymentModal(false);
                                 setShowPaymentModal(true); // Re-open edit
                             }}
                             className="bg-slate-800 text-slate-300 p-4 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                             No, let me fix the amount
                        </button>
                    </div>
                </motion.div>
           </div>
        )}
       </AnimatePresence>

       {/* Payment Modal */}
       <AnimatePresence>
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Record Payment</h2>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400">Amount</label>
                                <input 
                                    type="number" 
                                    required
                                    value={paymentAmount}
                                    onChange={e => setPaymentAmount(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400">Date</label>
                                <input 
                                    type="date" 
                                    required
                                    value={paymentDate}
                                    onChange={e => setPaymentDate(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400">Note</label>
                                <input 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
                                />
                            </div>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={e => e.target.files && setFile(e.target.files[0])} />
                                <span className="text-xs text-slate-400">{file ? file.name : "Upload Proof (Optional)"}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 bg-slate-800 text-white py-3 rounded-xl">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 brand-gradient-bg text-white py-3 rounded-xl font-bold">
                                    {isSubmitting ? 'Saving...' : 'Confirm'}
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

export default ViewVendor;
