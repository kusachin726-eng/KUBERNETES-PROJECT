const AppError = require("../../../../utils/errorHandler/appError");

const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const customerServices = require("./customer.service");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");
const staffService = require("../staff/staff.service");

class customerController {
    async list(req, res, next) {
        const {
            page = 1,
            limit = 10,
            searchKey = "",
            isActive,
            sortBy = "createdAt",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;

        const filters = {
            searchKey,
            user_type: 'customer',
            isActive,
        };

        const sortOptions = {
            sortBy,
            sortOrder,
        };

        const customerList = await staffService.getAllStaff(
            filters,
            limit,
            offset,
            sortOptions
        );

        res.status(200).json({
            success: true,
            data: customerList
        });
    }

    async getCustomerDetails(req, res, next) {
        const { id } = req.params;

        const customer = await customerServices.getCustomerById(id);

        if (!customer) {
            return next(new AppError("Customer not found", 404));
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    }

    async updateCustomer(req, res, next) {
        const { id } = req.params;
        const updateData = req.body;
        const updatedCustomer = await customerServices.updateCustomer(id, updateData);

        res.status(200).json({
            success: true,
            data: updatedCustomer,
        });
    }

    async deleteCustomer(req, res, next) {
        const { id } = req.params;

        const customer = await customerServices.getCustomerById(id);

        if (!customer) {
            return next(new AppError("Customer not found", 404));
        }

        await customer.destroy();

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
        });
    }

}

module.exports = new customerController();