const { Op } = require('sequelize')
const { DateTime } = require("luxon");

const { getContractsWithPaidJobsInRange, getContractsByDateRange } = require("../repository/ContractRepository");

const getBestClients = async (start, end, limit = 2) => {
    try {
        const contracts = await getContractsByDateRange(start, end);
        const professionTotalPrices = calculateProfessionTotalPrice(contracts);
        const sortedProfessions = sortProfessionsByTotalPrice(professionTotalPrices);
        const bestClients = findBestClients(sortedProfessions, limit);
        return bestClients;
    } catch (error) {
        throw new Error('Error fetching best clients: ' + error.message);
    }
};

const calculateProfessionTotalPrice = (contracts) => {
    let professionTotalPrices = {};

    contracts.forEach(contract => {
        const profession = contract.Contractor.profession;

        contract.Jobs.reduce((prev, curr) => {
            const val = prev[profession] || 0;

            prev[profession] = curr.price + val;
            return prev;
        }, professionTotalPrices);

    });
    return professionTotalPrices;
};

const sortProfessionsByTotalPrice = (professionTotalPrices) => {
    return Object.entries(professionTotalPrices)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
};

const findBestClients = (sortedProfessions, limit) => {
    const bestClients = [];
    let count = 0;

    for (const profession in sortedProfessions) {
        const contracts = sortedProfessions[profession];

        contracts.forEach(contract => {
            const client = contract.Client;
            bestClients.push({ id: client.id, fullName: `${client.firstName} ${client.lastName}`, totalPaid: contract.total });
            count++;
        });

        if (count >= limit) break;
    }

    return bestClients;
};

const getBestProfession = async (start, end) => {
    const startDate = DateTime.fromFormat(start, "dd-MM-yyyy");
    const endDate = DateTime.fromFormat(end, "dd-MM-yyyy");

    try {
        const contracts =  await getContractsWithPaidJobsInRange(startDate, endDate)
        const professionTotalPrices = await calculateProfessionTotalPrice(contracts);
        return findMostPaidProfession(professionTotalPrices);
    } catch (error) {
        throw new Error('Error fetching best profession: ' + error.message);
    }
};

const findMostPaidProfession = (professionTotalPrice) => {
    let mostPaidProfession = { name: '', total: 0 };

    for (const profession in professionTotalPrice) {
        const totalPrice = professionTotalPrice[profession];

        if (totalPrice > mostPaidProfession.total) {
            mostPaidProfession = { name: profession, total: totalPrice };
        }
    }

    return mostPaidProfession;
}

module.exports = { getBestProfession , getBestClients};