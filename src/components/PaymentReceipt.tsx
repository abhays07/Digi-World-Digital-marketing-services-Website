import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

interface PaymentReceiptProps {
  payment: {
    _id: string; // Used as Transaction ID
    amount: number;
    date: string;
  };
  clientName: string;
  cycleName: string;
  onClose: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ payment, clientName, cycleName, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (receiptRef.current) {
        const canvas = await html2canvas(receiptRef.current);
        const url = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `Receipt-${payment._id.slice(-6)}.png`;
        link.href = url;
        link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            
            {/* Printable Area */}
            <div ref={receiptRef} className="p-8 bg-white text-slate-900">
                <div className="text-center border-b-2 border-slate-100 pb-6 mb-6">
                    <div className="w-16 h-16 bg-brand-blue rounded-xl mx-auto flex items-center justify-center mb-4">
                        <i className="fas fa-check text-2xl text-white"></i>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Payment Receipt</h2>
                    <p className="text-slate-500 text-sm mt-1">DigiWorld Promotions</p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="font-mono font-bold text-slate-700">#{payment._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Date Paid</span>
                        <span className="font-bold text-slate-700">{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500">Client</span>
                         <span className="font-bold text-slate-700">{clientName}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500">Cycle</span>
                         <span className="font-bold text-slate-700 text-xs">{cycleName}</span>
                    </div>
                </div>

                <div className="mt-8 bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Amount Paid</p>
                    <p className="text-3xl font-extrabold text-brand-blue">₹{payment.amount.toLocaleString()}</p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">Generated automatically by DigiFinance System</p>
                </div>
            </div>

            {/* Action Buttons (Not Printed) */}
            <div className="bg-slate-50 p-4 flex gap-3 border-t border-slate-100">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex-1 py-3 bg-brand-blue text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    </div>
  );
};

export default PaymentReceipt;
