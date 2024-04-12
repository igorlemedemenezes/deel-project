const { depositIntoBalanceForUserId } = require('../../src/service/BalanceService');
const { Profile } = require('../../src/model');
const { getTotalUnpaidJobsPerClient } = require('../../src/repository/JobRepository');

jest.mock('../../src/repository/JobRepository');
jest.mock('../../src/model');

describe('BalanceService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('depositIntoBalanceForUserId', () => {
        it('should deposit money into the client balance if the deposit amount does not exceed 25% of total unpaid jobs', async () => {
            const userId = 1;
            const amount = 100;
            const totalUnpaidJobs = 400;
            const client = { id: userId, balance: 500, type: 'client' };
            Profile.findByPk.mockResolvedValue(client);
            getTotalUnpaidJobsPerClient.mockResolvedValue(totalUnpaidJobs);

            const result = await depositIntoBalanceForUserId(userId, amount);

            expect(Profile.findByPk).toHaveBeenCalledWith(userId);
            expect(getTotalUnpaidJobsPerClient).toHaveBeenCalledWith(userId);
            expect(client.balance).toBe(600);
            expect(result).toBe(600);
        });

        it('should throw an error if the user is not found or not a client', async () => {
            Profile.findByPk.mockResolvedValue(null);

            await expect(depositIntoBalanceForUserId(1, 100)).rejects.toThrow('Error depositing into balance: User not found or not a client');
        });

        it('should throw an error if the deposit amount exceeds 25% of total unpaid jobs', async () => {
            const userId = 1;
            const amount = 200;
            const totalUnpaidJobs = 400;
            const client = { id: userId, balance: 500, type: 'client' };
            Profile.findByPk.mockResolvedValue(client);
            getTotalUnpaidJobsPerClient.mockResolvedValue(totalUnpaidJobs);

            await expect(depositIntoBalanceForUserId(userId, amount)).rejects.toThrow('Error depositing into balance: Deposit amount exceeds 25% of total unpaid jobs');
        });

        it('should throw an error if an error occurs while depositing into balance', async () => {
            Profile.findByPk.mockRejectedValue(new Error('Database error'));

            await expect(depositIntoBalanceForUserId(1, 100)).rejects.toThrow('Error depositing into balance: Database error');
        });
    });
});
