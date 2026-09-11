import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToBots = (e) => {
    e.preventDefault();
    document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full overflow-hidden bg-navy-900 border-b border-navy-700">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-[120px] opacity-20 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        {/* Headings */}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Automate Your Trading with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-gold">AI-Powered Bots</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Deploy our flagship M3 Algo trading bot in minutes. High-probability setups with proprietary risk management — all fully automated.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a 
            href="#bots" 
            onClick={scrollToBots}
            className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-accent/20"
          >
            Get M3 Algo
          </a>
          <Link 
            to="/how-it-works" 
            className="w-full sm:w-auto px-8 py-4 bg-navy-800 hover:bg-navy-700 text-white font-semibold border border-navy-600 rounded-lg transition-colors"
          >
            How It Works
          </Link>
        </div>

        {/* Trust features */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No coding required
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            99.7% uptime
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
