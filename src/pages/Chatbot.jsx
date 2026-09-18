import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am the M3 Algox Assistant. I can answer basic questions about our trading bot, such as minimum capital, expected returns, fees, or how it works. How can I help you today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('minimum') || input.includes('capital') || input.includes('investment') || input.includes('fund')) {
      return "The minimum capital required to run the M3 Algo bot is ₹50,000 in your trading account.";
    }
    
    if (input.includes('return') || input.includes('profit') || input.includes('yield') || input.includes('earn')) {
      return "The expected return is approximately ~35% monthly. However, please note that this is based on historical data and future results are not guaranteed.";
    }
    
    if (input.includes('fee') || input.includes('vps') || input.includes('cost') || input.includes('charge') || input.includes('price')) {
      return "We charge a fixed VPS maintenance fee of ₹1,500/month. Additionally, there is a profit-sharing model where 30% of the net profits generated are payable every 2 weeks.";
    }
    
    if (input.includes('what is') || input.includes('how it works') || input.includes('about')) {
      return "M3 Algo is an advanced AI-powered algorithmic trading bot optimized for Gold (XAUUSD). It identifies high-probability setups and automates your trades with strict risk management.";
    }
    
    if (input.includes('risk') || input.includes('safe') || input.includes('loss') || input.includes('drawdown')) {
      return "Trading involves risk, and you could lose capital. However, M3 Algo operates with strict automated risk management, adaptive lot sizing, and auto stop-loss protocols.";
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! How can I assist you with the M3 Algo bot today?";
    }
    
    if (input.includes('support') || input.includes('contact') || input.includes('help') || input.includes('whatsapp')) {
      return "For detailed technical support or queries, you can contact us via WhatsApp at our support number provided in the header menu.";
    }

    return "I'm a basic assistant and might not understand complex queries yet. Try asking me about 'minimum capital', 'fees', 'expected returns', or 'risk'. For detailed support, please reach out via WhatsApp.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate slight delay for bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-navy-900">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">M3 Algox Assistant</h1>
        
        <div className="flex-1 bg-navy-800/80 border border-navy-600/50 rounded-xl flex flex-col shadow-xl overflow-hidden backdrop-blur-md">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.sender === 'user' 
                      ? 'bg-accent text-navy-900 rounded-br-none shadow-glow-gold' 
                      : 'bg-navy-700 text-gray-200 border border-navy-600/50 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-navy-900/50 border-t border-navy-600/50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about minimum capital, fees, returns..."
                className="flex-1 bg-navy-800 border border-navy-600/50 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-accent hover:bg-accent-dark text-navy-900 font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatbot;
