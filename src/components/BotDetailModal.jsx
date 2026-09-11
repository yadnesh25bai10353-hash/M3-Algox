import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const BotDetailModal = ({ bot, isOpen, onClose }) => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setDisclaimerAccepted(false); // Reset on every open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !bot) return null;

  const handleRequestBot = async () => {
    if (!user) {
      onClose();
      navigate('/auth');
      return;
    }
    if (user.botPurchased) {
      alert("You already have an active bot!");
      return;
    }

    setIsRequesting(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        botRequested: true,
      });
      setRequestSuccess(true);
      setTimeout(() => {
        onClose();
        setRequestSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error requesting bot:", error);
      alert("Failed to request bot. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  // ─── DISCLAIMER SCREEN (shown first) ───
  if (!disclaimerAccepted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="w-full max-w-lg max-h-[90vh] flex flex-col relative z-10 bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-navy-700/80 flex justify-between items-center bg-red-950/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-heading font-bold text-white">⚠️ Risk Disclaimer</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-navy-700 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Disclaimer Content */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="bg-navy-900 border border-red-900/30 rounded-xl p-4 sm:p-5 space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white">Please read carefully before proceeding:</strong>
              </p>

              <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
                <p>
                  🔴 <strong className="text-red-400">Trading involves substantial risk of financial loss.</strong> The 
                  expected monthly return of ~35% is an <strong className="text-yellow-400">approximate figure and NOT a fixed 
                  or guaranteed return</strong>. Actual returns may vary significantly and you may lose part or all 
                  of your invested capital.
                </p>

                <p>
                  🔴 <strong className="text-red-400">All risks are entirely yours.</strong> By using M3 Algo or any trading 
                  bot provided by M3 Algox, you acknowledge and accept that:
                </p>

                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>You are trading at <strong className="text-white">your own risk and responsibility</strong>. M3 Algox is not responsible for any losses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>Past performance does not guarantee future results. Markets are unpredictable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>You should only trade with capital that <strong className="text-white">you can afford to lose completely</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>You understand the financial risks involved and have made your own independent decision to use this bot.</span>
                  </li>
                </ul>

                <p className="text-red-300/80 font-medium pt-1">
                  ⚠️ Isme aapki puri risk hogi. Ye aapki khud ki jimmedari pe hai. 
                  Koi bhi loss hua toh uski responsibility sirf aapki hogi.
                </p>
              </div>
            </div>

            {/* Accept Button */}
            <button
              onClick={() => setDisclaimerAccepted(true)}
              className="w-full bg-accent-gold hover:bg-yellow-500 text-navy-900 font-bold py-3.5 rounded-lg transition-all duration-200 active:scale-[0.97] shadow-lg shadow-accent-gold/20 text-sm"
            >
              I Understand & Accept All Risks — Show Bot Details
            </button>

            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-300 font-medium py-2 text-sm transition-colors"
            >
              Cancel — Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── BOT INFORMATION (shown after disclaimer accepted) ───
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 transform transition-all overflow-hidden bg-navy-800 rounded-2xl border border-navy-600 shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-navy-700/80 flex justify-between items-start bg-navy-800/90 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-heading font-bold text-white">{bot.name}</h2>
              <span className="bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                {bot.tag || 'Algo'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Automated Trading Algorithm • AI-Powered</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-navy-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Pricing & Fees */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Pricing & Fees</h3>
            <div className="bg-navy-900 rounded-xl border border-navy-700/50 overflow-hidden">
              <div className="p-4 border-b border-navy-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">📈</span>
                  <span className="text-gray-300 text-sm">Expected Monthly Return</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">~35% Approx</span>
                  <p className="text-[11px] text-yellow-400/80">*Not fixed returns — may vary</p>
                </div>
              </div>
              <div className="p-4 border-b border-navy-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-accent-gold">💰</span>
                  <span className="text-gray-300 text-sm">Profit Sharing</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">30% of Profits</span>
                  <p className="text-[11px] text-gray-500">Payable every 2 weeks</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-accent">🖥️</span>
                  <span className="text-gray-300 text-sm">Monthly VPS Fees</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">₹1,500/month</span>
                  <p className="text-[11px] text-gray-500">For 24/7 bot uptime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Requirements Grid */}
          <div className="grid md:grid-cols-2 gap-8 pt-2">
            <div>
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Key Features</h3>
              <ul className="space-y-3">
                {(bot.features || []).map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Requirements</h3>
              <ul className="space-y-3">
                {(bot.requirements || []).map((req, i) => (
                  <li key={i} className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer inside bot info */}
          <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
            <p className="text-red-300/70 text-xs leading-relaxed">
              <strong className="text-red-400">⚠️ Disclaimer:</strong> Trading involves substantial risk. 
              Expected returns (~35%/month) are approximate and <strong className="text-red-300">not guaranteed</strong>. 
              All trading is at your own risk and responsibility. You could lose some or all of your capital. 
              M3 Algox is not liable for any financial losses. Trade only with money you can afford to lose.
            </p>
          </div>
        </div>

        {/* Footer/Bottom Bar */}
        <div className="p-6 border-t border-navy-700/80 bg-navy-800/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-400 text-xs mb-1">Once you start the bot:</p>
            <p className="text-white font-bold">30% profit share (every 2 weeks) + ₹1,500 VPS/month</p>
          </div>
          
          {requestSuccess ? (
            <div className="flex-shrink-0 bg-green-500/20 text-green-400 border border-green-500/30 font-bold py-3 px-8 rounded-lg flex items-center gap-2">
              <span>✅ Request Sent! Admin will contact you.</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/917721832978?text=Hi%2C%20I%20am%20interested%20in%20M3%20Algo%20bot.%20Please%20share%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-5 rounded-lg transition-all duration-200 active:scale-[0.97] shadow-lg flex items-center gap-2 text-sm justify-center"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <button
                onClick={handleRequestBot}
                disabled={isRequesting}
                className={`flex-shrink-0 font-bold py-3 px-5 rounded-lg transition-all duration-200 active:scale-[0.97] shadow-lg flex items-center justify-center gap-2 text-sm ${
                  isRequesting ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-accent hover:bg-blue-500 text-white shadow-accent/30'
                }`}
              >
                {isRequesting ? 'Requesting...' : 'Request Bot'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotDetailModal;
