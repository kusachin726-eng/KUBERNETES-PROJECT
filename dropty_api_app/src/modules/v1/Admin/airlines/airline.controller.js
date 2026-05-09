const AirlineService = require("./airline.service");
const AppError = require("../../../../utils/errorHandler/appError");
const db = require("../../../../data-access/sequelize/models");

class AirlineController {
    async create(req, res) {
        const data = await AirlineService.createAirline(req.body);
        res.status(201).json({ success: true, data });
    }

    async list(req, res) {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "DESC",
            ...filters
        } = req.query;

        const offset = (page - 1) * limit;

        const result = await AirlineService.getAllAirlines(
            filters,
            limit,
            offset,
            { sortBy, sortOrder }
        );

        res.json({
            success: true,
            data: result
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        if (!id || isNaN(id)) throw new AppError("Valid Airline ID required", 400);

        const data = await AirlineService.getAirlineById(Number(id));
        res.json({ success: true, data });
    }

    async update(req, res) {
        if (!req.params.id || isNaN(req.params.id)) {
            throw new AppError("Valid Airline ID required", 400);
        }
        const data = await AirlineService.updateAirline(req.params.id, req.body);
        res.json({ success: true, data });
    }

    async delete(req, res) {
        const { id } = req.params;

        const deleted = await db.Airlines.destroy({
            where: { id }
        });
        if (!deleted) {
            throw new AppError("Airline not found", 404);
        }

        res.json({
            success: true,
            message: "Airline deleted successfully"
        });
    }

    async addExtraBagFare(req, res) {
        if (!req.params.airlineId || isNaN(req.params.airlineId)) {
            throw new AppError("Valid Airline ID required", 400);
        }

        const data = await AirlineService.createExtraBagFare(
            Number(req.params.airlineId),
            req.body
        );

        res.status(201).json({ success: true, data });
    }

    async updateExtraBagFarePrice(req, res) {
        const { id } = req.params;
        const { additionalKgFare } = req.body;

        if (!additionalKgFare) {
            throw new AppError("Price is required", 400);
        }

        const data = await AirlineService.updateExtraBagFarePrice(
            Number(id),
            additionalKgFare
        );

        res.json({
            success: true, data

        });
    }
    async deleteExtraBagFare(req, res) {
        const fare = await db.AirlineExtraBagFare.findByPk(req.params.id);
        if (!fare) throw new AppError("Extra bag fare not found", 404);
        await fare.destroy();

        res.json({
            success: true,
            message: "Extra bag fare deleted"
        });
    }
}

module.exports = new AirlineController();
