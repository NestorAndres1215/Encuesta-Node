const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Archivos estáticos
app.use(express.static('public')); // <-- esto habilita CSS, JS, imágenes

// Simular usuario logueado
app.use((req, res, next) => {
    req.usuario = { id: 1, nombre: 'Nestor' };
    next();
});

// Rutas
const encuestasRoutes = require('./routes/encuestas');
app.use('/', encuestasRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
