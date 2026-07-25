import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Auth from './Auth'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;

    const newTransaction = {
      title,
      amount: parseFloat(amount),
      category,
      type
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTransaction)
      });
      
      if (response.ok) {
        setTitle('');
        setAmount('');
        setCategory('');
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (!token) {
    return <Auth onLoginSuccess={() => setToken(localStorage.getItem('token'))} />;
  }

  // Summary Metrics & Recharts Data Calculation
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-400">Personal Finance Tracker</h1>
            <p className="text-slate-400 text-sm">Secured Dashboard</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-sm font-medium transition"
          >
            Log Out
          </button>
        </header>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-medium">Total Balance</h3>
            <p className={`text-3xl font-bold mt-2 ${netBalance >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
              ${netBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-medium">Total Income</h3>
            <p className="text-3xl font-bold mt-2 text-emerald-400">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-slate-400 text-sm font-medium">Total Expenses</h3>
            <p className="text-3xl font-bold mt-2 text-rose-400">${totalExpense.toFixed(2)}</p>
          </div>
        </div>

        {/* Data Visualization Chart */}
        {categoryData.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Expenses by Category</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 border border-slate-700">
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
          <input 
            type="number" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
          <input 
            type="text" 
            placeholder="Category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium py-2 transition shadow">
            Add
          </button>
        </form>

        {/* Transaction List */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-slate-400 text-sm">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div>
                    <h3 className="font-medium text-slate-200">{t.title}</h3>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{t.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      className="text-slate-500 hover:text-rose-400 text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App