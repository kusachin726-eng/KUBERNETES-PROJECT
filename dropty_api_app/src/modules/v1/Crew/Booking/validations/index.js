const validate = require("../../../../../middleware/validator");
const { pnrDetailsSchema, bookingSchema, bookingAddressSchema, timeSlotValidationSchema, confirmBookingValidationSchema, confirmBookingValidSchema } = require("./schema");

module.exports = {
  // Use central middleware: pass Joi schema(s) to `validate`
  pnrDetailsValidation: validate({ body: pnrDetailsSchema }),
  bookingValidation: validate({ body: bookingSchema }),
  bookingAddressValidation: validate({ body: bookingAddressSchema }),
  timeSlotValidation: validate({ body: timeSlotValidationSchema }),
  confirmBookingValidation: validate({ body: confirmBookingValidationSchema }),
  confirmBookingValid: validate({ body: confirmBookingValidSchema })
};