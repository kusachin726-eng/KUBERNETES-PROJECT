const validate = require("../../../../middleware/validator");
const { checkOtp, checkMobile, customerCheckMobile } = require("./schema");

module.exports = {
  // Use central middleware: pass Joi schema(s) to `validate`
  mobileValidation: validate({ body: checkMobile }),
  customerMobile: validate({ body: customerCheckMobile }),
  otpValidation: validate({ body: checkOtp }),
};