import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  DollarSign, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  PieChart as PieChartIcon,
  BarChart3,
  Percent,
  Filter,
  Lock,
  User,
  Mail,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from 'recharts';

const API_BASE = '/api';

const CATEGORY_COLORS = {
  'Food': '#F59E0B',
  'Salary': '#10B981',
  'Utilities': '#3B82F6',
  'Entertainment': '#EC4899',
  'Shopping': '#8B5CF6',
  'Health': '#06B6D4',
  'Other': '#64748B',
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Auth Form State
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Application State
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Transaction Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate Token and Fetch User Profile
  const fetchUserProfile = async (currentToken) => {
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData);
        fetchTransactions(currentToken);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Auth verification error:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', authUsername);
      formData.append('password', authPassword);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('jwt_token', data.access_token);
      setToken(data.access_token);
      setAuthPassword('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authUsername,
          email: authEmail,
          password: authPassword
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginFormData = new URLSearchParams();
      loginFormData.append('username', authUsername);
      loginFormData.append('password', authPassword);

      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginFormData
      });

      const loginData = await loginRes.json();
      localStorage.setItem('jwt_token', loginData.access_token);
      setToken(loginData.access_token);
      setAuthPassword('');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken('');
    setCurrentUser(null);
    setTransactions([]);
  };

  const fetchTransactions = async (currentToken = token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsSubmitting(true);
    try {
      const payload = { title, amount: parseFloat(amount), category, type };
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create transaction');
      setTitle('');
      setAmount('');
      await fetchTransactions();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Metric Calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  const categoryExpenseData = useMemo(() => {
    const expenseMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + Number(t.amount);
      });

    return Object.keys(expenseMap).map(cat => ({
      name: cat,
      value: expenseMap[cat],
      color: CATEGORY_COLORS[cat] || '#64748B'
    }));
  }, [transactions]);

  const incomeVsExpenseData = useMemo(() => [
    { name: 'Totals', Income: totalIncome, Expense: totalExpense }
  ], [totalIncome, totalExpense]);

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'income') return transactions.filter(t => t.type === 'income');
    if (selectedFilter === 'expense') return transactions.filter(t => t.type === 'expense');
    if (selectedFilter !== 'all') return transactions.filter(t => t.category === selectedFilter);
    return transactions;
  }, [transactions, selectedFilter]);

  // Render Auth Screen if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Decorative Background Gradients */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Finance Tracker Auth
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Month 2, Week 4 • Secure JWT Authentication
            </p>
          </div>

          {/* Auth Toggle Tabs */}
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="enter username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {authMode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Authenticated Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Finance Analytics & JWT Auth
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Month 2, Week 4 • Protected JWT Endpoints • User: <span className="text-emerald-400 font-semibold">{currentUser.username}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentUser.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Balance</span>
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-3 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Net user funds</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Income</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-emerald-400">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Gross credited revenue</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-rose-400">
              -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Gross debited outgoing</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Savings Rate</span>
              <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-3 ${Number(savingsRate) >= 20 ? 'text-teal-400' : Number(savingsRate) >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
              {savingsRate}%
            </div>
            <div className="text-xs text-slate-500 mt-2">Percentage saved</div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-indigo-400" />
                  Expense Breakdown by Category
                </h3>
              </div>

              {categoryExpenseData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No expense data to display. Add expenses to render chart!
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryExpenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderColor: '#334155', 
                          borderRadius: '12px',
                          color: '#f8fafc' 
                        }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Expense']}
                      />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Income vs. Expenses Overview
                </h3>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeVsExpenseData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '12px',
                        color: '#f8fafc' 
                      }}
                      formatter={(val) => [`$${Number(val).toFixed(2)}`]}
                    />
                    <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} />
                    <Bar dataKey="Income" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                    <Bar dataKey="Expense" fill="#F43F5E" radius={[8, 8, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Form & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Add Record
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paycheck, Groceries"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Salary">Salary & Income</option>
                  <option value="Utilities">Utilities & Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health & Fitness</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2.5 rounded-xl font-medium text-sm border transition-all ${
                      type === 'expense'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2.5 rounded-xl font-medium text-sm border transition-all ${
                      type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Save Transaction
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  Your Protected Records ({filteredTransactions.length})
                </h3>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Records</option>
                    <option value="income">Incomes Only</option>
                    <option value="expense">Expenses Only</option>
                    <option value="Food">Food</option>
                    <option value="Salary">Salary</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                  <span>Loading user transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No records found for your account. Add a new record above!
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-slate-700 transition-colors group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl border ${
                          t.type === 'income' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="font-semibold text-slate-100">{t.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span 
                              className="px-2 py-0.5 rounded text-white text-[10px] font-semibold uppercase tracking-wider"
                              style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#64748B' }}
                            >
                              {t.category}
                            </span>
                            <span>ID: #{t.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`font-bold text-base ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                        </div>

                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
