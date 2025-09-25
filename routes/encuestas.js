const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear encuesta
router.get('/crear', (req, res) => {
    res.render('crearEncuesta');
});

router.post('/guardarEncuesta', (req, res) => {
    const { titulo, preguntas } = req.body;
    const usuario_id = req.usuario.id;

    db.query('INSERT INTO encuestas (usuario_id, titulo) VALUES (?, ?)', [usuario_id, titulo], (err, result) => {
        if (err) throw err;

        const encuestaId = result.insertId;
        const preguntasArray = JSON.parse(preguntas);

        preguntasArray.forEach(preg => {
            db.query('INSERT INTO preguntas (encuesta_id, texto) VALUES (?, ?)', [encuestaId, preg.texto], (err, result2) => {
                if (err) throw err;

                const preguntaId = result2.insertId;

                preg.opciones.forEach(op => {
                    const texto = op.texto;
                    const es_correcta = op.es_correcta ? 1 : 0;

                    db.query('INSERT INTO opciones (pregunta_id, texto, es_correcta) VALUES (?, ?, ?)', [preguntaId, texto, es_correcta]);
                });
            });
        });

        res.render('respuesta');
    });
});

// Responder encuesta
router.get('/responder/:id', (req, res) => {
    const encuestaId = req.params.id;

    db.query('SELECT * FROM encuestas WHERE id = ?', [encuestaId], (err, encRes) => {
        if (err) throw err;
        if (encRes.length === 0) return res.status(404).send("Encuesta no encontrada");

        const encuesta = encRes[0];

        db.query('SELECT * FROM preguntas WHERE encuesta_id = ?', [encuestaId], (err, preguntas) => {
            if (err) throw err;

            const promesas = preguntas.map(pregunta => new Promise((resolve, reject) => {
                db.query('SELECT * FROM opciones WHERE pregunta_id = ?', [pregunta.id], (err, opciones) => {
                    if (err) reject(err);
                    pregunta.opciones = opciones;
                    resolve();
                });
            }));

            Promise.all(promesas).then(() => {
                res.render('responderEncuesta', { encuesta, preguntas });
            }).catch(err => res.status(500).send("Error al cargar las opciones"));
        });
    });
});

// Guardar votos
router.post('/votar/:id', (req, res) => {
    const votos = req.body;

    Object.values(votos).forEach(opcionId => {
        db.query('UPDATE opciones SET votos = votos + 1 WHERE id = ?', [opcionId]);
    });

    res.redirect(`/resultados/${req.params.id}`);
});

// Resultados
router.get('/resultados/:id', (req, res) => {
    const encuestaId = req.params.id;

    db.query('SELECT * FROM encuestas WHERE id = ?', [encuestaId], (err, encRes) => {
        if (err) throw err;
        const encuesta = encRes[0];

        db.query('SELECT * FROM preguntas WHERE encuesta_id = ?', [encuestaId], (err, preguntas) => {
            if (err) throw err;

            const promesas = preguntas.map(pregunta => new Promise((resolve, reject) => {
                db.query('SELECT * FROM opciones WHERE pregunta_id = ?', [pregunta.id], (err, opciones) => {
                    if (err) reject(err);
                    pregunta.opciones = opciones;
                    resolve();
                });
            }));

            Promise.all(promesas).then(() => {
                res.render('resultados', { encuesta, preguntas });
            });
        });
    });
});

// Listar encuestas
router.get('/encuestas', (req, res) => {
    db.query('SELECT * FROM encuestas', (err, encuestas) => {
        if (err) throw err;
        res.render('encuestas', { encuestas });
    });
});

module.exports = router;
