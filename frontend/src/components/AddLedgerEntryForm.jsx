import { useState } from 'react';
import axios from 'axios';

function AddLedgerEntryForm({ onSuccess }) {
  const [entry, setEntry] = useState({
    type: 'bill',
    description: '',
    amount: '',
    direction: 'debit',
    notes: ''
  });

  const handleChange = e => setEntry({ ...entry, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/entry', entry);
    setEntry({ type: 'bill', description: '', amount: '', direction: 'debit', notes: '' });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="type" value={entry.type} onChange={handleChange}>
        <option value="salary">Salary</option>
        <option value="bill">Bill</option>
        <option value="rent">Rent</option>
        <option value="other">Other</option>
      </select>
      <select name="direction" value={entry.direction} onChange={handleChange}>
        <option value="debit">Debit</option>
        <option value="credit">Credit</option>
      </select>
      <input name="description" placeholder="Description" value={entry.description} onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Amount" value={entry.amount} onChange={handleChange} required />
      <input name="notes" placeholder="Notes" value={entry.notes} onChange={handleChange} />
      <button type="submit">Add Ledger Entry</button>
    </form>
  );
}

export default AddLedgerEntryForm;
