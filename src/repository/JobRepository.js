const { Job, Contract } = require('../model')
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

const getTotalUnpaidJobsPerClient = async (userId) => {
    return await Job.sum('price', {
        where: {
            [Op.and]: [
                { paid: { [Op.not]: true } },
                { '$Contract.ClientId$': userId }
            ]
        },
        include: [{
            model: Contract,
            attributes: [],
            where: { ClientId: userId }
        }]
    }) || 0;
}

module.exports = { getJobById, getUnpaidJobsByContractIds, updateJobPayment, getTotalUnpaidJobsPerClient };