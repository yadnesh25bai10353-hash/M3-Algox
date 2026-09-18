import React from 'react';
import Footer from '../components/Footer';

const Risk = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">Risk Disclosure</h1>
        
        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-6 mb-8">
          <p className="text-red-400 font-semibold mb-2">High Risk Warning</p>
          <p className="text-red-300/80 text-sm">Trading in financial markets (including Forex, Gold, and Crypto) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.</p>
        </div>

        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. No Guarantees of Profit</h2>
          <p>Before deciding to trade using M3 Algox, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment. Therefore, you should not invest money that you cannot afford to lose.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Algorithmic Trading Risks</h2>
          <p>While M3 Algo is designed to automate trading using AI and mathematical models, it is not infallible. System errors, connectivity issues, broker slippage, or extreme market volatility can result in unexpected losses. M3 Algox is not responsible for any technical failures or market anomalies.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Approximate Returns</h2>
          <p>Any figures regarding expected returns (e.g., ~35% monthly) are purely historical approximations and estimates based on backtesting and past live performance. <strong>Past performance is not indicative of future results.</strong> Returns can vary wildly from month to month.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Independent Advice</h2>
          <p>You should be aware of all the risks associated with trading and seek advice from an independent financial advisor if you have any doubts. By using our service, you acknowledge that you understand these risks and are solely responsible for your own financial decisions.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Risk;
