const express = require("express");

const RoleAndPermissionController = require("./roleAndPermission.controller");
const {
    addRoleValidation,
    addAdminValidation
} = require("./validations");

const authenticateJWT = require("../../../../middleware/auth/checkRole");

const checkPermission = require("../../../../middleware/auth/rbac");
const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");

const router = express.Router();

router.get(
    "/adminList",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.adminList.bind(RoleAndPermissionController))
);

router.post(
    "/createAdmin",
    addAdminValidation,
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canCreate'),
    catchAsyncErr(RoleAndPermissionController.createAdmin.bind(RoleAndPermissionController))
);

router.get(
    "/getAdminById/:adminId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.getAdminById.bind(RoleAndPermissionController))
);

router.delete(
    "/deleteAdmin/:adminId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canDelete'),
    catchAsyncErr(RoleAndPermissionController.deleteAdmin.bind(RoleAndPermissionController))
);

router.patch(
    "/updateAdmin/:adminId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canEdit'),
    catchAsyncErr(RoleAndPermissionController.updateAdmin.bind(RoleAndPermissionController))
);

router.get(
    "/featureList",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.featureList.bind(RoleAndPermissionController))
);

router.post(
    "/createFeature",
    authenticateJWT(['admin']),
    addRoleValidation,
    checkPermission('role_and_permission', 'canCreate'),
    catchAsyncErr(RoleAndPermissionController.createFeature.bind(RoleAndPermissionController))
);

router.patch(
    "/updateFeature/:featureId",
    authenticateJWT(['admin']),
    addRoleValidation,
    checkPermission('role_and_permission', 'canEdit'),
    catchAsyncErr(RoleAndPermissionController.updateFeature.bind(RoleAndPermissionController))
);

router.get(
    "/getFeatureById/:featureId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.getFeatureById.bind(RoleAndPermissionController))
);

router.get(
    "/roleList",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.roleList.bind(RoleAndPermissionController))
);

router.post(
    "/createRole",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canCreate'),
    catchAsyncErr(RoleAndPermissionController.createRole.bind(RoleAndPermissionController))
);

router.patch(
    "/updateRole/:roleId",
    authenticateJWT(['admin']),
    addRoleValidation,
    checkPermission('role_and_permission', 'canEdit'),
    catchAsyncErr(RoleAndPermissionController.updateRole.bind(RoleAndPermissionController))
);

router.get(
    "/getRoleById/:roleId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canView'),
    catchAsyncErr(RoleAndPermissionController.getRoleById.bind(RoleAndPermissionController))
)

router.post(
    "/updatePermissionRoleFeatures",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canEdit'),
    catchAsyncErr(RoleAndPermissionController.updatePermissionRoleFeatures.bind(RoleAndPermissionController))
)

router.delete(
    "/deleteFeature/:featureId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canDelete'),
    catchAsyncErr(RoleAndPermissionController.deleteFeature.bind(RoleAndPermissionController))
);

router.delete(
    "/deleteRole/:roleId",
    authenticateJWT(['admin']),
    checkPermission('role_and_permission', 'canDelete'),
    catchAsyncErr(RoleAndPermissionController.deleteRole.bind(RoleAndPermissionController))
);

module.exports = router;