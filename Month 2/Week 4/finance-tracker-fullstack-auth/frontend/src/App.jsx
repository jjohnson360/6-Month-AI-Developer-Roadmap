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


// In production, VITE_BACKEND_URL is set to e.g. "https://your-api.onrender.com"
// In local dev it's empty, so we fall back to '/api' (handled by Vite proxy → port 8000)
const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}`
  : '/api';


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
      <div className="min-h-screen flex items-center justify-center p-4" style={{background:'#0a0a0b'}}>
        <div className="w-full max-w-sm card-glass rounded-2xl p-8">
          {/* Brand lockup */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(201,161,90,0.1)',border:'1px solid rgba(201,161,90,0.25)'}}>
              <ShieldCheck className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(135deg,#c9a15a,#e8c98a,#a07840)'}}>
              Finance Tracker
            </h1>
            <p className="text-zinc-500 text-xs mt-1 tracking-wide">
              ff360 Labs · Secure JWT Authentication
            </p>
          </div>

          {/* Auth toggle tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl mb-6" style={{background:'rgba(10,10,11,0.8)',border:'1px solid rgba(255,255,255,0.06)'}}>
            <button
              onClick={() => setAuthMode('login')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'text-[#0a0a0b] shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={authMode === 'login' ? {background:'linear-gradient(135deg,#c9a15a,#a07840)'} : {}}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register'
                  ? 'text-[#0a0a0b] shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={authMode === 'register' ? {background:'linear-gradient(135deg,#c9a15a,#a07840)'} : {}}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="enter username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors"
                  style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
                  onFocus={e => e.target.style.borderColor='rgba(201,161,90,0.5)'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
                  required
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors"
                    style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
                    onFocus={e => e.target.style.borderColor='rgba(201,161,90,0.5)'}
                    onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors"
                  style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
                  onFocus={e => e.target.style.borderColor='rgba(201,161,90,0.5)'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-2"
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
    <div className="min-h-screen text-zinc-100 p-4 md:p-8" style={{background:'#0a0a0b'}}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 gap-4" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent" style={{backgroundImage:'linear-gradient(135deg,#c9a15a 0%,#e8c98a 50%,#a07840 100%)'}}>
              Finance Analytics · ff360 Labs
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Month 2, Week 4 · Protected JWT · User: <span className="text-gold font-semibold">{currentUser.username}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-zinc-400" style={{background:'#17171a',border:'1px solid rgba(255,255,255,0.06)'}}>
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{currentUser.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Total Balance</span>
              <div className="p-2 rounded-xl" style={{background:'rgba(201,161,90,0.1)',border:'1px solid rgba(201,161,90,0.2)'}}>
                <Wallet className="w-5 h-5 text-gold" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-3 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-600 mt-2">Net user funds</div>
          </div>

          <div className="card-glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Total Income</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/15">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-emerald-400">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-600 mt-2">Gross credited revenue</div>
          </div>

          <div className="card-glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Total Expenses</span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/15">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-3 text-rose-400">
              -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-600 mt-2">Gross debited outgoing</div>
          </div>

          <div className="card-glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Savings Rate</span>
              <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/15">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-3 ${Number(savingsRate) >= 20 ? 'text-teal-400' : Number(savingsRate) >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
              {savingsRate}%
            </div>
            <div className="text-xs text-zinc-600 mt-2">Percentage saved</div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-gold" />
                  Expense Breakdown by Category
                </h3>
              </div>

              {categoryExpenseData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-zinc-600 rounded-xl" style={{border:'1px dashed rgba(255,255,255,0.07)'}}>
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
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0b" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#17171a',
                          borderColor: 'rgba(201,161,90,0.2)',
                          borderRadius: '12px',
                          color: '#f1f1f1'
                        }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Expense']}
                      />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#71717a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Income vs. Expenses Overview
                </h3>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeVsExpenseData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="#3f3f46" tick={{ fill: '#71717a' }} />
                    <YAxis stroke="#3f3f46" tick={{ fill: '#71717a' }} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#17171a',
                        borderColor: 'rgba(201,161,90,0.2)',
                        borderRadius: '12px',
                        color: '#f1f1f1'
                      }}
                      formatter={(val) => [`$${Number(val).toFixed(2)}`]}
                    />
                    <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#71717a' }} />
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
          <div className="card-glass rounded-2xl p-6 h-fit">
            <h3 className="text-base font-bold text-zinc-100 mb-5 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-gold" />
              Add Record
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paycheck, Groceries"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors"
                  style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
                  onFocus={e => e.target.style.borderColor='rgba(201,161,90,0.5)'}
                  onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Amount ($)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 placeholder-zinc-700 focus:outline-none transition-colors"
                    style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
                    onFocus={e => e.target.style.borderColor='rgba(201,161,90,0.5)'}
                    onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.07)'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none transition-colors"
                  style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
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
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2.5 rounded-xl font-medium text-sm border transition-all ${
                      type === 'expense'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    style={type !== 'expense' ? {background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'} : {}}
                  >
                    Expense
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2.5 rounded-xl font-medium text-sm border transition-all ${
                      type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    style={type !== 'income' ? {background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'} : {}}
                  >
                    Income
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Save Transaction
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 card-glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gold" />
                  Protected Records ({filteredTransactions.length})
                </h3>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-600" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
                    style={{background:'#0a0a0b',border:'1px solid rgba(255,255,255,0.07)'}}
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
                <div className="py-16 text-center text-zinc-600 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-gold" />
                  <span>Loading transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="py-16 text-center text-zinc-600 rounded-xl" style={{border:'1px dashed rgba(255,255,255,0.07)'}}>
                  No records found. Add a new record above!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {filteredTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 rounded-xl transition-all group"
                      style={{background:'rgba(10,10,11,0.6)',border:'1px solid rgba(255,255,255,0.05)'}}
                      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,161,90,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-xl border ${
                          t.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                        }`}>
                          {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="font-semibold text-zinc-100">{t.title}</div>
                          <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded text-white text-[10px] font-semibold uppercase tracking-wider"
                              style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#3f3f46' }}
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
                          className="p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
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
