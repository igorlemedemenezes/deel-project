const { sequelize, Profile, Job } = require('../model');
const { getJobById, updateJobPayment } = require('../repository/JobRepository');

const payForJob = async (jobId, profileId) => {
    try {
        const job = await getJobById(jobId);
        if (!job) {
            throw { status: 404, message: 'Job not found' };
        }

        const contract = job.Contract;
        if (profileId !== contract.ClientId) {
            throw { status: 403, message: 'Unauthorized to pay for this job' };
        }
        const client = await Profile.findByPk(contract.ClientId);
        const contractor = await Profile.findByPk(contract.ContractorId);

        if (!client || !contractor) {
            throw { status: 404, message: 'Client or contractor not found' };
        }

        if (client.balance < job.price) {
            throw { status: 400, message: 'Insufficient balance' };
        }

        await sequelize.transaction(async (transaction) => {
            await client.update({ balance: client.balance - job.price }, { transaction });
            await contractor.update({ balance: contractor.balance + job.price }, { transaction });
        });
        await sequelize.transaction(async (transaction) => {
            await updateJobPayment(job, new Date(), { transaction });
        })
        return { status: 200, message: 'Payment successful' };
    } catch (error) {
        throw new Error('Error paying for job: ' + error.message);
    }
};

module.exports = { payForJob };