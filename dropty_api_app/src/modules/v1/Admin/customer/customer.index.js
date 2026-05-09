const express = require("express");

  
const customerController = require("./customer.controller");
const {
    customerValidations
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");

const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const statusHandler = require("../../../../utils/statushandler");

const db = require("../../../../data-access/sequelize/models");
const { create } = require("../crew/crew.controller");


const router = express.Router();


router.get(
    "/",
    authenticateJWT(['admin']),
    checkPermission('customer', 'canView'),
    catchAsyncErr(customerController.list.bind(customerController))
);

router.get(
  "/detailsById/:id",
  authenticateJWT(['admin']),
  checkPermission('customer', 'canView'),
  catchAsyncErr(customerController.getCustomerDetails.bind(customerController))
)

router.patch(
  "/:id",
  customerValidations,
  authenticateJWT(["admin"]),
  checkPermission('customer', 'canEdit'),
  catchAsyncErr(customerController.updateCustomer.bind(customerController))
);

router.delete(
  "/:id",
  authenticateJWT(["admin"]),
  checkPermission('customer', 'canDelete'),
  catchAsyncErr(customerController.deleteCustomer.bind(customerController))
);

router.patch(
  "/status/:id",
  authenticateJWT(["admin"]),
  (req, res, next) => {
    req.staffType = "customer";
    next();
  },
  catchAsyncErr(statusHandler.handle.bind(statusHandler))
);

module.exports = router;