import React, { useEffect, useState } from 'react';
import './App.css';
import ItemsTable from './ItemTable';


function App() {
  const [itemTypes, setItemTypes] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [form, setForm] = useState({
    name: '',
    item_type_id: '',
    purchase_date: '',
    stock_available: false
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/item-types')
      .then(res => res.json())
      .then(data => setItemTypes(data));
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addItem = e => {
    e.preventDefault();
    const { name, item_type_id, purchase_date } = form;
    if (!name || !item_type_id || !purchase_date) {
      alert('Please fill all required fields');
      return;
    }
    setItems(prev => [...prev, form]);
    setForm({ name: '', item_type_id: '', purchase_date: '', stock_available: false });
  };

  const deleteItem = index => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const editItem = index => {
    setForm(items[index]);
    deleteItem(index);
  };

  const submitItems = () => {
    if (items.length === 0) {
      alert('Add at least one item');
      return;
    }
    fetch('/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    })
      .then(res => {
        if (res.ok) {
          alert('Items submitted successfully');
          setItems([]);
          setRefreshTrigger(prev => prev + 1);
        } else {
          alert('Failed to submit');
        }
      });
  };

  return (
    <div style={{display: 'flex'}}>
      <div className='container' style={{margin: 0}}>
        <h2>Add Items to Purchase</h2>
        <form onSubmit={addItem}>
          <label>Item Name*</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Item Type*</label>
          <select name="item_type_id" value={form.item_type_id} onChange={handleChange} required>
            <option value="">Select Type</option>
            {itemTypes.map(type => (
              <option key={type.id} value={type.id}>{type.type_name}</option>
            ))}
          </select>

          <label>Purchase Date*</label>
          <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} required />

          <label>
            <input
              type="checkbox"
              name="stock_available"
              checked={form.stock_available}
              onChange={handleChange}
            />
            Stock Available
          </label>

          <button type="submit">Add Item</button>
        </form>

        <h3>Items in This Purchase</h3>
        {items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Purchase Date</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{itemTypes.find(t => t.id == item.item_type_id)?.type_name}</td>
                  <td>{item.purchase_date}</td>
                  <td>{item.stock_available ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => editItem(idx)}>Edit</button>
                    <button onClick={() => deleteItem(idx)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No items added yet.</p>}

        <button onClick={submitItems}>Submit Purchase</button>
      </div>

      <vr />
      <div>
        <ItemsTable refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
