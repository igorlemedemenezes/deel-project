const { Job } = require('../model')
const { Op } = require('sequelize')

const getJobById = async (jobId) => {
    try {
        return await Job.findByPk(jobId, { include: [{ association: 'Contract' }] });
    }
    catch (error) {
        throw new Error($`Error job by Id: ${jobId}` + error.message);
    }
};

const updateJobPayment = async (job, paymentDate) => {
    await job.update({ paid: true, paymentDate });
};

const getUnpaidJobsByContractIds = async (contracts) => {
    try {
        return await Job.findAll({
            where: {
                ContractId: contracts.map(contract => contract.id),
                [Op.or]: [{paid: null}, {paid: false}]
            }
        });
    } catch (error) {
        throw Error('Error retrieving unpaid jobs: ' + error.message);
    }
};

module.exports = { getJobById, getUnpaidJobsByContractIds, updateJobPayment };