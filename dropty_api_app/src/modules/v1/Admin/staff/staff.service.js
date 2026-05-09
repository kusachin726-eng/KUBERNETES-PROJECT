const { Op, fn, col, where } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");

class StaffServices {
  async getAllStaff(filters, limit, offset, sortOptions) {
    const whereClause = {};

    if (filters.searchKey) {
      const normalizedSearchKey = filters.searchKey.toLowerCase().trim();

      whereClause[Op.or] = [
        { "$userProfile.firstName$": { [Op.iLike]: `%${filters.searchKey}%` } },
        { "$userProfile.lastName$": { [Op.iLike]: `%${filters.searchKey}%` } },

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
          { [Op.iLike]: `%${normalizedSearchKey}%` }
        ),

        { email: { [Op.iLike]: `%${filters.searchKey}%` } },
        { mobile_number: { [Op.iLike]: `%${filters.searchKey}%` } },
      ];
    }

    if (filters.userType) {
      whereClause.user_type = {
        [Op.in]: Array.isArray(filters.userType)
          ? filters.userType
          : [filters.userType],
      };
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive =
        filters.isActive === "true" || filters.isActive === true;
    }

    // 🔹 DB fetch (UNCHANGED)
    const result = await db.Users.findAndCountAll({
      include: [
        {
          model: db.AdminRoles,
          as: "adminRole",
          attributes: ["id", "title"],
        },
        {
          model: db.UserProfile,
          as: "userProfile",
          required: false,
        attributes: ["firstName", "lastName", "avatarUrl"],

        },
      ],
      attributes: {
        exclude: ["password", "otp", "otp_expires_at"],
      },
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [[sortOptions.sortBy, sortOptions.sortOrder]],
    });

    // ✅ ONLY ADD THIS PART
    result.rows = result.rows.map((user) => {
      const profile = user.userProfile || {};
      const plain = user.get({ plain: true });
      return {
        ...plain,
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
        avatarUrl: profile.avatarUrl || null,
        userProfile: undefined, // ensure removed
        createdAt: formatDateTime(user.createdAt),
        updatedAt: formatDateTime(user.updatedAt),
      };
    });

    return result;
  }
}

module.exports = new StaffServices();
