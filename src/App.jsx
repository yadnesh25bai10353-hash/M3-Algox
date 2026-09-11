import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation';
import Header from './components/Header';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PayBill from './pages/PayBill';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}

      <div
        className={`transition-opacity duration-700 ${
          introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/pay" element={<PayBill />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
