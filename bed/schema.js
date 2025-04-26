// bed/schema.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Praveen@123'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');

  connection.query('CREATE DATABASE IF NOT EXISTS inventory_db', err => {
    if (err) throw err;
    console.log('Database created or already exists.');

    connection.changeUser({ database: 'inventory_db' }, err => {
      if (err) throw err;

      const itemTypesTable = `
        CREATE TABLE IF NOT EXISTS item_types (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_name VARCHAR(100) NOT NULL
        );
      `;

      const itemsTable = `
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          purchase_date DATE NOT NULL,
          stock_available INT NOT NULL,
          item_type_id INT,
          FOREIGN KEY (item_type_id) REFERENCES item_types(id)
        );
      `;

      connection.query(itemTypesTable, err => {
        if (err) throw err;
        console.log('item_types table ready.');

        const insertMasterData = `
          INSERT INTO item_types (type_name)
          SELECT * FROM (SELECT 'Electronics' UNION SELECT 'Furniture' UNION SELECT 'Clothing') AS tmp
          WHERE NOT EXISTS (
            SELECT type_name FROM item_types WHERE type_name IN ('Electronics', 'Furniture', 'Clothing')
          );
        `;

        connection.query(insertMasterData, err => {
          if (err) throw err;
          console.log('Master item types inserted.');

          connection.query(itemsTable, err => {
            if (err) throw err;
            console.log('items table ready.');
            connection.end();
          });
        });
      });
    });
  });
});
