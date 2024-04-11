const { sequelize, Profile } = require('../model');
const { getTotalUnpaidJobsPerClient } = require('../repository/JobRepository')

const depositIntoBalanceForUserId = async (userId, amount) => {
    try {
        const client = await Profile.findByPk(userId);
        if (!client || client.type !== 'client') {
            throw new Error('User not found or not a client');
        }

        const totalUnpaidJobs = await getTotalUnpaidJobsPerClient(userId);

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