import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ExportSummary() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleExport = async () => {
    if (!from || !to) {
      alert("Please select both dates");
      return;
    }

    try {
      const response = await axios.get('/api/export', {
        params: { from, to },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = response.data;

      // Format data for Excel
      const sheetData = data.map(item => ({
        Date: item.date?.split('T')[0],
        Source: item.source,
        Type: item.type,
        Description: item.description,
        Quantity: item.quantity ?? '',
        Buy_Price: item.buy_price ?? '',
        Sell_Price: item.sell_price ?? '',
        Amount: item.amount ?? '',
        Direction: item.direction ?? '',
        Notes: item.notes ?? ''
      }));

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(sheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ledger_Export");

      // Export file
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `LedgerExport_${from}_to_${to}.xlsx`);
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Export failed');
    }
  };

  return (
    <div>
      <h3>📤 Export Combined Summary</h3>
      <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
      <input type="date" value={to} onChange={e => setTo(e.target.value)} />
      <button onClick={handleExport}>📥 Export to Excel</button>
    </div>
  );
}

export default ExportSummary;
