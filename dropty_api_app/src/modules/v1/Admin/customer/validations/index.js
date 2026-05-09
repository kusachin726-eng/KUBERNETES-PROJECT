const validate = require("../../../../../middleware/validator");
const { customerValiadations } = require("./schema");

module.exports = {
  customerValidations: validate({ body: customerValiadations })
};