const { Op, fn, col, where } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");

class UserServices {

  async getAllUsers(filters, limit, offset, sortOptions) {
    try {
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

      if (filters.user_type) {
        whereClause.user_type = {
          [Op.in]: Array.isArray(filters.user_type)
            ? filters.user_type
            : [filters.user_type],
        };
      }

      if (filters.isActive !== undefined) {
        whereClause.isActive =
          filters.isActive === "true" || filters.isActive === true;
      }

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

      result.rows = result.rows.map((user) => {
        const profile = user.userProfile || {};
        const plain = user.get({ plain: true });

        return {
          ...plain,
          name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          avatarUrl: profile.avatarUrl || null,
          userProfile: undefined,
          createdAt: formatDateTime(user.createdAt),
          updatedAt: formatDateTime(user.updatedAt),
        };
      });

      return result;

    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async getUserById(options) {
    try {
      const whereClause = {};

      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            whereClause[key] = value;
          }
        });
      }

      return await db.Users.findOne({
        where: whereClause,
        attributes: {
          exclude: ["password", "otp", "otp_expires_at", "deletedAt"],
        },
        include: [
          {
            model: db.UserProfile,
            as: "userProfile",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "avatarUrl",
              "gender",
              "dateOfBirth",
              "bio",
            ],
            required: false,
          },
        ],
      });

    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async createUser(userData, profileData) {
    const transaction = await db.sequelize.transaction();

    try {
      const newUser = await db.Users.create(userData, { transaction });

      await db.UserProfile.create(
        {
          ...profileData,
          userId: newUser.id,
        },
        { transaction }
      );

      await transaction.commit();
      return newUser;

    } catch (error) {
      await transaction.rollback();
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  async updateUser(id, updateData, user_type) {
    try {
      const user = await this.getUserById({ id, user_type });

      if (!user) {
        throw new Error("User not found");
      }

      if (updateData.email !== undefined) {
        user.email = updateData.email;
      }
      if (updateData.isActive !== undefined) {
        user.isActive = updateData.isActive;
      }

      // create profile if missing
      if (!user.userProfile) {
        if (!updateData.firstName || !updateData.lastName) {
          throw new Error("First Name & Last Name required.");
        }

        user.userProfile = await db.UserProfile.create({
          userId: user.id,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          avatarUrl: updateData.avatarUrl || null,
          gender: updateData.gender || null,
          dateOfBirth: updateData.dateOfBirth || null,
          bio: updateData.bio || null,
        });
      }

      const profileFields = [
        "firstName",
        "lastName",
        "dateOfBirth",
        "gender",
        "bio",
        "avatarUrl",
      ];

      profileFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          user.userProfile[field] = updateData[field];
        }
      });

      await user.save();
      await user.userProfile.save();

      return user;

    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }
}

module.exports = new UserServices();
