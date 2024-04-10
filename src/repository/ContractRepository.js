const { Contract } = require('../model');

const TERMINATED_STATUS = 'terminated'

const getContractById = async (id) => {
    try {
        return await Contract.findOne({
            where: { id },
            include: [{ association: 'Client' }, { association: 'Contractor' }]
        });
    } catch (error) {
        throw new Error('Error retrieving contract: ' + error.message);
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
        throw new Error('Error retrieving contracts: ' + error.message);
    }
}

module.exports = { getContractById, getNonTerminatedContractsForProfile };
