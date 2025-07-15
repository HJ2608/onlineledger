//cost/sell price columns
import { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionDisplay({ onChange, refreshKey }) {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = () => {
    axios.get('/api/transactions').then(res => setTransactions(res.data));
  };

  const handleDelete = async id => {
    await axios.delete(`/api/transaction/${id}`);
    fetchData();
    onChange?.();
  };

  const handleEditClick = tx => {
    setEditing(tx.id);
    setFormData({ ...tx });
  };

  const handleEditChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`/api/transaction/${editing}`, formData);
    setEditing(null);
    fetchData();
    onChange?.();
  };

  return (
    <div>
      <h3>Transactions</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Cost Price</th>
            <th>Sell Price</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={`tx-${tx.id}`}>
              {editing === tx.id ? (
                <>
                  <td>{tx.date?.split('T')[0]}</td>
                  <td><input name="type" value={formData.type} onChange={handleEditChange} /></td>
                  <td><input name="product" value={formData.product} onChange={handleEditChange} /></td>
                  <td><input name="quantity" type="number" value={formData.quantity} onChange={handleEditChange} /></td>
                  <td>
                    {formData.type === 'purchase' && (
                      <input name="buy_price" type="number" value={formData.buy_price} onChange={handleEditChange} />
                    )}
                  </td>
                  <td>
                    {formData.type === 'sale' && (
                      <input name="sell_price" type="number" value={formData.sell_price} onChange={handleEditChange} />
                    )}
                  </td>
                  <td><input name="notes" value={formData.notes} onChange={handleEditChange} /></td>
                  <td>
                    <button onClick={handleUpdate}>✅ Save</button>
                    <button onClick={() => setEditing(null)}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{tx.date?.split('T')[0]}</td>
                  <td>{tx.type.toUpperCase()}</td>
                  <td>{tx.product}</td>
                  <td>{tx.quantity}</td>
                  <td>{tx.type === 'purchase' ? `₹${tx.buy_price}` : ''}</td>
                  <td>{tx.type === 'sale' ? `₹${tx.sell_price}` : ''}</td>
                  <td>{tx.notes}</td>
                  <td>
                    <button onClick={() => handleEditClick(tx)}>✏️</button>
                    <button onClick={() => handleDelete(tx.id)}>🗑</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionDisplay;