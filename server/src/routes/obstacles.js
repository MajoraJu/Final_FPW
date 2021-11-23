const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');
 // GET all
router.get('/obstacles/:levelId', (req, res) => {
    const { levelId } = req.params;
    const { location } = req.query;
    mysqlConnection.query('SELECT * FROM obstacles WHERE level_id=? AND location=?', [levelId, location],(err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/obstacles', (req, res) => {
    const { levelId, seconds, quantity, y, location } = req.body;

    let sql = 'INSERT INTO obstacles(level_id, seconds, quantity, y_value, location) VALUES (?,?,?,?,?)';
    var valores = [levelId, seconds, quantity, y, location];

    mysqlConnection.query(sql, valores, (err, rows, fields) => {
        if (!err) {
            res.json({ ok: true });
        } else {
            console.log(err);
        }
    });
});

// Update un alumno
router.put('/obstacles/:id', (request, response) => {
    const id = request.params.id;
    const { seconds, quantity } = request.body;
    
    let sqlQuery = 'UPDATE obstacles SET seconds= ?, quantity =? WHERE id=' + id;

    mysqlConnection.query(sqlQuery, [seconds, quantity], (err, rows, fields) => {
        if (!err) {
            response.json({ ok: true });
        } else {
            console.log(err);
        }
    });

});

module.exports = router;
