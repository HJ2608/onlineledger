// ✅ App.jsx with Inventory Tab
import { useState, useEffect } from 'react';
import Summary from './components/Summary.jsx';
import TransactionDisplay from './components/TransactionDisplay.jsx';
import LedgerDisplay from './components/LedgerDisplay.jsx';
import AddTransactionForm from './components/AddTransactionForm.jsx';
import AddLedgerEntryForm from './components/AddLedgerEntryForm.jsx';
import ExportSummary from './components/ExportSummary.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import InventoryDisplay from './components/InventoryDisplay.jsx';
import axios from 'axios';
import './app.css';

function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login');

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setIsLoggedIn(true);
      setView('app');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setView('login');
  };

  if (view === 'login') return <Login onLogin={() => setView('app')} onSwitchToRegister={() => setView('register')} />;
  if (view === 'register') return <Register onRegister={() => setView('login')} onSwitchToLogin={() => setView('login')} />;

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>{} Ledger</h1>
        <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <div className="tab-buttons">
        <button onClick={() => setActiveTab('summary')}>📊 Summary</button>
        <button onClick={() => setActiveTab('transactions')}>🧾 Transactions</button>
        <button onClick={() => setActiveTab('ledger')}>💼 Ledger</button>
        <button onClick={() => setActiveTab('inventory')}>📦 Inventory</button>
      </div>

      <div className="app-content">
        {activeTab === 'summary' && (
          <>
            <Summary key={refreshKey} />
            <ExportSummary />
          </>
        )}
        {activeTab === 'transactions' && (
          <>
            <AddTransactionForm onSuccess={triggerRefresh} />
            <TransactionDisplay onChange={triggerRefresh} refreshKey={refreshKey} />
          </>
        )}
        {activeTab === 'ledger' && (
          <>
            <AddLedgerEntryForm onSuccess={triggerRefresh} />
            <LedgerDisplay onChange={triggerRefresh} refreshKey={refreshKey} />
          </>
        )}
        {activeTab === 'inventory' && (
          <>
            <InventoryDisplay key={refreshKey} />
          </>
        )}
      </div>
    </div>
  );


}

export default App;
