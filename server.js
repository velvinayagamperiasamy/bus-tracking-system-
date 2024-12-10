const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Replace with your MySQL password
    database: 'smart_bus_tracking'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// API to fetch bus location
app.get('/api/bus/:id', (req, res) => {
    const busId = req.params.id;
    const query = `
        SELECT latitude, longitude, last_updated 
        FROM bus_locations 
        WHERE bus_id = ?
        ORDER BY last_updated DESC 
        LIMIT 1;
    `;
    db.query(query, [busId], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results[0]);
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
