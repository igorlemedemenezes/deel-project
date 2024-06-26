const express = require('express');
const router = express.Router();

const { getProfile } = require('../middleware/getProfile');

const { getUnpaidJobsByContractIds } = require('../repository/JobRepository')
const { getInProgressContractsForProfile } = require('../repository/ContractRepository')

const { payForJob } = require('../service/JobService')


router.get('/unpaid', getProfile, async (req, res) => {
    const { profile } = req;

    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    try {
        const contracts = await getInProgressContractsForProfile(profile.id);
        const unpaidJobs = await getUnpaidJobsByContractIds(contracts)
        res.json(unpaidJobs);
    } catch (error) {
        console.error('Error retrieving unpaid jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:job_id/pay', getProfile, async (req, res) => {
    const { job_id } = req.params;
    const { profile } = req;

    if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    if (!job_id) {
        return res.status(400).json({ error: 'Job id is required' });
    }

    try {
        const result = await payForJob(job_id, profile.id);
        res.status(result.status).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
});

module.exports = router;