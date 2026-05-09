const validate = require("../../../../../middleware/validator");
const { rolePermissions, adminDetails } = require("./schema");

module.exports = {
  addRoleValidation: validate({ body: rolePermissions }),
  addAdminValidation: validate({ body: adminDetails }),
};