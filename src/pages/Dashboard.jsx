import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import PurchaseBotSection from '../components/PurchaseBotSection';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('purchase');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(true);

  // Real-time listener for user's bills
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'bills'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBills = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by createdAt descending on the client side to avoid Firestore index requirement
      fetchedBills.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setBills(fetchedBills);
      setBillsLoading(false);
    }, (error) => {
      console.error("Error fetching bills:", error);
      setBillsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handlePayNow = (bill) => {
    const payUrl = `/pay?client=${encodeURIComponent(user.name || user.email)}&amount=${bill.amount}&scanner=${bill.scannerId || '1'}`;
    window.open(payUrl, '_blank');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">Pay Bot Bill</h2>

            {billsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full"></div>
              </div>
            ) : bills.length === 0 ? (
              <div className="bg-navy-800 border border-navy-700/50 p-8 rounded-xl text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-400">No bills yet. You're all clear!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {formatCurrency(bills.filter(b => b.status === 'pending').reduce((s, b) => s + (b.amount || 0), 0))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pending</div>
                  </div>
                  <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(bills.filter(b => b.status === 'paid').reduce((s, b) => s + (b.amount || 0), 0))}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Paid</div>
                  </div>
                </div>

                {/* Bill Cards */}
                {bills.map(bill => (
                  <div key={bill.id} className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{bill.description || 'Bot Bill'}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{formatDate(bill.createdAt)}</p>
                      </div>
                      <span className="text-xl font-bold text-white">{formatCurrency(bill.amount)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bill.status === 'paid'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {bill.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>

                      {bill.status === 'pending' && (
                        <button
                          onClick={() => handlePayNow(bill)}
                          className="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-5 rounded-lg transition-colors text-sm shadow-lg shadow-accent/20"
                        >
                          Pay Now →
                        </button>
                      )}

                      {bill.status === 'paid' && bill.paidAt && (
                        <span className="text-green-500/60 text-xs">Paid on {formatDate(bill.paidAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'purchase':
        return <PurchaseBotSection />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">Settings</h2>
            <div className="bg-navy-800 border border-navy-700/50 p-6 rounded-xl space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <p className="text-white font-medium">{user?.name || '—'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white font-medium">{user?.email || '—'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <p className="text-white font-medium">{user?.phone || '—'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bot Status</label>
                <p className={`font-medium ${user?.botPurchased ? 'text-green-400' : 'text-gray-500'}`}>
                  {user?.botPurchased ? '✅ M3 Algo Active' : 'No bot active'}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const pendingCount = bills.filter(b => b.status === 'pending').length;

  const navLinks = [
    { id: 'purchase', label: '🤖 Purchase Bot' },
    { id: 'billing', label: `💳 Pay Bot Bill${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-navy-800 border-r border-navy-700/50 transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-navy-700/50 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg shadow-accent/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <h2 className="text-white font-bold">{user?.name || 'User'}</h2>
          <p className="text-gray-400 text-sm truncate w-full text-center">{user?.email || 'user@example.com'}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === link.id
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-700/50 space-y-2">
          {user?.isAdmin && (
            <button
              onClick={() => window.location.href = '/admin'}
              className="w-full text-left px-4 py-2 text-accent hover:text-white hover:bg-accent/20 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <span>🔐</span> Admin Panel
            </button>
          )}
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 font-medium"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-navy-800 border-b border-navy-700/50 p-4 flex items-center justify-between z-10 shadow-md">
          <h1 className="text-xl font-heading font-bold text-white">M3 Algox</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
