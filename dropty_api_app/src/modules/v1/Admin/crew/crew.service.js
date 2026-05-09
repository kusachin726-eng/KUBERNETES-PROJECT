const { Op, fn, col, where, literal } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const AppError = require("../../../../utils/errorHandler/appError");
const formatDateTime = require("../../../../utils/dateUtils");

class crewService {

  async getAllCrews(filters, limit, offset, sortOptions) {
    const whereCondition = {
      user_type: "crew",
      deletedAt: null,
    };
    
    if (filters.status === "active") {
      whereCondition.isActive = true;
    } else if (filters.status === "inactive") {
      whereCondition.isActive = false;
    }

    if (filters.searchKey) {
      const normalizedSearchKey = filters.searchKey
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

      whereCondition[Op.or] = [
        where(fn("lower", col("userProfile.firstName")), {
          [Op.like]: `%${normalizedSearchKey}%`,
        }),
        where(fn("lower", col("userProfile.lastName")), {
          [Op.like]: `%${normalizedSearchKey}%`,
        }),

        // full name: firstName + space + lastName
        where(
          fn(
            "lower",
            fn(
              "concat",
              col("userProfile.firstName"),
              " ",
              fn("coalesce", col("userProfile.lastName"), "")
            )
          ),
          { [Op.like]: `%${normalizedSearchKey}%` }
        ),
        { mobile_number: { [Op.iLike]: `%${filters.searchKey.trim()}%` } },
      ];
    }

    /* ---------------- SORT MAP ---------------- */
    const sortMap = {
      firstName: ["userProfile", "firstName"],
      lastName: ["userProfile", "lastName"],
      mobile_number: ["mobile_number"],
      createdAt: ["createdAt"],
    };

    const orderBy = sortMap[sortOptions.sortBy]
      ? [...sortMap[sortOptions.sortBy], sortOptions.sortOrder.toUpperCase()]
      : ["createdAt", sortOptions.sortOrder.toUpperCase()];

    const totalCount = await db.Users.count({
      where: whereCondition,
      include: [
        {
          model: db.UserProfile,
          as: "userProfile",
          attributes: [],
          required: false,
        },
      ],
      distinct: true,
      subQuery: false,
    });

    const result = await db.Users.findAll({
      where: whereCondition,
      include: [
        {
          model: db.UserProfile,
          as: "userProfile",
          attributes: ["firstName", "lastName"],
          required: false,
        },
      ],
      attributes: ["id", "mobile_number", "email", "isMobileVerified", "isActive", "createdAt", "deletedAt"],
      limit,
      offset,
      order: [orderBy],
      subQuery: false,
    });

    const rows = result.map((item) => ({
      userId: item.id,
      firstName: item.userProfile?.firstName || null,
      lastName: item.userProfile?.lastName || null,
      mobile_number: item.mobile_number,
      isMobileVerified: Boolean(item.isMobileVerified),
      email: item.email || null,
      isActive: item.isActive,

      createdAt: item.createdAt ? formatDateTime(item.createdAt) : null,
      deletedAt: item.deletedAt ? formatDateTime(item.deletedAt) : null,
    }));

    return {
      totalCount,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
      rows,
    };
  }

  async createCrew(data, transaction) {
    const { mobile_number, email } = data;

    const existingUser = await db.Users.findOne({
      where: {
        user_type: "crew",
        [Op.or]: [{ mobile_number }, ...(email ? [{ email }] : [])],
      },
      transaction,
    });

    if (existingUser) {
      if (existingUser.mobile_number === mobile_number) {
        throw new AppError("Mobile number already exists for crew user", 400);
      }

      if (email && existingUser.email === email) {
        throw new AppError("Email already exists for crew user", 400);
      }
    }

    const user = await db.Users.create(
      {
        email: email || null,
        mobile_number,
        user_type: "crew",
      },
      { transaction }
    );

    const profile = await db.UserProfile.create(
      {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth || null,
      },
      { transaction}
    );

    return { user, profile };
  }

  async updateCrewProfile(userId, data, transaction) {

    const user = await db.Users.findOne({
      where: { id: userId, user_type: "crew", deletedAt: null },
      transaction,
    });

    if (!user) throw new AppError("Crew not found", 404);

    if (data.email && data.email !== user.email) {
      const emailExists = await db.Users.findOne({
        where: {
          email: data.email,
          user_type: "crew",
          id: { [Op.ne]: userId },
        },
        transaction,
      });

      if (emailExists) {
        throw new AppError("Email already exists for crew user", 400);
      }

      user.email = data.email;
      await user.save({ transaction});
    }

    const profile = await db.UserProfile.findOne({
      where: { userId },
      transaction,
    });

    if (!profile) throw new AppError("Crew profile not found", 404);

    await profile.update(
      {
        firstName: data.firstName ?? profile.firstName,
        lastName: data.lastName ?? profile.lastName,
        gender: data.gender ?? profile.gender,
        dateOfBirth: data.dateOfBirth ?? profile.dateOfBirth,
      },
      { transaction }
    );

    return { user, profile };
  }

  async softDeleteCrew(userId, transaction) {

    const user = await db.Users.findOne({
      where: { id: userId, user_type: "crew", deletedAt: null },
      transaction,
    });

    if (!user) throw new AppError("Crew not found", 404);

    // First deactivate user
    user.isActive = false;
    await user.save({ transaction });

    // Then soft delete (sets deletedAt)
    await user.destroy({ transaction });

    const profile = await db.UserProfile.findOne({
      where: { userId },
      transaction,
    });

    if (!profile) throw new AppError("Crew profile not found", 404);

    return { user, profile };
  }

  async updateCrewStatus(userId) {
    const user = await db.Users.findOne({
      where: { id: userId, user_type: "crew", deletedAt: null },
    });

    if (!user) {
      throw new AppError("Crew not found", 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
      userId: user.id,
      isActive: user.isActive,
    };
  }

  async getCrewById(userId) {
    const crew = await db.Users.findOne({
      where: { id: userId, user_type: "crew", deletedAt: null },
      attributes: ["id", "email", "mobile_number", "isActive", "createdAt", "updatedAt",],
      include: [
        {
          model: db.UserProfile,
          as: "userProfile",
          attributes: ["firstName", "lastName", "gender", "dateOfBirth"],
        },
      ],
    });

    if (!crew) {
      throw new AppError("Crew not found", 404);
    }

    return crew;
  }

  // validate crew email or mobile number in real time
  async validateCrewUnique({ userId, email, mobile_number }) {
    const errors = {};

    if (email) {
      const existingEmail = await db.Users.findOne({
        where: {
          user_type: "crew",
          deletedAt: null,
          email,
          ...(userId ? { id: { [Op.ne]: userId } } : {})
        },
        attributes: ["id"]
      });

      if (existingEmail) {
        errors.email = "Email already exists for crew";
      }
    }

    if (mobile_number) {
      const existingMobile = await db.Users.findOne({
        where: {
          user_type: "crew",
          deletedAt: null,
          mobile_number,
          ...(userId ? { id: { [Op.ne]: userId } } : {})
        },
        attributes: ["id"]
      });

      if (existingMobile) {
        errors.mobile_number = "Mobile number already exists for crew";
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        isValid: false,
        message: "Validation failed",
        errors
      };
    }

    return {
      isValid: true,
      message: "Email or mobile number are available"
    };
  }


}

module.exports = new crewService();

