const {Contract, Profile, Job} = require('../model');

const { Op } = require('sequelize')
const { DateTime } = require("luxon");

const getBestProfession = async (start, end) => {
    const startDate = DateTime.fromFormat(start, "dd-MM-yyyy");
    const endDate = DateTime.fromFormat(end, "dd-MM-yyyy");

    try {
        const contractsWithDataRange =  await Contract.findAll({
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

        const result = contractsWithDataRange.map(contract => {
            const totalPrice = contract.Jobs.reduce((prev, curr) => {
                return prev + curr.price;
            }, 0);
            contract['totalPrice'] = totalPrice;
            const client=contract.Client;
            return { paid: totalPrice, id: client.id, fullName: `${client.firstName} ${client.lastName}`};
        });

        const best = result.sort((a, b) => b.paid - a.paid)
        return best.slice(0, 2);
    } catch (error) {
        throw new Error('Error fetching best profession: ' + error.message);
    }
};

module.exports = { getBestProfession };