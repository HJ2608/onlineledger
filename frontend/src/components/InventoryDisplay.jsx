import { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryDisplay() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('/api/inventory').then(res => setInventory(res.data));
  }, []);

  return (
    <div>
      <h3>📦 Current Inventory</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.product}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryDisplay;
