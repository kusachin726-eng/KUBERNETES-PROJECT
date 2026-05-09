const db = require("../data-access/sequelize/models");

class StatusHandler {
  async handle(req, res, next) {
    try {
      const { model, id } = req.body;

      if (!model || !id) {
        return res.status(400).json({
          success: false,
          message: "model and id are required",
        });
      }

      // Convert model name to Sequelize model
      // Example: "cities" -> db.Cities
      const modelName =
        model.charAt(0).toUpperCase() + model.slice(1).toLowerCase();

      const Model = db[modelName];

      if (!Model) {
        return res.status(400).json({
          success: false,
          message: `Model '${model}' does not exist`,
        });
      }

     const record = await Model.findByPk(Number(id), {
      paranoid: false,
      attributes: ["id", "isActive"],// only bring these column from DB
       });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${modelName} record not found`,
        });
      }
      if (typeof record.isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: `${modelName} does not support status change`,
        });
      }

      // Toggle status
      record.isActive = !record.isActive;
      await record.save();
      
      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: {
          model: modelName,
          id: record.id,
          isActive: record.isActive,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StatusHandler();
