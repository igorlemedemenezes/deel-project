const { sequelize, Profile } = require('../../src/model');
const { getJobById, updateJobPayment } = require('../../src/repository/JobRepository');
const { payForJob } = require('../../src/service/JobService');

jest.mock('../repository/JobRepository');

describe('JobService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('payForJob', () => {
        it('should successfully pay for the job if all conditions are met', async () => {
            const jobId = 1;
            const profileId = 100;
            const job = { id: jobId, price: 50, Contract: { ClientId: profileId, ContractorId: 200 } };
            const client = { id: profileId, balance: 100 };
            const contractor = { id: 200, balance: 0 };
            getJobById.mockResolvedValue(job);
            Profile.findByPk.mockResolvedValueOnce(client).mockResolvedValueOnce(contractor);
            sequelize.transaction.mockImplementation(async (callback) => await callback());

            const result = await payForJob(jobId, profileId);

            expect(getJobById).toHaveBeenCalledWith(jobId);
            expect(Profile.findByPk).toHaveBeenCalledTimes(2);
            expect(Profile.findByPk).toHaveBeenCalledWith(profileId);
            expect(Profile.findByPk).toHaveBeenCalledWith(job.Contract.ContractorId);
            expect(sequelize.transaction).toHaveBeenCalledTimes(2);
            expect(updateJobPayment).toHaveBeenCalledWith(job, expect.any(Date), { transaction: expect.anything() });
            expect(result).toEqual({ status: 200, message: 'Payment successful' });
        });

        it('should throw a 404 error if the job does not exist', async () => {
            const jobId = 1;
            getJobById.mockResolvedValue(null);

            await expect(payForJob(jobId, 100)).rejects.toStrictEqual({ status: 404, message: 'Job not found' });
        });

        it('should throw a 403 error if the user is not authorized to pay for the job', async () => {
            const jobId = 1;
            const job = { id: jobId, price: 50, Contract: { ClientId: 200, ContractorId: 300 } };
            getJobById.mockResolvedValue(job);

            await expect(payForJob(jobId, 100)).rejects.toStrictEqual({ status: 403, message: 'Unauthorized to pay for this job' });
        });

    });
});
