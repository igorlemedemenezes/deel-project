const { Op } = require('sequelize')
const { DateTime } = require("luxon");

const { getContractsWithPaidJobsInRange, getContractsByDateRange } = require("../repository/ContractRepository");

const getBestClients = async (start, end, limit = 2) => {
    try {
        const contracts = await getContractsByDateRange(start, end);
        const professionTotalPrices = calculateProfessionTotalPrice(contracts);
        return professionTotalPrices.sort((a,b) => b.paid - a.paid).slice(2)
    } catch (error) {
        throw new Error('Error fetching best clients: ' + error.message);
    }
};

const calculateProfessionTotalPrice = (contracts) => {
    let professionTotalPrices = [];

    contracts.forEach(contract => {
        const profession = contract.Contractor.profession;

        const totalPaid = contract.Jobs.reduce((prev, curr) => {
            return prev + curr.price;
        }, 0);

        const client = contract.Contractor;
        professionTotalPrices.push({
            id: client.id,
            fullName: `${client.firstName} ${client.lastName}`,
            paid: totalPaid
        });
    });

    return professionTotalPrices;
};

const getBestProfession = async (start, end) => {
    const startDate = DateTime.fromFormat(start, "yyyy-MM-dd");
    const endDate = DateTime.fromFormat(end, "yyyy-MM-dd");

    try {
        const contracts = await getContractsWithPaidJobsInRange(start, end)
        const professionTotalPrices = await calculateProfessionTotalPrice(contracts);
        return professionTotalPrices.sort((a,b) => b.paid - a.paid).shift()
    } catch (error) {
        throw new Error('Error fetching best profession: ' + error.message);
    }
};

module.exports = { getBestProfession, getBestClients };