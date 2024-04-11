const express = require('express');
const router = express.Router();

const { getProfile } = require('../middleware/getProfile');

const { depositIntoBalanceForUserId } = require('../service/BalanceService');

const { Profile } = require('../model');

// /balances/deposit/:userId
router.post('/deposit/:userId', getProfile, async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        return res.status(400).json('Amount is not a valid number or it is not present').end();
    }

    if(!userId){
        return res.status(400).json({ error: 'The userId is required' });
    }

    try {
        const result = await depositIntoBalanceForUserId(userId, amount);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error depositing into balance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;