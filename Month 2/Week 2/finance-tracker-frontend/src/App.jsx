import React, { useState, useEffect } from 'react';
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
  AlertCircle 
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

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

  // Metrics Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Finance Tracker
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              React + Tailwind CSS Frontend • FastAPI + PostgreSQL Backend
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

            <button
              onClick={fetchTransactions}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Total Balance</span>
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold mt-4 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Net calculated income vs expenses</div>
          </div>

          {/* Total Income Card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Total Income</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-4 text-emerald-400">
              +${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Total credited earnings</div>
          </div>

          {/* Total Expense Card */}
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">Total Expenses</span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold mt-4 text-rose-400">
              -${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 mt-2">Total debited spending</div>
          </div>
        </div>

        {/* Main Content Grid: Form + List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              Add Transaction
            </h2>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Grocery Shopping"
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

          {/* Right Column: Transactions List */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-400" />
                  Recent Transactions ({transactions.length})
                </h2>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                  <span>Loading transactions from backend...</span>
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No transactions recorded yet. Add your first transaction above!
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t) => (
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
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-[10px] font-medium uppercase tracking-wider">
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
