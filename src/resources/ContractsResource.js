const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile');
const { Contract } = require('../model');

// Método: GET, Caminho: /contracts/:id
router.get('/:id', getProfile, async (req, res) => {
    const { id } = req.params;
    const { profile } = req;

    try {
        const contract = await Contract.findOne({
            where: { id },
            include: [{ association: 'Client' }, { association: 'Contractor' }]
        });

        if (!contract) {
            return res.status(404).end();
        }

        if (contract.Client.id !== profile.id && contract.Contractor.id !== profile.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(contract);
    } catch (error) {
        console.error('Error retrieving contract:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;