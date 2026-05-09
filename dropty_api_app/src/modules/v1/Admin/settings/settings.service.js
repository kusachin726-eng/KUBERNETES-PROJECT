const { Op } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const AppError = require("../../../../utils/errorHandler/appError");
const createSlug = require("../../../../utils/createSlug");
const { cleanText } = require("../../../../utils/cleanText");
const formatDateTime = require("../../../../utils/dateUtils");
class settingsServices {
  async getAllSettings(filters, limit, offset, sortOptions) {
    try {
      const whereClause = {
        deletedAt: null
      };
      if (filters.searchKey) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${filters.searchKey}%` } }
        ];
      }
      const result = await db.Settings.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset),
        order: [[sortOptions.sortBy, sortOptions.sortOrder]],
        raw: true,
      });
      result.rows = result.rows.map(setting => {
        return {
          ...setting,
          createdAt: formatDateTime(setting.createdAt, "date"),
          updatedAt: formatDateTime(setting.updatedAt, "date"),
        };
      });
      return {
        totalCount: result.count,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(result.count / limit),
        limit: Number(limit),
        rows: result.rows
      };
    } catch (error) {
      throw new Error(`Failed to fetch settings: ${error.message}`);
    }
  }

  async getSettingsById(where = {}) {
    try {
      return await db.Settings.findOne({
        where: {
          deletedAt: null,
          ...where
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch setting: ${error.message}`);
    }
  }

  async createSettings(body, user) {
    try {
      const title = cleanText(body.title);
      const slug = createSlug(title);
      const existingSetting = await this.getSettingsById({
        [Op.or]: [{ title }, { slug }]
      });

      if (existingSetting) {
        throw new AppError("Settings with this title/Slug already exists", 400);
      }
      const newSettings = await db.Settings.create(
        {
          title,
          slug,
          metaData: body.metaData,
          isActive: body.isActive,
          createdBy: user.id
        }
      );
      return newSettings;
    } catch (error) {
      throw new Error(`Settings creation failed: ${error.message}`);
    }
  }

  async updateSettings(id, updateData) {
    try {
      const settings = await this.getSettingsById({ id });
      if (!settings) {
        throw new Error("Settings by this ID not found");
      }
      const exists = await this.getSettingsById({
        title: updateData.title,
        id: { [Op.ne]: id }
      });
      if (exists) {
        throw new AppError("Title already exists", 400);
      }
      settings.title = updateData.title;

      if (updateData.metaData !== undefined) {
        settings.setDataValue("metaData", updateData.metaData);
        }
      await settings.save();
      return settings;
    } 
    catch (error) {
      throw new Error(`Settings update failed: ${error.message}`);

    }
  }
}

module.exports = new settingsServices();
