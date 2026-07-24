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
  Sparkles
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

// Custom Palette for Category Charts
const CATEGORY_COLORS = {
  'Food': '#F59E0B',        // Amber
  'Salary': '#10B981',      // Emerald
  'Utilities': '#3B82F6',   // Blue
  'Entertainment': '#EC4899',// Pink
  'Shopping': '#8B5CF6',     // Purple
  'Health': '#06B6D4',       // Cyan
  'Other': '#64748B',        // Slate
};

const DEFAULT_SAMPLE_DATA = [
  { title: 'Tech Salary', amount: 4500.0, category: 'Salary', type: 'income' },
  { title: 'Apartment Rent & Utilities', amount: 1400.0, category: 'Utilities', type: 'expense' },
  { title: 'Grocery Shopping', amount: 350.0, category: 'Food', type: 'expense' },
  { title: 'Concert & Movies', amount: 120.0, category: 'Entertainment', type: 'expense' },
  { title: 'Gym & Fitness', amount: 65.0, category: 'Health', type: 'expense' },
  { title: 'Freelance Design', amount: 800.0, category: 'Salary', type: 'income' },
  { title: 'New Clothes & Shoes', amount: 180.0, category: 'Shopping', type: 'expense' }
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      setTransactions(data);
      setBackendStatus('online');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to FastAPI backend. Ensure uvicorn is running on http://127.0.0.1:8000');
      setBackendStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        amount: parseFloat(amount),
        category,
        type
      };

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create transaction');
      
      setTitle('');
      setAmount('');
      await fetchTransactions();
    } catch (err) {
      alert(`Error creating transaction: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert(`Error deleting transaction: ${err.message}`);
    }
  };

  const handlePopulateSampleData = async () => {
    setLoading(true);
    try {
      for (const item of DEFAULT_SAMPLE_DATA) {
        await fetch(`${API_BASE}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      await fetchTransactions();
    } catch (err) {
      alert(`Error adding sample data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Metrics Calculations
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

  // Chart Data Calculations
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
    {
      name: 'Totals',
      Income: totalIncome,
      Expense: totalExpense,
    }
  ], [totalIncome, totalExpense]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    if (selectedFilter === 'income') return transactions.filter(t => t.type === 'income');
    if (selectedFilter === 'expense') return transactions.filter(t => t.type === 'expense');
    if (selectedFilter !== 'all') return transactions.filter(t => t.category === selectedFilter);
    return transactions;
  }, [transactions, selectedFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Finance Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Month 2, Week 3 • Recharts Visualization + FastAPI + PostgreSQL
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              backendStatus === 'online' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {backendStatus === 'online' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              Backend: {backendStatus === 'online' ? 'Online (PostgreSQL)' : 'Offline'}
            </span>

            {transactions.length === 0 && (
              <button
                onClick={handlePopulateSampleData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-semibold transition-all"
                title="Add sample data to preview charts"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Demo Data
              </button>
            )}

            <button
              onClick={fetchTransactions}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Metric Cards (4 Summary Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Balance */}
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
            <div className="text-xs text-slate-500 mt-2">Net funds available</div>
          </div>

          {/* Total Income */}
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

          {/* Total Expenses */}
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

          {/* Savings Rate */}
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
            <div className="text-xs text-slate-500 mt-2">Percentage of income saved</div>
          </div>
        </div>

        {/* Analytics Section: Recharts Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Donut Chart: Expense Breakdown by Category */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-indigo-400" />
                  Expense Breakdown by Category
                </h3>
                <span className="text-xs text-slate-400 font-medium">Categorized Outflow</span>
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
                          color: '#f8fafc',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Expense']}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#94a3b8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Bar Chart: Income vs. Expenses Comparison */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Income vs. Expenses Overview
                </h3>
                <span className="text-xs text-slate-400 font-medium">Comparison</span>
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

        {/* Main Section: Add Transaction Form & Filtered List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Transaction Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Add New Record
            </h3>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Rent, Coffee"
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
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-lg shadow-rose-500/10'
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
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
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
                Add Transaction
              </button>
            </form>
          </div>

          {/* Filterable Transactions List */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  Transaction Log ({filteredTransactions.length})
                </h3>

                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">All Types & Categories</option>
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

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                  <span>Loading analytics & transactions...</span>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl flex flex-col items-center gap-3">
                  <span>No transactions match the selected filter.</span>
                  {transactions.length === 0 && (
                    <button
                      onClick={handlePopulateSampleData}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Load Sample Data
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
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
