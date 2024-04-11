
const { getContractById } = require('../repository/ContractRepository')

const getContractByForProfileId = async (id, profileId) => {
    const contract = await getContractById(id)
    if (!contract) {
        throw { status: 404, message: 'Contract Not found' }
    }
    if (contract.Client.id !== profileId) {
        throw { status: 404, message: 'Unauthorized' }
    }
    return contract
}

module.exports = { getContractByForProfileId }