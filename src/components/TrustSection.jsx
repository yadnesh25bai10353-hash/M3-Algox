import React from 'react';
import { stats, testimonials } from '../data/mockData';

const TrustSection = () => {
  return (
    <section id="pricing" className="py-20 bg-navy-900 border-t border-navy-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-navy-800 border border-navy-700 rounded-xl p-6 text-center hover:border-navy-600 transition-colors">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">What Traders Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Join thousands of profitable traders using Yadnesh AI bots.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-navy-800 border border-navy-700 rounded-xl p-6 flex flex-col h-full hover:border-navy-600 transition-colors">
              <div className="flex text-accent-gold text-lg mb-4">
                {"★".repeat(testimonial.rating)}
                <span className="text-gray-600">{"★".repeat(5 - testimonial.rating)}</span>
              </div>
              
              <blockquote className="text-gray-300 italic mb-6 flex-grow">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-navy-700/50">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
