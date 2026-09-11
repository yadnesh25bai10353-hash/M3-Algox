import React from 'react';

const getTagColor = (tag) => {
  switch (tag?.toLowerCase()) {
    case 'best seller': return 'bg-accent-gold text-navy-900';
    case 'popular': return 'bg-accent text-white';
    case 'new': return 'bg-green-500 text-white';
    case 'premium': return 'bg-purple-500 text-white';
    case 'top rated': return 'bg-accent text-white';
    default: return 'bg-navy-600 text-white';
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const BotCard = ({ bot, onViewDetails }) => {
  const { name, asset, description, price, originalPrice, rating, reviews, deployed, winRate, tag } = bot;

  return (
    <div className="relative bg-navy-800 border border-navy-700 rounded-xl p-5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all flex flex-col h-full group">
      
      {/* Tag Badge */}
      {tag && (
        <div className={`absolute top-4 right-4 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${getTagColor(tag)}`}>
          {tag}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 pr-16">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{asset}</span>
        <h3 className="font-heading font-semibold text-xl text-white mt-1 group-hover:text-accent transition-colors">{name}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 line-clamp-2 mb-5 flex-grow">
        {description}
      </p>

      {/* Stats Row */}
      <div className="flex items-center justify-between py-3 border-y border-navy-700/50 mb-4 bg-navy-900/30 rounded-lg px-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Win Rate</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-semibold text-white">{winRate}%</span>
          </div>
        </div>
        <div className="w-px h-8 bg-navy-700/50"></div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Deployed</p>
          <p className="text-sm font-semibold text-white">{deployed.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-accent-gold text-lg">
          {"★".repeat(Math.floor(rating))}
          <span className="text-gray-600">{"★".repeat(5 - Math.floor(rating))}</span>
        </div>
        <span className="text-sm font-medium text-white">{rating}</span>
        <span className="text-xs text-gray-500">({reviews} reviews)</span>
      </div>

      {/* Price & Action */}
      <div className="mt-auto pt-4 border-t border-navy-700 flex flex-col gap-4">
        <div className="flex items-end gap-3">
          <span className="text-2xl font-bold text-white leading-none">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through mb-0.5">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        <button 
          onClick={() => onViewDetails(bot)}
          className="w-full py-2.5 bg-navy-700 hover:bg-accent text-white font-medium rounded-lg transition-colors border border-navy-600 hover:border-accent"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BotCard;
