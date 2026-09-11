import { useState } from 'react';
import Hero from '../components/Hero';
import PurchaseBotSection from '../components/PurchaseBotSection';
import TrustSection from '../components/TrustSection';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Hero />

      {/* Bot Catalog Section */}
      <section id="bots" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <PurchaseBotSection />
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
