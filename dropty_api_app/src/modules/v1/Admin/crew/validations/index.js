const validate = require("../../../../../middleware/validator");
const { createCrew, updateCrew, updateCrewStatus, validateCrewUnique } = require("./schema");

module.exports = {
  createCrewValidation: validate({ body: createCrew }),
  updateCrewValidation: validate({ body: updateCrew, }),
  updateCrewStatusValidation: validate({ params: updateCrewStatus }),
  validateCrewUniqueValidation: validate({ query: validateCrewUnique }),

};