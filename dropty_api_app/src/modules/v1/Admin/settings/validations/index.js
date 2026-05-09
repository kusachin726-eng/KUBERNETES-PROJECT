const validate = require("../../../../../middleware/validator");
const { addSettings,updateSettings, settingsIdParam } = require("./schema");

module.exports = {
  addSettingsValidation: validate({ body: addSettings }),
  updateSettingsValidation: validate({ body: updateSettings }),
  settingsIdValidation: validate({ params: settingsIdParam }),
};
