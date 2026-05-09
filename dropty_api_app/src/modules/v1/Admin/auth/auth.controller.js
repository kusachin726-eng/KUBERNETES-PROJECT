const AppError = require("../../../../utils/errorHandler/appError");

const { sign } = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const AuthService = require("./auth.service");
const db = require("../../../../data-access/sequelize/models");
class AuthController {
    async registerNewAdmin(req, res) {
        const { email, mobile_number, password } = req.body;

        const existingAdmin = await AuthService.isUserExist({
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

    async verifyEmailPassword(req, res) {
        const { password } = req.body;
        const loginRaw = req.body.login || req.body.email;
        const login = typeof loginRaw === 'string' ? loginRaw.trim() : '';

        const user = await AuthService.isUserExist({
            [Op.or]: [
                { email: login },
                { mobile_number: login }
            ],
            user_type: 'admin',
            deletedAt: null,
            isActive: true
        });
        
        
        if (!user) {
            throw new AppError("Invalid login", 400);
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new AppError("Invalid password", 400);
        }  
        
        await user.update({ roleChangeFlag: true }, { hooks: false});
        const token = sign({
            id: user.id,
            email: user.email,
            user_type: user.user_type,
            roleId: user.admin_role_id
        }, process.env.JWT_SECRET, {
            expiresIn: "720h"
        });
        delete user.dataValues.password;
        const device = await db.DeviceManage.findOne({
            where: {
                user_id: user.id
            }   
        });
        
        if (device) {
            await device.update({
                auth_token: token
            });
        } else {
            await db.DeviceManage.create({
                user_id: user.id,
                auth_token: token,
                device_type: req.body.device_type || 'web'
            });            
        }
        const getRolePermission = await AuthService.getPermissionAllByRoleId(user.admin_role_id);
        return res.json({
            success: true,
            message: "Login successfully",
            data: {
                token,
                user: user,
                permissions: getRolePermission
            }
        });
    }
}

module.exports = new AuthController();