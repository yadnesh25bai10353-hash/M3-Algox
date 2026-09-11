import { useState } from 'react';
import Hero from '../components/Hero';
import BotCard from '../components/BotCard';
import BotDetailModal from '../components/BotDetailModal';
import TrustSection from '../components/TrustSection';
import Footer from '../components/Footer';
import { bots, categories } from '../data/mockData';

export default function Landing() {
  const [selectedBot, setSelectedBot] = useState(null);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Bot Catalog Section */}
      <section id="bots" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            Our Trading Bots
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Choose from our curated selection of battle-tested algorithmic trading bots,
            each designed for specific markets and strategies.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                         bg-navy-700 text-gray-400 hover:text-white hover:bg-navy-600
                         first:bg-accent first:text-white"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onViewDetails={setSelectedBot}
            />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Footer */}
      <Footer />

      {/* Bot Detail Modal */}
      {selectedBot && (
        <BotDetailModal
          bot={selectedBot}
          isOpen={!!selectedBot}
          onClose={() => setSelectedBot(null)}
        />
      )}
    </div>
  );
}
