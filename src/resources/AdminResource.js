const express = require('express');
const router = express.Router();
const { getBestProfession, getBestClients } = require('../service/AdminService');

router.get('/best-profession', async (req, res) => {
    const { start, end } = req.query;

    try {
        const bestProfession = await getBestProfession(start, end);
        res.json({ bestProfession });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get(`/best-clients`, async (req, res) => {
    try {
        const { start, end, limit } = req.query;
        const result = await getBestClients(start, end, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;