const validate = require("../../../../../middleware/validator");
const { addCity, updateCity, deleteCity } = require("./schema");

module.exports = {
  addCityValidation: validate({ body: addCity }),
  updateCityValidation: validate({ body: updateCity }),
  deleteCityValidation: validate({ params: deleteCity }),
};