const validate = require("../../../../middleware/validator");
const { createProfileSchema } = require("./schema");

module.exports = {
  // Use central middleware: pass Joi schema(s) to `validate`
  createProfileValidation: validate({ body: createProfileSchema }),
};