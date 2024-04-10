const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { getProfile } = require('../middleware/getProfile');
const { Contract, Job } = require('../model');

// Method: GET, Path: /jobs/unpaid
router.get('/unpaid', getProfile, async (req, res) => {
    const { profile } = req;

    try {
        const contracts = await Contract.findAll({
            where: {
                [Op.or]: [{ ClientId: profile.id }, { ContractorId: profile.id }],
                status: 'in_progress'
            }
        });

        const unpaidJobs = await Job.findAll({
            where: {
                ContractId: contracts.map(contract => contract.id),
                paid: false
            }
        });

        res.json(unpaidJobs);
    } catch (error) {
        console.error('Error retrieving unpaid jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;