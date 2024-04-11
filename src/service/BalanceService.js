const { Profile, Job, Contract } = require('../model');
const { Op } = require('sequelize')

const depositIntoBalanceForUserId = async (userId, amount) => {
    try {
        const client = await Profile.findByPk(userId);
        if (!client || client.type !== 'client') {
            throw new Error('User not found or not a client');
        }

        const totalUnpaidJobs  = await Job.sum('price', {
            where: {
                [Op.or]: [{paid: null}, {paid: false}]
            },
            include: [{
                model: Contract,
                where: { ClientId: userId }
            }]
        });

        const maximumDeposit = (totalUnpaidJobs || 0) * 0.25;
        if (amount > maximumDeposit) {
            throw new Error('Deposit amount exceeds 25% of total unpaid jobs');
        }

        await sequelize.transaction(async (transaction) => {
            await client.update({ balance: client.balance + amount }, { transaction });
        });

        return client.balance + amount; // Retorna o novo saldo após o depósito
    } catch (error) {
        throw new Error('Error depositing into balance: ' + error.message);
    }
}
module.exports = { depositIntoBalanceForUserId };