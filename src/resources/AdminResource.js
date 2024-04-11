const express = require('express');
const router = express.Router();
const { getBestProfession } = require('../service/AdminService');

router.get('/best-profession', async (req, res) => {
    const { start, end } = req.query;

    try {
        const bestProfession = await getBestProfession(start, end);
        res.json({ bestProfession });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;