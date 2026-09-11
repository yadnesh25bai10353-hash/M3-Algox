import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

const AdminPanel = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [bills, setBills] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Bill form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDescription, setBillDescription] = useState('Bot Profit Share & VPS');
  const [billScanner, setBillScanner] = useState('1');
  const [sendingBill, setSendingBill] = useState(false);
  const [billSuccess, setBillSuccess] = useState('');

  // Real-time listeners
  useEffect(() => {
    if (!user?.isAdmin) return;

    const unsubUsers = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    const unsubBills = onSnapshot(
      query(collection(db, 'bills'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setBills(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return () => { unsubUsers(); unsubBills(); };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const botPurchases = users.filter(u => u.botPurchased).length;
  const pendingBills = bills.filter(b => b.status === 'pending').length;
  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);

  const handleSendBill = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !billAmount) return;

    setSendingBill(true);
    setBillSuccess('');

    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    try {
      await addDoc(collection(db, 'bills'), {
        userId: selectedUserId,
        userName: selectedUser.name || 'User',
        userEmail: selectedUser.email,
        userPhone: selectedUser.phone || '',
        amount: Number(billAmount),
        description: billDescription,
        scannerId: billScanner,
        status: 'pending',
        createdAt: serverTimestamp(),
        paidAt: null,
      });

      setBillSuccess(`✅ Bill of ₹${Number(billAmount).toLocaleString('en-IN')} sent to ${selectedUser.name || selectedUser.email}`);
      setBillAmount('');
      setSelectedUserId('');
    } catch (err) {
      setBillSuccess('❌ Error sending bill: ' + err.message);
    } finally {
      setSendingBill(false);
    }
  };

  const handleMarkPaid = async (billId) => {
    try {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'paid',
        paidAt: serverTimestamp(),
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleMarkUnpaid = async (billId) => {
    try {
      await updateDoc(doc(db, 'bills', billId), {
        status: 'pending',
        paidAt: null,
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleToggleBotStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        botPurchased: !currentStatus,
        botName: !currentStatus ? 'M3 Algo' : '',
        botRequested: false, // clear the request flag
      });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'send-bill', label: '📤 Send Bill', icon: '📤' },
    { id: 'bills', label: '💳 All Bills', icon: '💳' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">Admin Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-white">{totalUsers}</div>
                <div className="text-sm text-gray-400 mt-1">Total Users</div>
              </div>
              <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-3xl font-bold text-green-400">{botPurchases}</div>
                <div className="text-sm text-gray-400 mt-1">Bot Purchases</div>
              </div>
              <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <div className="text-3xl font-bold text-yellow-400">{pendingBills}</div>
                <div className="text-sm text-gray-400 mt-1">Pending Bills</div>
              </div>
              <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-3xl font-bold text-accent-gold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-sm text-gray-400 mt-1">Revenue Collected</div>
              </div>
            </div>

            {/* Recent Bills */}
            <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-6">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Recent Bills</h3>
              {bills.length === 0 ? (
                <p className="text-gray-500 text-sm">No bills yet. Send your first bill from the "Send Bill" section.</p>
              ) : (
                <div className="space-y-3">
                  {bills.slice(0, 5).map(bill => (
                    <div key={bill.id} className="flex items-center justify-between p-3 bg-navy-900 rounded-lg border border-navy-700/30">
                      <div>
                        <p className="text-white font-medium text-sm">{bill.userName}</p>
                        <p className="text-gray-500 text-xs">{formatDate(bill.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">₹{bill.amount?.toLocaleString('en-IN')}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          bill.status === 'paid'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {bill.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">All Users ({totalUsers})</h2>

            {/* Desktop Table */}
            <div className="hidden md:block bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-900/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-center">Bot</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <tr key={u.id} className="hover:bg-navy-700/20 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{u.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400">{u.phone || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          u.botPurchased
                            ? 'bg-green-500/20 text-green-400'
                            : u.botRequested 
                              ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30' 
                              : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {u.botPurchased ? '✅ Active' : u.botRequested ? '🔔 Requested' : '❌ No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleBotStatus(u.id, u.botPurchased)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            u.botPurchased
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : u.botRequested
                                ? 'bg-accent-gold hover:bg-yellow-500 text-navy-900 font-bold shadow-lg shadow-accent-gold/20'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {u.botPurchased ? 'Deactivate' : u.botRequested ? 'Approve Request' : 'Activate Bot'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.filter(u => u.role !== 'admin').length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No users registered yet.</p>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {users.filter(u => u.role !== 'admin').map(u => (
                <div key={u.id} className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{u.name || '—'}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      u.botPurchased
                        ? 'bg-green-500/20 text-green-400'
                        : u.botRequested
                          ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {u.botPurchased ? '✅ Active' : u.botRequested ? '🔔 Requested' : '❌ No Bot'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>📱 {u.phone || '—'}</span>
                    <span>Joined: {formatDate(u.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => handleToggleBotStatus(u.id, u.botPurchased)}
                    className={`w-full mt-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                      u.botPurchased
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20'
                        : u.botRequested
                          ? 'bg-accent-gold hover:bg-yellow-500 text-navy-900 font-bold shadow-lg shadow-accent-gold/20'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20'
                    }`}
                  >
                    {u.botPurchased ? 'Deactivate Bot' : u.botRequested ? 'Approve Request' : 'Activate Bot'}
                  </button>
                </div>
              ))}
              {users.filter(u => u.role !== 'admin').length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No users registered yet.</p>
              )}
            </div>
          </div>
        );

      case 'send-bill':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">Send Bill</h2>

            <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-6 max-w-lg">
              {billSuccess && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  billSuccess.startsWith('✅')
                    ? 'bg-green-950/50 border border-green-900/50 text-green-400'
                    : 'bg-red-950/50 border border-red-900/50 text-red-400'
                }`}>
                  {billSuccess}
                </div>
              )}

              <form onSubmit={handleSendBill} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Select Client</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="">— Select a client —</option>
                    {users.filter(u => u.role !== 'admin').map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.email} {u.phone ? `(${u.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bill Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="e.g. 1500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={billDescription}
                    onChange={(e) => setBillDescription(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="e.g. VPS Fee + Profit Share"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Payment Scanner</label>
                  <select
                    value={billScanner}
                    onChange={(e) => setBillScanner(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="1">Scanner 1 (GPay 1)</option>
                    <option value="2">Scanner 2 (GPay 2)</option>
                    <option value="3">Scanner 3 (PhonePe)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={sendingBill}
                  className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-accent/20"
                >
                  {sendingBill ? 'Sending...' : '📤 Send Bill to Client'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'bills':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white">All Bills ({bills.length})</h2>

            {/* Desktop Table */}
            <div className="hidden md:block bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-900/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-700/30">
                  {bills.map(bill => (
                    <tr key={bill.id} className="hover:bg-navy-700/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{bill.userName}</p>
                        <p className="text-gray-500 text-xs">{bill.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{bill.description}</td>
                      <td className="px-4 py-3 text-right text-white font-bold">₹{bill.amount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          bill.status === 'paid'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {bill.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(bill.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        {bill.status === 'pending' ? (
                          <button
                            onClick={() => handleMarkPaid(bill.id)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-xs font-medium transition-colors"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkUnpaid(bill.id)}
                            className="px-3 py-1 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded text-xs font-medium transition-colors"
                          >
                            Undo
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bills.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No bills created yet.</p>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {bills.map(bill => (
                <div key={bill.id} className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{bill.userName}</p>
                      <p className="text-gray-500 text-xs">{bill.description}</p>
                    </div>
                    <span className="text-white font-bold text-lg">₹{bill.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        bill.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {bill.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                      </span>
                      <span className="text-gray-500 text-xs">{formatDate(bill.createdAt)}</span>
                    </div>
                    {bill.status === 'pending' ? (
                      <button
                        onClick={() => handleMarkPaid(bill.id)}
                        className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkUnpaid(bill.id)}
                        className="px-3 py-1.5 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded-lg text-xs font-medium"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bills.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No bills created yet.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-30 w-64 bg-navy-800 border-r border-navy-700/50 transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-navy-700/50">
          <h1 className="font-heading font-bold text-xl text-white">
            🔐 Admin Panel
          </h1>
          <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium ${
                activeSection === item.id
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-navy-800 border-b border-navy-700/50 p-4 flex items-center justify-between z-10 shadow-md">
          <h1 className="text-lg font-heading font-bold text-white">🔐 Admin</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
