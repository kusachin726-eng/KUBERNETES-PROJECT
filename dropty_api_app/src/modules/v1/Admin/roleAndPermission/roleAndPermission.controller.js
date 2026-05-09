const AppError = require("../../../../utils/errorHandler/appError");

const { Op } = require("sequelize");
const RoleAndPermissionServices = require("./roleAndPermission.service");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");
const bcrypt = require('bcryptjs');
class RoleAndPermissionController {
    async adminList(req, res, next) {
        const {
            page = 1,
            limit = 10,
            searchKey = "",
            userType,
            isActive,
            sortBy = "createdAt",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;

        const filters = {
            searchKey,
            userType,
            isActive,
        };

        const sortOptions = {
            sortBy,
            sortOrder,
        };

        const adminList = await RoleAndPermissionServices.getAdminList(
            filters,
            limit,
            offset,
            sortOptions
        );

        res.status(200).json({
            success: true,
            data: {
                "count": adminList.count,
                "rows": adminList.rows.map(admin => ({
                    ...admin.toJSON(),
                    createdAt: formatDateTime(admin.createdAt, "date"),
                    updatedAt: formatDateTime(admin.updatedAt, "date"),
                })),
            }
        });
    }

    async createAdmin(req, res) {
        const { email, mobile_number, password, admin_role_id } = req.body;

        const existingAdmin = await RoleAndPermissionServices.isUserExist({
            [Op.or]: [
                { email: email },
                { mobile_number: mobile_number }
            ],
            user_type: 'admin',
            deletedAt: null
        });
        if (existingAdmin) {
            throw new AppError("Admin with this mobile number or email already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await db.Users.create({
            email: email,
            mobile_number: mobile_number,
            admin_role_id: admin_role_id,
            password: hashedPassword,
            user_type: 'admin',
            isEmailVerified: false,
            isMobileVerified: false,
            isActive: true
        });
        delete newAdmin.dataValues.password;
        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: newAdmin
        });
    }
    async getAdminById(req, res) {
        const { adminId } = req.params;
        const admin = await RoleAndPermissionServices.isUserExist({
            id: adminId,
            user_type: 'admin',
            deletedAt: null
        });
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }
        delete admin.dataValues.password;
        delete admin.dataValues.otp;
        delete admin.dataValues.otp_expires_at;

        return res.status(200).json({
            success: true,
            data: admin
        });
    }

    async updateAdmin(req, res) {
        const { adminId } = req.params;
        
        const { email, mobile_number, isActive, admin_role_id } = req.body;
        const admin = await RoleAndPermissionServices.isUserExist({
            id: adminId,
            user_type: 'admin',
            deletedAt: null
        });
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }

        // Check for email or mobile number conflicts
        const conflictAdmin = await RoleAndPermissionServices.isUserExist({
            [Op.or]: [
                { email: email },
                { mobile_number: mobile_number }
            ],
            user_type: 'admin',
            deletedAt: null,
            id: { [Op.ne]: adminId } // Exclude current admin
        });
        if (conflictAdmin) {
            throw new AppError("Another admin with this mobile number or email already exists", 400);
        }

        // Update admin details
        admin.email = email !== undefined ? email : admin.email;
        admin.mobile_number = mobile_number !== undefined ? mobile_number : admin.mobile_number;
        admin.isActive = isActive !== undefined ? isActive : admin.isActive;
        admin.admin_role_id = admin_role_id !== undefined ? admin_role_id : admin.admin_role_id;

        await admin.save();
        delete admin.dataValues.password;
        delete admin.dataValues.otp;
        delete admin.dataValues.otp_expires_at;

        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: admin
        });
    }

    async deleteAdmin(req, res) {
        const { adminId } = req.params;
        const admin = await RoleAndPermissionServices.isUserExist({
            id: adminId,
            user_type: 'admin',
            deletedAt: null
        });
        if (!admin) {
            throw new AppError("Admin not found", 404);
        }
        await admin.destroy();
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    }

    async featureList(req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchKey = req.query.searchKey || '';
        const offset = (page - 1) * limit;
        const featureList = await RoleAndPermissionServices.getFeaturesList(searchKey, limit, offset);
        res.status(200).json({
            success: true,
            data: {
                "count": featureList.count,
                "rows": featureList.rows.map(feature => ({
                    ...feature.toJSON(),
                    createdAt: formatDateTime(feature.createdAt, "date"),
                    updatedAt: formatDateTime(feature.updatedAt, "date"),
                })),
            }
        });
    }

    async createFeature(req, res, next) {
        const { title } = req.body;
        const featureExists = await db.AdminRoleFeatures.findOne({ where: { title: title } });
        if (featureExists) {
            throw new AppError('Feature with this title already exists', 400);
        }
        const feature = await RoleAndPermissionServices.createFeature(title);
        if (!feature) {
            throw new AppError('Feature creation failed', 500);
        }
        res.status(201).json({
            success: true,
            data: feature,
        });
    }

    async getFeatureById(req, res, next) {
        const { featureId } = req.params;
        const feature = await RoleAndPermissionServices.getFeatureById(featureId);
        if (!feature) {
            throw new AppError('Feature not found', 404);
        }
        res.status(200).json({
            success: true,
            data: feature,
        });
    }

    async updateFeature(req, res, next) {
        const { featureId } = req.params;
        const { title, isActive } = req.body;
        const feature = await RoleAndPermissionServices.updateFeature(featureId, title, isActive);
        if (!feature) {
            throw new AppError('Feature update failed', 500);
        }
        res.status(200).json({
            success: true,
            data: feature,
        });
    }

    async roleList(req, res, next) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchKey = req.query.searchKey || '';
        const offset = (page - 1) * limit;
        let roleList = await RoleAndPermissionServices.getRoleList(searchKey, limit, offset);

        res.status(200).json({
            success: true,
            data: roleList,
        });
    }

    async createRole(req, res, next) {
        const { title } = req.body;
        const roleExists = await db.AdminRoles.findOne({ where: { title: title } });
        if (roleExists) {
            throw new AppError('Role with this title already exists', 400);
        }
        const role = await RoleAndPermissionServices.createRole(title);
        if (!role) {
            throw new AppError('Role creation failed', 500);
        }
        res.status(201).json({
            success: true,
            data: role,
        });
    }

    async updateRole(req, res, next) {
        const { roleId } = req.params;
        const { title, isActive } = req.body;

        const role = await RoleAndPermissionServices.updateRole(roleId, title, isActive);
        if (!role) {
            throw new AppError('Role update failed', 500);
        }
        res.status(200).json({
            success: true,
            data: role,
        });
    }

    async getRoleById(req, res, next) {
        const { roleId } = req.params;
        const role = await RoleAndPermissionServices.getRoleById(roleId);
        if (!role) {
            throw new AppError('Role not found', 404);
        }
        res.status(200).json({
            success: true,
            data: role,
        });
    }

    async updatePermissionRoleFeatures(req, res, next) {
        const { roleId, permissionData } = req.body;
        const result = await RoleAndPermissionServices.updatePermissionRoleFeatures(roleId, permissionData);
        if (!result) {
            throw new AppError('Updating permissions and features failed', 500);
        }
        res.status(200).json({
            success: true,
            message: 'Permissions and features updated successfully',
        });
    }

    async deleteFeature(req, res, next) {
        const { featureId } = req.params;
        const feature = await RoleAndPermissionServices.getFeatureById(featureId);
        if (!feature) {
            throw new AppError('Feature not found', 404);
        }
        await feature.destroy();
        res.status(200).json({
            success: true,
            message: 'Feature deleted successfully',
        });
    }

    async deleteRole(req, res, next) {
        const { roleId } = req.params;
        const role = await RoleAndPermissionServices.getRoleById(roleId);
        if (!role) {
            throw new AppError('Role not found', 404);
        }
        await role.destroy();
        res.status(200).json({
            success: true,
            message: 'Role deleted successfully',
        });
    }
}

module.exports = new RoleAndPermissionController();