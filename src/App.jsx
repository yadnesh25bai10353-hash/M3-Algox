import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation';
import Header from './components/Header';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PayBill from './pages/PayBill';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Risk from './pages/Risk';

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
        <main className="pt-16 flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/pay" element={<PayBill />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/risk" element={<Risk />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
