import { useEffect, useState } from "react";
import axios from "axios";

function Summary() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get('/api/summary').then(res => setSummary(res.data));
  }, []);

  return (
    <div className="summary-container">
      <div className="summary-header">💼 Summary</div>
      <div className="summary-box">
        <ul>
          <li>🟢 Total Sales: ₹{Number(summary.totalSales || 0).toFixed(2)}</li>
          <li>🔴 Total Purchases: ₹{Number(summary.totalPurchases || 0).toFixed(2)}</li>
          <li>🟢 Ledger Credits: ₹{Number(summary.ledgerCredits || 0).toFixed(2)}</li>
          <li>🔴 Ledger Debits: ₹{Number(summary.ledgerDebits || 0).toFixed(2)}</li>
          <li>📦 Product Profit: ₹{Number(summary.productProfit || 0).toFixed(2)}</li>
          <li>💰 Net Cash Flow: ₹{Number(summary.netCashFlow || 0).toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );

}

export default Summary;
