const express = require('express');
const mysql = require('mysql');

const app = express();

// MySQL configurations
const db_config = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password07',
  database: 'project_dbms',
};

// Create a MySQL pool
const pool = mysql.createPool(db_config);

// Endpoint to fetch data
app.get('/api/inventory', (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        res.status(500).json({ error: 'Error connecting to database' });
        return;
      }
  
      connection.query('SELECT * FROM inventory', (error, results) => {
        connection.release(); // Release the connection
  
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Error executing query' });
          return;
        }
  
        console.log('Retrieved data:', results); // Log retrieved data
  
        const formattedResults = results.map((row) => ({
          ItemID: row.ItemID,
          ItemName: row.ItemName,
          Description: row.Description,
          QuantityInStock: row.QuantityInStock,
          UnitPrice: row.UnitPrice,
          SupplierID: row.SupplierID,
          HospitalID: row.HospitalID,
          OrderID: row.OrderID,
        }));
  
        res.json(formattedResults); // Send retrieved data as JSON
      });
    });
  });

// Start the server
const port = 4000; // Change the port if needed
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });