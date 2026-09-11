import React, { useState, useEffect } from 'react';

// Inline SVG icons
const IconX = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconCreditCard = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
);
const IconSmartphone = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
);
const IconQrCode = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
);
const IconCheckCircle = ({ className, size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const IconLock = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconShield = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 12 15 16 10"/></svg>
);
const IconSpinner = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const PaymentModal = ({ bill, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setActiveTab('card');
      setCardNumber('');
    }
  }, [isOpen]);

  if (!isOpen || !bill) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCardChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-navy-800 rounded-xl shadow-2xl border border-navy-600 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-navy-700">
          <h2 className="text-xl font-heading font-semibold text-white">
            {isSuccess ? 'Payment Status' : 'Complete Payment'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <IconCheckCircle className="text-green-500" size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-white font-heading">Payment Successful!</h3>
              <p className="text-gray-400 text-center">
                Your payment of {formatCurrency(bill.amount)} for {bill.botName} was processed successfully.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 w-full py-3 px-4 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors font-medium"
              >
                Close Window
              </button>
            </div>
          ) : (
            <>
              {/* Bill Summary */}
              <div className="bg-navy-900 rounded-lg p-4 mb-6 border border-navy-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Bot Name</span>
                  <span className="font-medium text-white">{bill.botName}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Plan</span>
                  <span className="font-medium text-white">{bill.plan}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-navy-700 mt-2">
                  <span className="text-sm font-medium text-gray-300">Total Amount Due</span>
                  <span className="text-xl font-bold text-accent-gold">{formatCurrency(bill.amount)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab('card')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'card' 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'bg-navy-900 text-gray-400 border border-navy-700 hover:bg-navy-700'
                  }`}
                >
                  <IconCreditCard size={18} />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => setActiveTab('upi')}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'upi' 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'bg-navy-900 text-gray-400 border border-navy-700 hover:bg-navy-700'
                  }`}
                >
                  <IconSmartphone size={18} />
                  <span>UPI</span>
                </button>
              </div>

              {/* Forms */}
              <form onSubmit={handlePay}>
                {activeTab === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardChange}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        required
                        className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                          className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••"
                          maxLength="4"
                          required
                          className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="Name on card"
                        required
                        className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'upi' && (
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">UPI ID / VPA</label>
                      <input 
                        type="text" 
                        placeholder="name@upi"
                        required
                        className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-navy-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      />
                    </div>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-navy-600"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">OR</span>
                      <div className="flex-grow border-t border-navy-600"></div>
                    </div>

                    <div className="bg-navy-900 border border-navy-600 rounded-lg p-6 flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3 p-2">
                        <IconQrCode className="text-navy-900 w-full h-full" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Scan QR Code to Pay</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-accent-gold hover:bg-yellow-500 text-navy-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <IconSpinner size={20} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay {formatCurrency(bill.amount)}</span>
                  )}
                </button>
              </form>

              {/* Security Badges */}
              <div className="mt-5 pt-4 border-t border-navy-700 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <IconLock size={12} />
                  <span>Secured with 256-bit encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconShield size={12} />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
