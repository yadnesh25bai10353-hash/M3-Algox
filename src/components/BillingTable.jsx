import React, { useState } from 'react';
import { billingData } from '../data/mockData';
import PaymentModal from './PaymentModal';

// Inline SVG icons
const IconCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconAlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconReceipt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2Z"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>
);
const IconCreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
);

const BillingTable = () => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = billingData || [];

  const totalDue = data.reduce((acc, curr) => (curr.status === 'due' || curr.status === 'overdue') ? acc + curr.amount : acc, 0);
  const paidThisQuarter = data.reduce((acc, curr) => curr.status === 'paid' ? acc + curr.amount : acc, 0);
  const activeSubscriptions = data.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayClick = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <IconCheckCircle />
            <span>Paid</span>
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <IconClock />
            <span>Due</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <IconAlertCircle />
            <span>Overdue</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-1">Bot Billing & Payments</h2>
        <p className="text-gray-400">Manage your AI bot subscriptions and billing history.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400 mb-1">Total Due</span>
          <span className="text-3xl font-bold text-accent">{formatCurrency(totalDue)}</span>
        </div>
        <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400 mb-1">Paid This Quarter</span>
          <span className="text-3xl font-bold text-white">{formatCurrency(paidThisQuarter)}</span>
        </div>
        <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 shadow-sm flex flex-col">
          <span className="text-sm font-medium text-gray-400 mb-1">Active Subscriptions</span>
          <span className="text-3xl font-bold text-white">{activeSubscriptions}</span>
        </div>
      </div>

      {/* Desktop Table & Mobile Cards */}
      <div className="bg-navy-800 rounded-xl border border-navy-700 shadow-sm overflow-hidden">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-navy-900 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Bot Name</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">Next Billing</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700 text-gray-200">
              {data.map((bill, idx) => (
                <tr key={bill.id || idx} className="hover:bg-navy-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{bill.botName}</td>
                  <td className="px-6 py-4 text-gray-300">{bill.plan}</td>
                  <td className="px-6 py-4 text-gray-400">{bill.startDate}</td>
                  <td className="px-6 py-4 text-gray-400">{bill.nextBilling}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(bill.amount)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(bill.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {bill.status === 'paid' ? (
                      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-blue-400 transition-colors">
                        <IconReceipt />
                        Receipt
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePayClick(bill)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-accent hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm"
                      >
                        <IconCreditCard />
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                    No billing data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y divide-navy-700">
          {data.map((bill, idx) => (
            <div key={bill.id || idx} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{bill.botName}</h3>
                  <p className="text-sm text-gray-400">{bill.plan}</p>
                </div>
                {getStatusBadge(bill.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="text-gray-300">{bill.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Next Billing</p>
                  <p className="text-gray-300">{bill.nextBilling}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-navy-700/50">
                <span className="font-bold text-white text-lg">{formatCurrency(bill.amount)}</span>
                
                {bill.status === 'paid' ? (
                  <button className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-blue-400 transition-colors">
                    <IconReceipt />
                    Receipt
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePayClick(bill)}
                    className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium bg-accent hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No billing data found.
            </div>
          )}
        </div>
      </div>

      <PaymentModal 
        bill={selectedBill} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default BillingTable;
