const { getContractById } = require('../../src/repository/ContractRepository');
const { getContractByForProfileId } = require('../../src/service/ContractService');

jest.mock('../../src/repository/ContractRepository');

describe('ContractService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getContractByForProfileId', () => {
        it('should return the contract if it exists and the profileId matches the client id', async () => {
            const contractId = 1;
            const profileId = 100;
            const contract = { id: contractId, Client: { id: profileId } };
            getContractById.mockResolvedValue(contract);

            const result = await getContractByForProfileId(contractId, profileId);

            expect(getContractById).toHaveBeenCalledWith(contractId);
            expect(result).toEqual(contract);
        });

        it('should throw a 404 error if the contract does not exist', async () => {
            const contractId = 1;
            const profileId = 100;
            getContractById.mockResolvedValue(null);

            await expect(getContractByForProfileId(contractId, profileId)).rejects.toStrictEqual({ status: 404, message: 'Contract Not found' });
        });

        it('should throw a 404 error if the profileId does not match the client id in the contract', async () => {
            const contractId = 1;
            const profileId = 100;
            const contract = { id: contractId, Client: { id: 200 } };
            getContractById.mockResolvedValue(contract);

            await expect(getContractByForProfileId(contractId, profileId)).rejects.toStrictEqual({ status: 404, message: 'Unauthorized' });
        });
    });
});