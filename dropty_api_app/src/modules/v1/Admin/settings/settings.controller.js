const AppError = require("../../../../utils/errorHandler/appError");
const settingsServices = require("./settings.service");
const formatDateTime = require("../../../../utils/dateUtils");

class settingsController {
    async list(req, res) {
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

        const settingsList = await settingsServices.getAllSettings(
            filters,
            limit,
            offset,
            sortOptions
        );
        res.status(200).json({
            success: true,
            data: settingsList
        });
    }

    async settingById(req, res) {
        const { id } = req.params;
        const settings = await settingsServices.getSettingsById({id});
        if (!settings) {
            throw new AppError("Settings with this id not found", 404);
        }
        res.status(200).json({
            success: true,
            data: {
                ...settings.toJSON(),
                createdAt: formatDateTime(settings.createdAt,"date"),
                updatedAt: formatDateTime(settings.updatedAt,"date"),
            }
        });
    }
    
    async addNewSettings(req, res) {
        const newSettings = await settingsServices.createSettings(
            req.body,
            req.user
          );
          res.status(201).json({
            success: true,
            message: "Settings created successfully",
            data: newSettings
          });
        }
    
    async updateSettings(req, res) {
        const { id } = req.params;
        const updatedSettings = await settingsServices.updateSettings(
            id,
            req.body,
        );
        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: updatedSettings
        });
    }
}

module.exports = new settingsController();