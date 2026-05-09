const validate = require("../../../../../middleware/validator");
const { customerValiadations, userValidationsSchema } = require("./schema");

module.exports = {
  customerValidations: validate({ body: customerValiadations }),
  userValidations: validate({ body: userValidationsSchema }),
};