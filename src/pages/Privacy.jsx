import React from 'react';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy-900 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p>At M3 Algox, your privacy is a top priority. This Privacy Policy outlines how we collect, use, and protect your information.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, phone number.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Trading Data and API Keys</h2>
          <p>To operate the trading bot, we require read/trade API access to your broker account. <strong>We do not ask for or store withdrawal permissions.</strong> We monitor trading data (P&L, trades executed) strictly for performance tracking and calculating the 30% profit share.</p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. How We Use Collected Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To run and operate our Site and trading bots.</li>
            <li>To improve customer service and support.</li>
            <li>To send periodic emails or WhatsApp messages regarding billing, updates, or alerts.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. How We Protect Your Information</h2>
          <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site.</p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Sharing Your Personal Information</h2>
          <p>We do not sell, trade, or rent Users' personal identification information to others.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
