const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// Import Routes
const pelangganRoutes = require('./routes/pelangganRoutes');
const pesananRoutes = require('./routes/pesananRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Endpoint Routes
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/pesanan', pesananRoutes);

// Endpoint Tes
app.get('/', (req, res) => {
    res.json({ message: 'API Usaha Jahit HighFiveTech Berjalan Normal!' });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});