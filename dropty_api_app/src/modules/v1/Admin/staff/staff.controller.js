const { Op } = require("sequelize");
const AppError = require("../../../../utils/errorHandler/appError");
const staffServices = require("./staff.service");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");

class StaffController {

  async list(req, res, next) {
    const {
      page = 1,
      limit = 10,
      searchKey = "",
      userType,
      isActive,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;
console.log(userType)
    const offset = (page - 1) * limit;

    const filters = {
      searchKey,
      userType,
      isActive,
    };

    const sortOptions = {
      sortBy,
      sortOrder,
    };

    const staffList = await staffServices.getAllStaff(
      filters,
      limit,
      offset,
      sortOptions
    );

    res.status(200).json({
      success: true,
      data: {
        count: staffList.count,
        rows: staffList.rows.map(staff => ({
          ...staff,
          createdAt: formatDateTime(staff.createdAt),
          updatedAt: formatDateTime(staff.updatedAt),
        })),
      }
    });
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const staff = await staffServices.getStaffById(id);

      res.status(200).json({
        success: true,
        data: {
          ...staff,
          createdAt: formatDateTime(staff.createdAt),
          updatedAt: formatDateTime(staff.updatedAt),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const updatedStaff = await staffServices.updateStaff(id, req.body);

      res.status(200).json({
        success: true,
        message: "Staff updated successfully",
        data: updatedStaff,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await staffServices.deleteStaff(id);

      res.status(200).json({
        success: true,
        message: "Staff deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StaffController();
