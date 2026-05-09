const validate = require("../../../../../middleware/validator");
const { verifyLoginPassword, registerAdmin } = require("./schema");

module.exports = {
  verifyLoginPasswordValidation: validate({ body: verifyLoginPassword }),
  registerAdminValidation: validate({ body: registerAdmin }),
};