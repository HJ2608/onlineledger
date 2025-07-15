import { useEffect, useState } from 'react';
import axios from 'axios';

function LedgerDisplay({ onChange, refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = () => {
    setLoading(true);
    axios.get('/api/entries')
      .then(res => setEntries(res.data))
      .finally(() => setLoading(false));
  };

  const handleDelete = async id => {
    await axios.delete(`/api/entry/${id}`);
    onChange?.();
  };

  const handleEditClick = entry => {
    setEditing(entry.id);
    setFormData({ ...entry });
  };

  const handleEditChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`/api/entry/${editing}`, formData);
    setEditing(null);
    onChange?.();
  };

  return (
    <div>
      <h3>Ledger Entries</h3>
      {loading && <p>Loading...</p>}
      <ul>
        {entries.map((entry, index) => (
          <li key={`entry-${entry.id ?? index}`}>
            {editing === entry.id ? (
              <div>
                <input name="type" value={formData.type} onChange={handleEditChange} />
                <input name="description" value={formData.description} onChange={handleEditChange} />
                <input name="amount" type="number" value={formData.amount} onChange={handleEditChange} />
                <select name="direction" value={formData.direction} onChange={handleEditChange}>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
                <input name="notes" value={formData.notes} onChange={handleEditChange} />
                <button onClick={handleUpdate}>✅ Save</button>
                <button onClick={() => setEditing(null)}>❌ Cancel</button>
              </div>
            ) : (
              <div>
                {entry.date?.split('T')[0]} — {entry.type.toUpperCase()} — {entry.description} — ₹{entry.amount} ({entry.direction})
                <button onClick={() => handleEditClick(entry)}>✏️</button>
                <button onClick={() => handleDelete(entry.id)}>🗑</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LedgerDisplay;
