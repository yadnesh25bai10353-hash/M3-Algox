import React, { useState } from 'react';
import BotDetailModal from './BotDetailModal';
import { useAuth } from '../context/AuthContext';

const m3AlgoBot = {
  id: 100,
  name: 'M3 Algo',
  slug: 'm3-algo',
  asset: 'Gold (XAUUSD)',
  category: 'Algo',
  description: 'M3 Algo is an advanced Gold (XAUUSD) algorithmic trading bot powered by AI. It identifies high-probability trade setups in the gold market using proprietary signal generation and risk management systems.',
  longDescription: 'M3 Algo uses a sophisticated 3-layer signal filtering system combined with real-time market microstructure analysis for Gold. The algorithm adapts to changing market conditions automatically, adjusting position sizes and entry/exit criteria based on volatility regimes. It operates with strict risk management protocols to protect your capital while targeting consistent returns.',
  expectedReturn: '~35% Monthly (Approx)',
  profitShare: '30% of profits every 2 weeks',
  vpsFees: '₹1,500/month',
  rating: 4.9,
  reviews: 312,
  deployed: 1850,
  winRate: '72%',
  timeframe: 'Intraday + Positional',
  minCapital: '₹1,00,000',
  features: [
    'AI-powered signal generation',
    'Optimized for Gold (XAUUSD)',
    'Automated risk management',
    'Real-time position monitoring',
    'Auto stop-loss & take-profit',
    'Adaptive lot sizing',
    'Daily P&L reports',
  ],
  requirements: [
    'Active trading account with API access',
    'Minimum ₹1,00,000 capital',
    'VPS (₹1,500/month) for 24/7 uptime',
    'Stable internet connection',
  ],
  tag: 'Flagship',
};

const PurchaseBotSection = () => {
  const [selectedBot, setSelectedBot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth() || {};

  const handleViewDetails = () => {
    setSelectedBot(m3AlgoBot);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Purchase a Bot</h2>
        <p className="text-gray-400">Our flagship algorithmic trading solution.</p>
      </div>

      {/* M3 Algo Bot Card */}
      <div className="max-w-lg">
        <div className="bg-navy-800/80 backdrop-blur-md border border-accent/20 rounded-xl shadow-2xl hover:shadow-glow-gold hover:border-accent/60 transition-all duration-500 overflow-hidden relative group">
          {/* Subtle animated gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          {/* Tag */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 border-b border-accent/20 px-5 py-3 flex items-center justify-between">
            <span className="text-accent-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Flagship Bot
            </span>
          </div>

          <div className="p-6 md:p-8 relative z-10">
            {/* Bot Name */}
            <h3 className="font-heading font-extrabold text-3xl text-white mb-1 tracking-tight">M3 Algo</h3>
            <p className="text-xs text-accent-light uppercase tracking-widest mb-4 font-semibold">Gold (XAUUSD) • AI-Powered</p>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
              Advanced Gold (XAUUSD) algorithmic trading bot powered by AI. Identifies high-probability setups with proprietary risk management.
            </p>



            {/* Pricing Summary */}
            <div className="bg-navy-900/90 rounded-lg p-5 border border-accent/10 mb-6 space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Profit Sharing</span>
                <span className="text-white font-medium">30% of profits <span className="text-gray-500 text-xs font-normal">(every 2 weeks)</span></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">VPS Fees</span>
                <span className="text-white font-medium">₹1,500/month</span>
              </div>
            </div>

            {/* CTA */}
            {user?.botPurchased ? (
              <div className="w-full bg-green-500/10 text-green-400 border border-green-500/30 text-center font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                <span>✅ Bot Active & Purchased</span>
              </div>
            ) : user?.botRequested ? (
              <div className="w-full bg-accent-gold/10 text-accent-gold border border-accent-gold/30 text-center font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                <span>⏳ Request Pending Approval</span>
              </div>
            ) : (
              <button
                onClick={handleViewDetails}
                className="w-full btn-primary py-4 text-base tracking-wide"
              >
                View Details & Request
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer below bot card */}
        <div className="mt-5 p-4 bg-red-950/30 border border-red-900/40 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-red-400 font-semibold text-sm mb-1">⚠️ Risk Disclaimer</h4>
              <p className="text-red-300/70 text-xs leading-relaxed">
                Trading in financial markets involves substantial risk of loss and is not suitable for every investor. 
                Past performance and expected returns are not indicative of future results. The ~35% expected monthly return is approximate 
                and <strong className="text-red-300">not guaranteed</strong>. You could lose some or all of your invested capital. 
                By using this bot, you acknowledge that all trading decisions and risks are entirely your own responsibility. 
                M3 Algox is not liable for any losses incurred. Please trade only with capital you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBot && (
        <BotDetailModal
          bot={selectedBot}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PurchaseBotSection;
