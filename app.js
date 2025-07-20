require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

const PORT = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

app.use(express.json());


app.get('/products', (req, res) => {
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(results[0]);
  });
});

app.get('/products/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  pool.query('SELECT * FROM products WHERE name LIKE ?', [keyword], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
