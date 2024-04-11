const { Contract } = require('../model');
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
    try{
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

module.exports = { getContractById, getNonTerminatedContractsForProfile, getInProgressContractsForProfile };
