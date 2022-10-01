const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Servidor express
const app = express();

// CORS
app.use(cors());

// Base de datos
dbConnection();

// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'hola'
    })
});

app.listen( process.env.PORT, () => {
    console.log('corriendo');
});