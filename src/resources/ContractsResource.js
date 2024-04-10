const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { getProfile } = require('../middleware/getProfile');
const { Contract } = require('../model');

// Method: GET, Path: /contracts/:id
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

// Method: GET, Path: /contracts
router.get('/', getProfile, async (req, res) => {
    const { profile } = req;

    try {
        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [{ ClientId: profile.id }, { ContractorId: profile.id }],
                status: { [Op.ne]: 'terminated' }
            }
        });

        res.json(contracts);
    } catch (error) {
        console.error('Error retrieving contracts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;