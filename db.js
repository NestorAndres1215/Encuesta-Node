const mysql = require('mysql2');
require('dotenv').config(); // Carga las variables del .env

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

conexion.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
    } else {
        console.log('Conexión a MySQL exitosa');
    }
});

module.exports = conexion;
