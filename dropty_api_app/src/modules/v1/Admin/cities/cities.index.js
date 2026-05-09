const express = require("express");

const citiesController = require("./cities.controller");
const {
    addCityValidation,
    updateCityValidation,
    deleteCityValidation
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");

const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");

const router = express.Router();

router.get(
    "/",
    authenticateJWT(['admin']),
    checkPermission('manage_cities', 'canView'),
    catchAsyncErr(citiesController.list.bind(citiesController))
);

router.get(
    "/getCity/:id",
    authenticateJWT(['admin']),
    checkPermission('manage_cities', 'canView'),
    catchAsyncErr(citiesController.getById.bind(citiesController))
  );
  
router.post(
    "/addCity",
    addCityValidation,                   
    authenticateJWT(['admin']),         
    checkPermission('manage_cities', 'canCreate'),  
    catchAsyncErr(citiesController.addNewCity.bind(citiesController))
  );

router.patch(
    "/updateCity/:id",
    updateCityValidation,
    authenticateJWT(['admin']),
    checkPermission('manage_cities', 'canEdit'),
    catchAsyncErr(
      citiesController.updateDetail.bind(citiesController)
    )
  );

router.patch(
    "/updateCityStatus/:id",
    authenticateJWT(['admin']),
    checkPermission('manage_cities', 'canEdit'),
    catchAsyncErr(
      citiesController.updateStatus.bind(citiesController)
    )
  );
  

router.delete(
    "/deleteCity/:id",
    deleteCityValidation,
    authenticateJWT(['admin']),
    checkPermission('manage_cities', 'canDelete'),
    catchAsyncErr(
      citiesController.deleteDetail.bind(citiesController)
    )
  );
  
module.exports = router;