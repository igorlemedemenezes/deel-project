const { sequelize } = require('../model');
const { Op } = require('sequelize')

const getBestProfession = async (startDate, endDate) => {
    try {
        const result = await sequelize.query(`
            SELECT p.profession, SUM(j.price) AS totalEarned
            FROM Jobs j
            JOIN Contracts c ON j.ContractId = c.id
            JOIN Profiles p ON c.ContractorId = p.id
            WHERE j.paymentDate BETWEEN :startDate AND :endDate
            GROUP BY p.profession
            ORDER BY totalEarned DESC
            LIMIT 1
        `, {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });

        if (result.length === 0) {
            throw new Error('No data found for the specified period');
        }

        // Retorna a profissão com maior ganho
        return result[0].Contractor.profession;
    } catch (error) {
        throw new Error('Error fetching best profession: ' + error.message);
    }
};

module.exports = { getBestProfession };