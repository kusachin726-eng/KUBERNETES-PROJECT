const AppError = require("../../../../utils/errorHandler/appError");
const { cleanText } = require("../../../../utils/cleanText");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const citiesServices = require("./cities.service");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");

class citiesController {
    async list(req, res, next) {
        const {
            page = 1,
            limit = 10,
            searchKey = "",
            sortBy = "createdAt",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;
        const filters = {
            searchKey
        };

        const sortOptions = {
            sortBy,
            sortOrder,
        };

        const citiesList = await citiesServices.getAllCities(
            filters,
            limit,
            offset,
            sortOptions
        );

        const totalPages = Math.ceil(citiesList.count / limit);
        res.status(200).json({
        success: true,
            data: {
                totalCount: citiesList.count,
                page: Number(page),
                totalPages: totalPages,
                rows: citiesList.rows.map(city => ({
                ...city.toJSON(),
                createdAt: formatDateTime(city.createdAt),
                updatedAt: formatDateTime(city.updatedAt),
                })),
            }
        });
    }

    async getById(req, res, next) {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            throw new AppError("Valid city id is required", 400);
        }
        const city = await citiesServices.getCityById(id);
        if (!city) {
            throw new AppError("City not found", 404);
        }
        res.status(200).json({
            success: true,
            data: {
                ...city.toJSON(),
                createdAt: formatDateTime(city.createdAt),
                updatedAt: formatDateTime(city.updatedAt),
            }
        });
    }
       
    async addNewCity(req, res) {
        let { city, state, country, countryCode ,stateCode, pincode } = req.body;
        city = cleanText(city);
        state = cleanText(state);
        country = cleanText(country);
        countryCode = cleanText(countryCode);
        stateCode = cleanText(stateCode);
        pincode = cleanText(pincode);

        if (!city || !country) {
            throw new AppError("City and Country are required", 400);
        }
        const existingCity = await db.Cities.findOne({
            where: {
                city: city,
                country: country,
                deletedAt: null
            }
        });
        if (existingCity) {
            throw new AppError("City already exists", 400);
        }
        const newCity = await db.Cities.create({
            city: city,
            state: state,
            country: country,
            countryCode: countryCode,
            stateCode: stateCode,
            pincode: pincode,
            isActive: true
        },
    );
        return res.status(201).json({
            success: true,
            message: "City added successfully",
            data: newCity
        });
    }

    async updateDetail(req, res) {
        const { id } = req.params;
        const payload = req.body;
        if (!id) {
            throw new AppError("City id is required", 400);
        }
        const updatedCity = await citiesServices.updateCity(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "City updated successfully",
            data: updatedCity
        });
    }

    async updateStatus(req, res, next) {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            throw new AppError("Valid city id is required", 400);
        }
        const city = await citiesServices.getCityById(id);
        if (!city) {
            throw new AppError("City not found", 404);
        }
        // Toggle logic
        const newStatus = !city.isActive;
        await citiesServices.updateCityStatus(id, newStatus);
        res.status(200).json({
            success: true,
            message: "City status updated successfully",
            data: {
                id: city.id,
                isActive: newStatus
            }
        });
    }
    
    async deleteDetail(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new AppError("City id is required", 400);
        }
        await citiesServices.deleteCity(id);
        return res.status(200).json({
            success: true,
            message: "City deleted successfully"
        });
    }
}

module.exports = new citiesController();