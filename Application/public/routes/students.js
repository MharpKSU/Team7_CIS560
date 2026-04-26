const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.post('/', async (req, res) => {
    const { firstName, lastName, email, majorId, password } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('fname', firstName)
        res.status(201).send('Student created');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;