const { Op } = require('sequelize')
const { DateTime } = require("luxon");

const { getContractsWithPaidJobsInRange } = require("../repository/ContractRepository");

const getBestProfession = async (start, end) => {
    const startDate = DateTime.fromFormat(start, "dd-MM-yyyy");
    const endDate = DateTime.fromFormat(end, "dd-MM-yyyy");

    try {
        const result =
            getContractsWithPaidJobsInRange(startDate, endDate)
                .then(contractsWithDataRange => {
                    return contractsWithDataRange.map(contract => {
                        const totalPrice = contract.Jobs.reduce((prev, curr) => {
                            return prev + curr.price;
                        }, 0);
                        const client = contract.Client;
                        return { paid: totalPrice, id: client.id, fullName: `${client.firstName} ${client.lastName}` };
                    });
                })
                .then(result => {
                    const best = result.sort((a, b) => b.paid - a.paid);
                    return best.slice(0, 2);
                });
        return result;
    } catch (error) {
        throw new Error('Error fetching best profession: ' + error.message);
    }
};

module.exports = { getBestProfession };