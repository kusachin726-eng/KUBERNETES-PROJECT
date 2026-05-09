const express = require("express");  
const userController = require("./user.controller");
const {
    customerValidations,
    userValidations
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");
const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const statusHandler = require("../../../../utils/statushandler");
const router = express.Router();


/***************************** Admin routes *******************************/
router.get(
    "/admin",
    authenticateJWT(['admin']),
    checkPermission('admin', 'canView'),
    (req, res, next) => {
      req.user_type = ['admin'];
      next();
    },
    catchAsyncErr(userController.list.bind(userController))
);

router.get(
  "/admin/detailsById/:id",
  authenticateJWT(['admin']),
  checkPermission('admin', 'canView'),
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.getUserDetails.bind(userController))
)

router.post(
  "/admin/create",
  userValidations,
  authenticateJWT(['admin']),
  checkPermission('admin', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.userCreate.bind(userController))
)

router.patch(
  "/admin/:id",
  customerValidations,
  authenticateJWT(["admin"]),
  checkPermission('admin', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.updateUser.bind(userController))
);

router.delete(
  "/admin/:id",
  authenticateJWT(["admin"]),
  checkPermission('admin', 'canDelete'),
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.deleteUser.bind(userController))
);
router.patch(
  "/admin/changeStatus/:id",
  authenticateJWT(["admin"]),
  checkPermission('admin', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.changeStatus.bind(userController))
);
router.patch(
  "/admin/changeRole/:id",
  authenticateJWT(["admin"]),
  checkPermission('admin', 'canEdit'), 
  (req, res, next) => {
      req.user_type = 'admin';
      next();
  },
  catchAsyncErr(userController.changeAdminRole.bind(userController))
);
/***************************** All Staff routes *******************************/
router.get(
    "/",
    authenticateJWT(['admin']),
    checkPermission('staff', 'canView'),
    (req, res, next) => {
      req.user_type = ['customer', 'crew', 'admin'];
      req.staff=true;
      next();
    },
    catchAsyncErr(userController.list.bind(userController))
);

router.get(
  "/detailsById/:id",
  authenticateJWT(['admin']),
  checkPermission('staff', 'canView'),
  (req, res, next) => {
      req.user_type = '';
      next();
  },
  catchAsyncErr(userController.getUserDetails.bind(userController))
)

router.patch(
  "/:id",
  customerValidations,
  authenticateJWT(["admin"]),
  checkPermission('staff', 'canEdit'),
  (req, res, next) => {
      req.user_type = '';
      next();
  },
  catchAsyncErr(userController.updateUser.bind(userController))
);

router.delete(
  "/:id",
  authenticateJWT(["admin"]),
  checkPermission('staff', 'canDelete'),
  (req, res, next) => {
      req.user_type = '';
      next();
  },
  catchAsyncErr(userController.deleteUser.bind(userController))
);

router.patch(
  "/changeStatus/:id",
  authenticateJWT(["admin"]),
  checkPermission('staff', 'canEdit'),
  (req, res, next) => {
      req.user_type = '';
      next();
  },
  catchAsyncErr(userController.changeStatus.bind(userController))
);

/***************************** Customer routes *******************************/
router.get(
    "/customer",
    authenticateJWT(['admin']),
    checkPermission('customer', 'canView'),
    (req, res, next) => {
      req.user_type = ['customer'];
      next();
    },
    catchAsyncErr(userController.list.bind(userController))
);

router.get(
  "/customer/detailsById/:id",
  authenticateJWT(['admin']),
  checkPermission('customer', 'canView'),
  (req, res, next) => {
      req.user_type = 'customer';
      next();
  },
  catchAsyncErr(userController.getUserDetails.bind(userController))
)

router.post(
  "/customer/create",
  userValidations,
  authenticateJWT(['admin']),
  checkPermission('customer', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'customer';
      next();
  },
  catchAsyncErr(userController.userCreate.bind(userController))
)

router.patch(
  "/customer/:id",
  customerValidations,
  authenticateJWT(["admin"]),
  checkPermission('customer', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'customer';
      next();
  },
  catchAsyncErr(userController.updateUser.bind(userController))
);

router.delete(
  "/customer/:id",
  authenticateJWT(["admin"]),
  checkPermission('customer', 'canDelete'),
  (req, res, next) => {
      req.user_type = 'customer';
      next();
  },
  catchAsyncErr(userController.deleteUser.bind(userController))
);

router.patch(
  "/customer/changeStatus/:id",
  authenticateJWT(["admin"]),
  checkPermission('customer', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'customer';
      next();
  },
  catchAsyncErr(userController.changeStatus.bind(userController))
);

/***************************** crew routes *******************************/
router.get(
    "/crew",
    authenticateJWT(['admin']),
    checkPermission('crew', 'canView'),
    (req, res, next) => {
      req.user_type = ['crew'];
      next();
    },
    catchAsyncErr(userController.list.bind(userController))
);

router.get(
  "/crew/detailsById/:id",
  authenticateJWT(['admin']),
  checkPermission('crew', 'canView'),
  (req, res, next) => {
      req.user_type = 'crew';
      next();
  },
  catchAsyncErr(userController.getUserDetails.bind(userController))
)
router.post(
  "/crew/create",
  userValidations,
  authenticateJWT(['admin']),
  checkPermission('crew', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'crew';
      next();
  },
  catchAsyncErr(userController.userCreate.bind(userController))
)
router.patch(
  "/crew/:id",
  customerValidations,
  authenticateJWT(["admin"]),
  checkPermission('crew', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'crew';
      next();
  },
  catchAsyncErr(userController.updateUser.bind(userController))
);

router.patch(
  "/crew/changeStatus/:id",
  authenticateJWT(["admin"]),
  checkPermission('crew', 'canEdit'),
  (req, res, next) => {
      req.user_type = 'crew';
      next();
  },
  catchAsyncErr(userController.changeStatus.bind(userController))
);

router.delete(
  "/crew/:id",
  authenticateJWT(["admin"]),
  checkPermission('crew', 'canDelete'),
  (req, res, next) => {
      req.user_type = 'crew';
      next();
  },
  catchAsyncErr(userController.deleteUser.bind(userController))
);

module.exports = router;