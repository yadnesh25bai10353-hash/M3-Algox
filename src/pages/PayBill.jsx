import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const IconQrCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 text-navy-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="5" height="5" x="3" y="3" rx="1"/>
    <rect width="5" height="5" x="16" y="3" rx="1"/>
    <rect width="5" height="5" x="3" y="16" rx="1"/>
    <path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>
  </svg>
);

const PayBill = () => {
  const [searchParams] = useSearchParams();
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [scannerId, setScannerId] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    setClientName(searchParams.get('client') || 'Valued Client');
    setAmount(searchParams.get('amount') || '0');
    setScannerId(searchParams.get('scanner') || '1');
  }, [searchParams]);

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hi, I am ${clientName}. I have made the payment of Rs. ${amount} for my bot bill. Please find my payment screenshot attached.`;
    const whatsappUrl = `https://wa.me/917721832978?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Bot Billing</h1>
          <p className="text-gray-400">Secure Payment Gateway</p>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl overflow-hidden">
          {/* Bill Summary */}
          <div className="p-6 border-b border-navy-700 bg-navy-800/50">
            <h3 className="text-lg font-medium text-white mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Client Name</span>
                <span className="text-white font-medium">{clientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Description</span>
                <span className="text-white font-medium">Bot Profit Share & VPS</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-navy-700 mt-3">
                <span className="text-gray-300 font-medium">Total Amount Due</span>
                <span className="text-2xl font-bold text-accent-gold">{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="p-6">
            {!showScanner ? (
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-accent/20"
              >
                Proceed to Pay
              </button>
            ) : (
              <div className="flex flex-col items-center animate-fadeIn">
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Scan the QR Code below using Google Pay, PhonePe, or Paytm to pay <strong className="text-white">{formatCurrency(amount)}</strong>
                </p>
                
                <div className="bg-white p-4 rounded-xl shadow-inner mb-2 relative flex justify-center items-center">
                  {scannerId === '1' ? (
                    <img src="/scanner1.png" alt="Scanner 1" className="w-64 h-auto object-contain rounded-lg" />
                  ) : (
                    <IconQrCode />
                  )}
                  <div className="absolute top-2 right-2 bg-navy-900 text-white text-xs px-2 py-1 rounded font-bold">
                    Scanner {scannerId}
                  </div>
                </div>

                {scannerId !== '1' && (
                  <p className="text-gray-500 text-xs mb-4 text-center">
                    (You can replace this placeholder with your actual GPay scanner image in the code)
                  </p>
                )}

                <div className="bg-navy-900 border border-navy-700 rounded-lg p-3 w-full text-center mb-6">
                  <p className="text-gray-400 text-sm">Or pay using UPI ID:</p>
                  <p className="text-white font-bold tracking-wider mt-1 text-lg select-all">123@ybl</p>
                </div>

                <div className="w-full border-t border-navy-700 pt-6">
                  <h4 className="text-white font-medium mb-2 text-center">Payment Completed?</h4>
                  <p className="text-sm text-gray-400 text-center mb-4">
                    After successful payment, take a screenshot and send it to our WhatsApp for verification.
                  </p>
                  
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Upload Screenshot on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 12 15 16 10"/></svg>
            <span>Verified Process</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayBill;
