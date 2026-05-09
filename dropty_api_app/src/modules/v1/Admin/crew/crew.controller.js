const AppError = require("../../../../utils/errorHandler/appError");
const { cleanText } = require("../../../../utils/cleanText");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const crewService = require("./crew.service");
const db = require("../../../../data-access/sequelize/models");

class CrewController {
  async list(req, res, next) {
    const {
      page = 1,
      limit = 10,
      searchKey = "",
      status = "all",
      sortBy = "createdAt",
      sortOrder = "ASC",
    } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
      searchKey,
      status,   
    };

    const sortOptions = {
      sortBy,
      sortOrder,
    };

    const result = await crewService.getAllCrews(filters, limit, offset, sortOptions);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async create(req, res, next) {
    const crew = await db.sequelize.transaction(async (transaction) => {
      return await crewService.createCrew(req.body, transaction);
    });

    const { user, profile } = crew;

    return res.status(201).json({
      success: true,
      message: "Crew created successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          mobile_number: user.mobile_number,
          isActive: user.isActive,
        },
        profile: {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth,
        },
      },
    });
  }

  async update(req, res, next) {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      throw new AppError("User ID is required in URL", 400);
    }

    const updatedCrew = await db.sequelize.transaction(async (transaction) => {
      return await crewService.updateCrewProfile(userId, req.body, transaction, req.user.id);
    });

    return res.status(200).json({
      success: true,
      message: "Crew profile updated successfully",
      data: {
        user: {
          id: updatedCrew.user.id,
          email: updatedCrew.user.email,
          isActive: updatedCrew.user.isActive,
          updatedAt: updatedCrew.user.updatedAt,
        },
        profile: {
          id: updatedCrew.profile.id,
          firstName: updatedCrew.profile.firstName,
          lastName: updatedCrew.profile.lastName,
          gender: updatedCrew.profile.gender,
          dateOfBirth: updatedCrew.profile.dateOfBirth,
          updatedAt: updatedCrew.profile.updatedAt,
        },
      },
    });
  }

  async deleteCrew(req, res, next) {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      throw new AppError("User ID is required in URL", 400);
    }

    const deletedCrew = await db.sequelize.transaction(async (transaction) => {
      return await crewService.softDeleteCrew(userId, transaction);
    });

    return res.status(200).json({
      success: true,
      message: "Crew deleted successfully",
      data: {
        user: {
          id: deletedCrew.user.id,
          mobile_number: deletedCrew.user.mobile_number,
          email: deletedCrew.user.email,
        },
      },
    });
  }

  async updateCrewStatus(req, res, next) {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      throw new AppError("User ID is required in URL", 400);
    }

    const updatedStatus = await crewService.updateCrewStatus(userId);

    return res.status(200).json({
      success: true,
      message: "Crew status updated successfully",
      data: {
        userId: updatedStatus.userId,
        isActive: updatedStatus.isActive,
      },
    });
  }

  async getCrewById(req, res, next) {
    const userId = parseInt(req.params.userId);

    if (!userId) {
      throw new AppError("User ID is required in URL", 400);
    }

    const crew = await crewService.getCrewById(userId);

    return res.status(200).json({
      success: true,
      message: "Crew details fetched successfully",
      data: crew,
    });
  }

  async validateCrewUnique(req, res, next) {
    const { userId, email, mobile_number } = req.query;

    const result = await crewService.validateCrewUnique({
      userId,
      email,
      mobile_number
    });

    // Exists
    if (!result.isValid) {
      return res.status(200).json({
        success: false,
        message: result.message,
        errors: result.errors
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });
  }

}

module.exports = new CrewController();

