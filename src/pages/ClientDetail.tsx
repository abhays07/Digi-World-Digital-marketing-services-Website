import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { clientService } from '@/services/api';
import PaymentReceipt from '@/components/PaymentReceipt';

interface Payment {
  _id: string;
  amount: number;
  date: string;
  screenshotUrl?: string;
}

interface Cycle {
  _id: string;
  cycleName: string; // "15/01/2026 - 14/02/2026"
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Overdue';
  totalAgreed: number;
  payments: Payment[];
  balanceDue: number;
}

interface ClientDetail {
  _id: string;
  name: string;
  serviceType: string;
  totalAgreedAmount: number;
  totalPaid: number;
  balanceRemaining: number;
  cycles?: Cycle[];
  workStartDate?: string;
}

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Overpayment & Receipt States
  const [showOverpaymentModal, setShowOverpaymentModal] = useState(false);
  const [pendingOverpaymentAmt, setPendingOverpaymentAmt] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Delete State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter State
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
        checkCyclesAndLoad(id);
    }
  }, [id]);

  const handleDeleteClient = async () => {
       if(!id) return;
       try {
           setIsSubmitting(true);
           await clientService.archive(id);
           toast.success('Client archived successfully');
           navigate('/clients'); // Redirect to Ledger
       } catch (error) {
           toast.error('Failed to archive client');
           setIsSubmitting(false);
       }
  };

  const checkCyclesAndLoad = async (clientId: string) => {
      try {
          await clientService.checkCycles(clientId); 
          const data = await clientService.getById(clientId);
          setClient(data);
      } catch (error: any) {
          console.error('Client Detail Error:', error);
          const msg = error.response?.data?.message || 'Failed to load client details';
          toast.error(msg);
      } finally {
          setIsLoading(false);
      }
  };

  // Modified Submit Handler
  const handlePaymentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Overpayment Check
      // Find active cycle due balance
      const activeCycle = client?.cycles?.find(c => c.status === 'Active') || client?.cycles?.[(client?.cycles?.length || 1) - 1];
      const payAmt = Number(paymentAmount);
      
      if (activeCycle && payAmt > activeCycle.balanceDue && activeCycle.balanceDue > 0) {
          // Trigger Overpayment Modal
          setPendingOverpaymentAmt(payAmt);
          setShowModal(false); // Close normal modal
          setShowOverpaymentModal(true);
      } else {
          // Normal Submission
          submitFinalPayment(payAmt, false);
      }
  };

  const submitFinalPayment = async (amt: number, carryForward: boolean) => {
    if (!client || !id) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('amount', amt.toString());
    formData.append('date', paymentDate);
    if(carryForward) formData.append('carryForward', 'true');
    
    if (file) {
      formData.append('screenshot', file);
    }

    try {
      await clientService.addPayment(id, formData);
      toast.success(carryForward ? 'Payment split & recorded!' : 'Payment recorded successfully!');
      setShowModal(false);
      setShowOverpaymentModal(false);
      setPaymentAmount('');
      setFile(null);
      checkCyclesAndLoad(id); // Reload
    } catch (error) {
      toast.error('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading Details...</div>;
  if (!client) return null;

  // Find Active Cycle
  const activeCycle = client.cycles?.find(c => c.status === 'Active') || client.cycles?.[(client.cycles?.length || 1) - 1];

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/clients')} 
        className="mb-6 text-slate-400 hover:text-white flex items-center transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Ledger
      </button>

      {/* Header Summary Card */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-3xl p-6 lg:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 truncate">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-600">
                {client.serviceType}
              </span>
              {client.workStartDate && (
                  <span className="text-slate-400 text-sm">Started: {new Date(client.workStartDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl font-bold border border-red-500/20 transition-all flex items-center justify-center"
              title="Archive Client"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 md:flex-none brand-gradient-bg text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-pink/20 transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <i className="fas fa-plus-circle mr-2"></i> Add Payment
            </button>
          </div>
        </div>

        {/* ... (Existing Delete Modal) ... */}
        {/* DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
            {showDeleteModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">Archive Client?</h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            Are you sure you want to archive <strong>{client.name}</strong>? 
                            This will hide them from the active ledger but preserve their transaction history.
                        </p>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleDeleteClient()}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                            >
                                Yes, Archive
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Global Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Monthly Agreement</p>
            <p className="text-2xl font-bold text-white">₹{client.totalAgreedAmount.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Total Paid (Lifetime)</p>
            <p className="text-2xl font-bold text-green-400">₹{client.totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">Total Due (All Cycles)</p>
            <p className="text-2xl font-bold text-brand-pink">₹{client.balanceRemaining.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Active Cycle (Automated) - Click to filter */}
      <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-brand-orange">Current Billing Cycle</h2>
      
      {activeCycle ? (
         <div 
            onClick={() => setSelectedCycleId(selectedCycleId === activeCycle._id ? null : activeCycle._id)}
            className={`cursor-pointer transition-all bg-gradient-to-br from-slate-800 to-slate-900 border rounded-3xl p-6 md:p-8 mb-10 relative overflow-hidden shadow-2xl ${selectedCycleId === activeCycle._id ? 'border-brand-orange ring-2 ring-brand-orange/50' : 'border-slate-700 hover:border-slate-600'}`}
         >
              <div className="absolute top-0 right-0 p-3 opacity-5">
                 <i className="fas fa-sync-alt text-9xl text-white"></i>
              </div>
              
              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                       <div>
                           <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">
                               Active Period 
                               {selectedCycleId === activeCycle._id && <span className="text-brand-orange font-bold ml-2">(Selected)</span>}
                           </p>
                           <h3 className="text-2xl md:text-3xl font-bold text-white">{activeCycle.cycleName}</h3>
                           <p className="text-slate-500 text-sm mt-1">
                               Ends on: {new Date(activeCycle.endDate).toLocaleDateString()} 
                               {new Date() > new Date(activeCycle.endDate) && <span className="text-red-400 font-bold ml-2">(Overdue)</span>}
                           </p>
                       </div>
                       <span className={`px-4 py-2 rounded-full font-bold border w-full md:w-auto text-center ${
                           activeCycle.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                           activeCycle.status === 'Overdue' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                           'bg-blue-500/20 text-blue-400 border-blue-500/30'
                       }`}>
                           {activeCycle.status}
                       </span>
                  </div>

                  <div className="mt-8 bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex flex-col sm:flex-row gap-8">
                      <div>
                          <p className="text-slate-400 text-xs uppercase">Cycle Total</p>
                          <p className="text-xl font-bold text-white">₹{activeCycle.totalAgreed.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-slate-400 text-xs uppercase">Paid So Far</p>
                          <p className="text-xl font-bold text-green-400">
                             ₹{activeCycle.payments ? activeCycle.payments.reduce((s, p) => s + p.amount, 0).toLocaleString() : 0}
                          </p>
                      </div>
                      <div>
                          <p className="text-slate-400 text-xs uppercase">Balance Due</p>
                          <p className="text-xl font-bold text-brand-pink">₹{activeCycle.balanceDue.toLocaleString()}</p>
                      </div>
                  </div>
              </div>
         </div>
      ) : (
          <div className="p-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl mb-10">
             No active cycles found.
          </div>
      )}

      {/* Cycle History */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-400">Cycle History</h3>
        {selectedCycleId && (
            <button onClick={() => setSelectedCycleId(null)} className="text-xs text-brand-blue hover:text-white transition-colors">
                Clear Filter <i className="fas fa-times ml-1"></i>
            </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {client.cycles && [...client.cycles].reverse().map((cycle, idx) => (
             <div 
                key={idx} 
                onClick={() => setSelectedCycleId(selectedCycleId === cycle._id ? null : cycle._id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] transform ${
                    selectedCycleId === cycle._id 
                    ? 'bg-slate-800 border-brand-blue ring-1 ring-brand-blue shadow-lg shadow-brand-blue/10' 
                    : cycle.status === 'Active' ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/30 border-slate-700 hover:border-slate-500'
                }`}
             >
                 <div className="flex justify-between items-center mb-2">
                     <p className={`font-bold text-sm ${selectedCycleId === cycle._id ? 'text-brand-blue' : 'text-white'}`}>{cycle.cycleName}</p>
                     <span className={`text-[10px] px-2 py-1 rounded-full ${cycle.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                       {cycle.status}
                     </span>
                 </div>
                 <div className="flex justify-between items-end text-xs text-slate-400">
                    <span>Paid: ₹{(cycle.payments?.reduce((s, p) => s+p.amount, 0) || 0).toLocaleString()}</span>
                    
                    {/* Visual indicator for current selection */}
                    <div className="text-right">
                        <span className={cycle.balanceDue > 0 ? 'text-red-400 block' : 'text-green-400 block'}>Due: ₹{cycle.balanceDue.toLocaleString()}</span>
                    </div>
                 </div>
             </div>
          ))}
      </div>

      {/* Transaction History */}
      <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-brand-blue">
          Transaction History
          {selectedCycleId && <span className="text-sm font-normal text-slate-400 ml-3">(Filtered)</span>}
      </h2>
      
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden mb-12">
        {/* Mobile Card View for Transactions */}
        <div className="block lg:hidden">
             {(() => {
                 const filteredPayments = client.cycles && client.cycles
                    .filter(c => selectedCycleId ? c._id === selectedCycleId : true)
                    .flatMap(cycle => cycle.payments.map(p => ({...p, cycleName: cycle.cycleName})))
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                 if (!filteredPayments || filteredPayments.length === 0) {
                     return (
                         <div className="p-8 text-center text-slate-500">
                            No transactions found {selectedCycleId ? 'for this cycle' : ''}.
                         </div>
                     );
                 }

                 return (
                    <div className="divide-y divide-slate-700/50">
                        {filteredPayments.map((pay: any) => (
                             <div key={pay._id} className="p-5">
                                 <div className="flex justify-between items-start mb-3">
                                     <div>
                                         <p className="font-bold text-green-400 text-lg">+ ₹{pay.amount.toLocaleString()}</p>
                                         <p className="text-slate-400 text-xs mt-1">{new Date(pay.date).toLocaleDateString()}</p>
                                     </div>
                                     <span className="bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-700 uppercase tracking-wide">
                                         {pay.cycleName}
                                     </span>
                                 </div>
                                 
                                 <div className="flex gap-3 mt-4">
                                     <button 
                                         onClick={() => setSelectedReceipt(pay)}
                                         className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors font-medium"
                                     >
                                         <i className="fas fa-receipt mr-2"></i> Receipt
                                     </button>
                                     {pay.screenshotUrl ? (
                                         <button 
                                             onClick={() => window.open(pay.screenshotUrl, '_blank')}
                                             className="flex-1 bg-brand-blue/10 text-brand-blue py-2 rounded-lg text-sm font-medium hover:bg-brand-blue hover:text-white transition-colors"
                                         >
                                             <i className="fas fa-image mr-2"></i> Proof
                                         </button>
                                     ) : (
                                        <div className="flex-1 flex items-center justify-center text-slate-600 text-sm border border-slate-700 rounded-lg border-dashed">
                                           No Proof
                                        </div>
                                     )}
                                 </div>
                             </div>
                        ))}
                    </div>
                 );
             })()}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Cycle</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Receipt</th>
                <th className="px-6 py-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {client.cycles && client.cycles
               .filter(c => selectedCycleId ? c._id === selectedCycleId : true) // FILTER APPLIED HERE
               .flatMap(cycle => 
                   cycle.payments.map(p => ({...p, cycleName: cycle.cycleName}))
              ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((pay: any) => (
                  <tr key={pay._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(pay.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {pay.cycleName}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-400">
                      + ₹{pay.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => setSelectedReceipt(pay)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                            <i className="fas fa-receipt mr-1"></i> View
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pay.screenshotUrl ? (
                        <button 
                          onClick={() => window.open(pay.screenshotUrl, '_blank')}
                          className="flex items-center justify-end w-full text-brand-blue hover:text-brand-pink transition-colors gap-2"
                        >
                          <i className="fas fa-image"></i>
                          <span className="underline">Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 italic">No proof</span>
                      )}
                    </td>
                  </tr>
              ))}
              {(!client.cycles || client.cycles.length === 0 || 
               (selectedCycleId && client.cycles.find(c => c._id === selectedCycleId)?.payments.length === 0)) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No transactions found {selectedCycleId ? 'for this cycle' : ''}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Receipt Modal */}
      {selectedReceipt && (
          <PaymentReceipt 
            payment={selectedReceipt}
            clientName={client.name}
            cycleName={selectedReceipt.cycleName}
            onClose={() => setSelectedReceipt(null)}
          />
      )}

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
                       The active cycle only has <span className="text-white font-bold">₹{activeCycle?.balanceDue.toLocaleString()}</span> remaining due, but you entered <span className="text-white font-bold">₹{pendingOverpaymentAmt.toLocaleString()}</span>.
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
                                 setShowModal(true); // Re-open edit
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

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Record New Payment</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-3 mb-6">
                 <p className="text-brand-blue text-sm font-medium text-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Adding payment for cycle: <br/>
                    <span className="text-white font-bold">{activeCycle?.cycleName || 'Unknown Cycle'}</span>
                 </p>
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-green-500 transition-colors"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Date Received</label>
                  <input
                    type="date"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-brand-blue transition-colors"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Payment Screenshot</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden
                      ${file ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-brand-blue hover:bg-slate-800/50'}
                    `}
                  >
                     <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                           setFile(e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                      className="hidden" 
                    />
                    
                    {file ? (
                      <div className="relative z-10">
                         <div className="mx-auto w-16 h-16 bg-slate-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-slate-600">
                             <img 
                               src={URL.createObjectURL(file)} 
                               alt="Preview" 
                               className="w-full h-full object-cover" 
                               onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                             />
                         </div>
                         <p className="text-sm text-green-400 font-medium truncate px-4">{file.name}</p>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        <i className="fas fa-cloud-upload-alt text-3xl mb-3 text-brand-blue opacity-80"></i>
                        <p className="text-sm font-medium text-slate-300">Click to upload screenshot</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full brand-gradient-bg text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-[1.01] shadow-lg shadow-brand-blue/20"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Payment'}
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

export default ClientDetail;
