const { Contract, Profile, Job } = require('../model');
const { Op } = require('sequelize');

const TERMINATED_STATUS = 'terminated'
const IN_PROGRESS_STATUS = 'in_progress';

const getContractById = async (id) => {
    try {
        return await Contract.findOne({
            where: { id },
            include: [{ association: 'Client' }, { association: 'Contractor' }]
        });
    } catch (error) {
        throw Error('Error retrieving contract: ' + error.message);
    }
}

const getNonTerminatedContractsForProfile = async (profileId) => {
    try {
        return await Contract.findAll({
            where: {
                [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
                status: { [Op.ne]: TERMINATED_STATUS }
            }
        });
    } catch (error) {
        throw Error('Error retrieving non terminated contracts for profile: ' + error.message);
    }
}

const getInProgressContractsForProfile = async (profileId) => {
    try {
        return await Contract.findAll({
            where: {
                [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
                status: IN_PROGRESS_STATUS
            }
        })
    } catch (error) {
        throw Error('Error retrieving in progress contracts for profile: ' + error.message);
    }
}

const getContractsWithPaidJobsInRange = async (start, end) => {
    try {
        return await Contract.findAll({
            include: [
                {
                    model: Profile,
                    as: 'Contractor',
                },
                {
                    model: Job,
                    where: {
                        paid: true,
                        paymentDate: {
                            [Op.between]: [start, end]
                        }
                    },
                }
            ]
        });
    } catch (error) {
        throw new Error('Error fetching contracts with paid jobs: ' + error.message);
    }
};

const getContractsByDateRange = async (start, end) => {
    try {
        return await Contract.findAll({
            include: [
                {
                    model: Profile,
                    as: 'Contractor',
                },
                {
                    model: Profile,
                    as: 'Client',
                },
                {
                    model: Job,
                    where: {
                        paid: true,
                        paymentDate: {
                            [Op.between]: [start, end]
                        }
                    },
                }
            ]
        });
    } catch (error) {
        throw new Error('Error getting contracts by date range: ' + error.message);
    }
};

module.exports = { getContractById, getNonTerminatedContractsForProfile, getInProgressContractsForProfile, getContractsWithPaidJobsInRange, getContractsByDateRange };
