const {
  airlineCreateSchema,
  airlineUpdateSchema,
  extraBagFareSchema
} = require("./schema");
const validate = require("../../../../../middleware/validator");

module.exports = {
  createAirlineValidation: validate(airlineCreateSchema),
  updateAirlineValidation: validate(airlineUpdateSchema),
  extraBagFareValidation: validate(extraBagFareSchema)
};
