const express = require('express');
const router = express.Router();

const { getProfile } = require('../middleware/getProfile');
const { getNonTerminatedContractsForProfile } = require('../repository/ContractRepository')
const { getContractByForProfileId } = require('../service/ContractService')

// Method: GET, Path: /contracts/:id
router.get('/:id', getProfile, async (req, res) => {
    const { id } = req.params;
    const { profile } = req;

    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    if (!id) {
        return res.status(400).json({ error: 'Contract id is required' });
    }

    try {
        const contract = await getContractByForProfileId(id, profile.id)
        res.json(contract);
    } catch (error) {
        console.error('Error retrieving contract:', error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
});

// Method: GET, Path: /contracts
router.get('/', getProfile, async (req, res) => {
    const { profile } = req;

    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    try {
        const contracts = await getNonTerminatedContractsForProfile(profile.id);
        res.json(contracts);
    } catch (error) {
        console.error('Error retrieving contracts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;