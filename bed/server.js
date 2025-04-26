const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/items', (req, res) => {
    const query = `
      SELECT 
        items.id, 
        items.name, 
        items.purchase_date, 
        items.stock_available, 
        item_types.type_name AS item_type 
      FROM items
      LEFT JOIN item_types ON items.item_type_id = item_types.id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching items:', err);
        return res.status(500).send('Server error');
      }
      res.json(results);
    });
  });
  

app.post('/items', (req, res) => {
    const items = req.body; // Array of items
  
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Request body must be an array of items' });
    }
  
    // Check if all items have the required fields
    for (let item of items) {
      const { name, purchase_date, stock_available, item_type_id } = item;
      if (!name || !purchase_date || stock_available == null || !item_type_id) {
        return res.status(400).json({ error: 'Each item must have name, purchase_date, stock_available, and item_type_id' });
      }
    }
  
    // Prepare the query for bulk insert
    const query = `
      INSERT INTO items (name, purchase_date, stock_available, item_type_id)
      VALUES ?
    `;
  
    // Create an array of values to insert
    const values = items.map(item => [
      item.name,
      item.purchase_date,
      item.stock_available,
      item.item_type_id
    ]);
  
    // Perform the bulk insert
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Failed to add items' });
      }
      res.status(201).json({ message: 'Items added successfully', itemCount: result.affectedRows });
    });
  });

  app.get('/item-types', (req, res) => {
    const query = 'SELECT * FROM item_types';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching item types:', err);
        return res.status(500).json({ error: 'Failed to retrieve item types' });
      }
      res.status(200).json(results); // Respond with all item types
    });
  });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
