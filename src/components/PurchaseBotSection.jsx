import React, { useState } from 'react';
import BotDetailModal from './BotDetailModal';
import { useAuth } from '../context/AuthContext';

const m3AlgoBot = {
  id: 100,
  name: 'M3 Algo',
  slug: 'm3-algo',
  asset: 'Multi-Asset',
  category: 'Algo',
  description: 'M3 Algo is an advanced multi-asset algorithmic trading bot powered by AI. It identifies high-probability trade setups across multiple markets using proprietary signal generation and risk management systems.',
  longDescription: 'M3 Algo uses a sophisticated 3-layer signal filtering system combined with real-time market microstructure analysis. The algorithm adapts to changing market conditions automatically, adjusting position sizes and entry/exit criteria based on volatility regimes. It operates with strict risk management protocols to protect your capital while targeting consistent returns.',
  expectedReturn: '~35% Monthly (Approx)',
  profitShare: '30% of profits every 2 weeks',
  vpsFees: '₹1,500/month',
  rating: 4.9,
  reviews: 312,
  deployed: 1850,
  winRate: '72%',
  timeframe: 'Intraday + Positional',
  minCapital: '₹50,000',
  features: [
    'AI-powered signal generation',
    'Multi-asset coverage',
    'Automated risk management',
    'Real-time position monitoring',
    'Auto stop-loss & take-profit',
    'Adaptive lot sizing',
    'Low drawdown strategy',
    'Daily P&L reports',
  ],
  requirements: [
    'Active trading account with API access',
    'Minimum ₹50,000 capital',
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
        <div className="bg-navy-800 border border-navy-600/50 rounded-xl shadow-lg hover:shadow-xl hover:border-navy-500 transition-all duration-300 overflow-hidden">
          {/* Tag */}
          <div className="bg-gradient-to-r from-accent-gold/20 to-accent/20 border-b border-navy-700/50 px-5 py-2 flex items-center justify-between">
            <span className="text-accent-gold text-xs font-bold uppercase tracking-widest">⚡ Flagship Bot</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-accent-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-300 text-sm font-semibold">4.9</span>
              <span className="text-gray-500 text-xs">({m3AlgoBot.reviews} reviews)</span>
            </div>
          </div>

          <div className="p-6">
            {/* Bot Name */}
            <h3 className="font-heading font-bold text-2xl text-white mb-1">M3 Algo</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Multi-Asset • AI-Powered</p>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Advanced multi-asset algorithmic trading bot powered by AI. Identifies high-probability setups with proprietary risk management.
            </p>



            {/* Pricing Summary */}
            <div className="bg-navy-900/70 rounded-lg p-4 border border-navy-700/30 mb-5 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Profit Sharing</span>
                <span className="text-white font-semibold">30% of profits (every 2 weeks)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">VPS Fees</span>
                <span className="text-white font-semibold">₹1,500/month</span>
              </div>
            </div>

            {/* CTA */}
            {user?.botPurchased ? (
              <div className="w-full bg-green-500/20 text-green-400 border border-green-500/30 text-center font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                <span>✅ Bot Active & Purchased</span>
              </div>
            ) : user?.botRequested ? (
              <div className="w-full bg-accent-gold/20 text-accent-gold border border-accent-gold/30 text-center font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                <span>⏳ Request Pending Approval</span>
              </div>
            ) : (
              <button
                onClick={handleViewDetails}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.97] shadow-lg shadow-accent/20 hover:shadow-accent/30"
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
                Yadnesh AI is not liable for any losses incurred. Please trade only with capital you can afford to lose.
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
