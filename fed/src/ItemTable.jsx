import React, { useEffect, useState } from 'react';

function ItemsTable({ refreshTrigger }) {
  const [items, setItems] = useState([]);

  const fetchItems = () => {
    fetch('/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err));
  };

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]); // 🛑 fetch again when refreshTrigger changes

  return (
    <div className="container" style={{margin: '0 0 0 16px'}}>
      <h2>All Submitted Items</h2>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Purchase Date</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.item_type}</td>
                <td>{new Date(item.purchase_date).toLocaleDateString()}</td>
                <td>{item.stock_available ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default ItemsTable;
