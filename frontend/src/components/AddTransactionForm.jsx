import { useState, useEffect } from 'react';
import axios from 'axios';

function AddTransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    type: 'purchase',
    product: '',
    quantity: 1,
    buy_price: '',
    sell_price: '',
    notes: ''
  });

  const [productOptions, setProductOptions] = useState([]);

  // 🔄 Fetch distinct product names from DB on load
  useEffect(() => {
    axios.get('/api/transactions')
      .then(res => {
        const products = res.data
          .filter(tx => tx.type === 'purchase')
          .map(tx => tx.product);
        setProductOptions([...new Set(products)]);
        console.log('Fetched product options:', [...new Set(products)]);
      })
      .catch(err => {
        console.error('Failed to load products for dropdown:', err);
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 💡 Clean form before submission
    const payload = { ...form };
    if (form.type === 'purchase') {
      delete payload.sell_price;
    } else {
      delete payload.buy_price;
    }

    console.log('Submitting transaction payload:', payload);

    try {
      await axios.post('/api/transaction', payload);
      console.log('✅ Transaction added successfully');
      setForm({
        type: 'purchase',
        product: '',
        quantity: 1,
        buy_price: '',
        sell_price: '',
        notes: ''
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="purchase">Purchase</option>
        <option value="sale">Sale</option>
      </select>

      {form.type === 'purchase' ? (
        <input
          name="product"
          placeholder="Product"
          value={form.product}
          onChange={handleChange}
          required
        />
      ) : (
        <select
          name="product"
          value={form.product}
          onChange={handleChange}
          required
        >
          <option value="">Select Product</option>
          {productOptions.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>
      )}

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
        required
      />

      {form.type === 'purchase' && (
        <input
          name="buy_price"
          type="number"
          placeholder="Buy Price"
          value={form.buy_price}
          onChange={handleChange}
          required
        />
      )}

      {form.type === 'sale' && (
        <input
          name="sell_price"
          type="number"
          placeholder="Sell Price"
          value={form.sell_price}
          onChange={handleChange}
          required
        />
      )}

      <input
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default AddTransactionForm;
