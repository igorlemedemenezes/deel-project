const express = require('express');
const router = express.Router();

const { getProfile } = require('../middleware/getProfile');

const { depositIntoBalanceForUserId } = require('../service/BalanceService');

const { Profile } = require('../model');

// /balances/deposit/:userId
router.post('/deposit/:userId', getProfile, async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    try {
        const result = await depositIntoBalanceForUserId(userId, amount);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error depositing into balance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;