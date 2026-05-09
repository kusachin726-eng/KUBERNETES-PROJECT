const AppError = require("../../../../utils/errorHandler/appError");

const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const userServices = require("./user.service");
const db = require("../../../../data-access/sequelize/models");
const formatDateTime = require("../../../../utils/dateUtils");
const staffService = require("../staff/staff.service");
const bcrypt = require('bcryptjs');
class UserController {
    async list(req, res, next) {
        const {
            page = 1,
            limit = 10,
            searchKey = "",
            isActive,
            sortBy = "createdAt",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;

        const filters = {
            searchKey,
            user_type: req.staff ? req.query.userType : req.user_type,
            isActive,
        };

        const sortOptions = {
            sortBy,
            sortOrder,
        };

        const customerList = await userServices.getAllUsers(
            filters,
            limit,
            offset,
            sortOptions
        );

        res.status(200).json({
            success: true,
            data: customerList
        });
    }

    async getUserDetails(req, res, next) {
        const { id } = req.params;
        const user_type = req.user_type;
        const user = await userServices.getUserById({id, user_type});

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    }

    async userCreate(req, res, next) {
        const body = req.body;
        const user_type = req.user_type;

        const whereClause = {};
        if(user_type === 'admin'){
            if(!body?.email || !body?.password){
                throw new AppError("Email and Password are required to create admin", 400);
            }
        }
        if(body.mobile_number && body.email){
            whereClause[Op.or] = [
                { mobile_number: body.mobile_number },
                { email: body.email }
            ];
        } else if(body.mobile_number){
            whereClause.mobile_number = body.mobile_number;
        } else if(body.email){
            whereClause.email = body.email;
        }

        if(user_type) {
            whereClause.user_type = user_type;
        }

        const existingAdmin = await db.Users.findOne({
            where: whereClause
        });

        if (existingAdmin) {
            throw new AppError("Admin with this mobile number or email already exists", 400);
        }
        const userData = {
            mobile_number: body.mobile_number,
            user_type: user_type,
            email: body.email
        };
        const profileData = {
            firstName: body.firstName,
            lastName: body.lastName,
            avatarUrl: body.avatarUrl || null,
            gender: body.gender || null,
            dateOfBirth: body.dateOfBirth || null,
            bio: body.bio || null
        };
        if(user_type === 'admin'){
            userData.password = await bcrypt.hash(body.password, 10);
            userData.admin_role_id = body.admin_role_id;
        }
        const newUser = await userServices.createUser(userData,profileData);
        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: newUser
        });
    }

    async updateUser(req, res, next) {
        const { id } = req.params;
        const updateData = req.body;
        const user_type = req.user_type;
        const updateUser = await userServices.updateUser(id, updateData, user_type);

        if (!updateUser) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Updated successfully",
        });
    }

    async deleteUser(req, res, next) {
        const { id } = req.params;
        const user_type = req.user_type;
        const user = await userServices.getUserById({id, user_type});

        if (!user) {
            return next(new AppError("User not found", 404));
        }

        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }

    async changeStatus(req, res, next) {
        const { id } = req.params;
        const user_type = req.user_type;
        const user = await userServices.getUserById({id, user_type});

        if (!user) {
            return next(new AppError("User not found", 404));
        }
        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Status Updated successfully",
        });
    }

    async changeAdminRole(req, res, next) {
        const { id } = req.params; // user id
        const { admin_role_id } = req.body; // new role id

        if (!admin_role_id) {
            throw new AppError("admin_role_id is required", 400);
        }
        const user = await db.Users.findOne({
            where: { id, deletedAt: null }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }
        const role = await db.AdminRoles.findOne({
            where: {
                id: admin_role_id,
                isActive: true
            }
        });

        if (!role) {
            throw new AppError("Admin role not found or inactive", 400);
        }

        if (user.admin_role_id === Number(admin_role_id)) {
            throw new AppError("User already has this admin role", 400);
        }

        await user.update(
            { admin_role_id },
            { individualHooks: true }
        );

        res.status(200).json({
            success: 1,
            message: "Admin role updated successfully",
        });
    }
}

module.exports = new UserController();