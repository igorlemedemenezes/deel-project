const { getBestProfession, getBestClients } = require('../../src/service/AdminService');
const { DateTime } = require("luxon");

const mockContractRepository = {
    getContractsByDateRange: jest.fn(),
    getContractsWithPaidJobsInRange: jest.fn()
};

jest.mock('../../src/repository/ContractRepository', () => mockContractRepository);

describe('AdminService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getBestClients', () => {
        it('should return the best clients within the specified date range', async () => {
            const start = DateTime.local().minus({ days: 30 }).toISODate();
            const end = DateTime.local().toISODate();
            const mockContracts = [
                {
                    Contractor: { id: 1, firstName: 'John', lastName: 'Doe' },
                    Jobs: [{ price: 100 }, { price: 200 }]
                },
                {
                    Contractor: { id: 2, firstName: 'Jane', lastName: 'Doe' },
                    Jobs: [{ price: 150 }, { price: 250 }]
                }
            ];
            mockContractRepository.getContractsByDateRange.mockResolvedValue(mockContracts);

            const result = await getBestClients(start, end);

            expect(result).toHaveLength(2);
            expect(result[0].fullName).toBe('Jane Doe');
            expect(result[0].paid).toBe(400);
            expect(result[1].fullName).toBe('John Doe');
            expect(result[1].paid).toBe(300);
        });

        it('should throw an error if an error occurs while fetching best clients', async () => {
            mockContractRepository.getContractsByDateRange.mockRejectedValue(new Error('Database error'));

            await expect(getBestClients('2022-01-01', '2022-12-31')).rejects.toThrow('Error fetching best clients: Database error');
        });
    });

    describe('getBestProfession', () => {
        it('should return the best profession within the specified date range', async () => {
            const start = '2022-01-01';
            const end = '2022-12-31';
            const mockContracts = [
                {
                    Contractor: { profession: 'Engineer' },
                    Jobs: [{ price: 100 }, { price: 200 }]
                },
                {
                    Contractor: { profession: 'Doctor' },
                    Jobs: [{ price: 150 }, { price: 250 }]
                }
            ];
            mockContractRepository.getContractsWithPaidJobsInRange.mockResolvedValue(mockContracts);

            const result = await getBestProfession(start, end);

            expect(result.profession).toBe('Doctor');
            expect(result.paid).toBe(400);
        });

        it('should throw an error if an error occurs while fetching best profession', async () => {
            mockContractRepository.getContractsWithPaidJobsInRange.mockRejectedValue(new Error('Database error'));

            await expect(getBestProfession('2022-01-01', '2022-12-31')).rejects.toThrow('Error fetching best profession: Database error');
        });
    });
});
