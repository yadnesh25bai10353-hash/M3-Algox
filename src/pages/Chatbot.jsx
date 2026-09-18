import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';

const PREDEFINED_QUESTIONS = [
  {
    question: "What is the minimum capital required?",
    answer: "The minimum capital required to run the M3 Algo bot is ₹1,00,000 in your trading account."
  },
  {
    question: "What is the expected return?",
    answer: "The expected return is approximately ~35% monthly. However, please note that this is based on historical data and future results are not guaranteed."
  },
  {
    question: "What are the fees and profit sharing?",
    answer: "We charge a fixed VPS maintenance fee of ₹1,500/month. Additionally, there is a profit-sharing model where 30% of the net profits generated are payable every 2 weeks."
  },
  {
    question: "What is M3 Algo bot?",
    answer: "M3 Algo is an advanced AI-powered algorithmic trading bot optimized for Gold (XAUUSD). It identifies high-probability setups and automates your trades with strict risk management."
  },
  {
    question: "Is there any risk involved?",
    answer: "Trading involves risk, and you could lose capital. However, M3 Algo operates with strict automated risk management, adaptive lot sizing, and auto stop-loss protocols."
  },
  {
    question: "How can I contact support?",
    answer: "For detailed technical support or queries, you can contact us via WhatsApp using the link in the header menu."
  }
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am the M3 Algox Assistant. Please select a question below to get an instant answer.'
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (qa) => {
    // Add user question
    const newMessages = [...messages, { sender: 'user', text: qa.question }];
    setMessages(newMessages);

    // Add bot answer after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: qa.answer }]);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-navy-900">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">M3 Algox Assistant</h1>
        
        <div className="flex-1 bg-navy-800/80 border border-navy-600/50 rounded-xl flex flex-col shadow-xl overflow-hidden backdrop-blur-md max-h-[70vh]">
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

          {/* Quick Reply Questions */}
          <div className="p-4 bg-navy-900/50 border-t border-navy-600/50 overflow-y-auto max-h-48">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Select a question:</p>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_QUESTIONS.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(qa)}
                  className="bg-navy-800 hover:bg-navy-700 border border-navy-600/50 text-gray-300 hover:text-accent text-sm text-left rounded-lg px-4 py-2 transition-all duration-200 shadow-sm"
                >
                  {qa.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatbot;
