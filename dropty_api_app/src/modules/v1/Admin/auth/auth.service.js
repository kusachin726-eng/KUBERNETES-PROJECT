const { Op } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");

class AuthServices {
    async verifyEmailPassword(email, password) {
        try {
            const admin = await db.Admin.findOne({
                where: {
                    email: email,
                    password: password,
                    deletedAt: null
                },
                include: [
                    {
                        model: db.AdminRoles,
                        as: "role",
                        attributes: ["title"],
                    },
                ],
            });

            return admin;
        } catch (error) {
            throw error;
        }
    }

    async isUserExist(conditions) {
        try {
            return await db.Users.findOne({
                where: conditions,
            });
        } catch (error) {
            throw error;
        }
    }

    async getPermissionAllByRoleId(roleId) {
        try {
            return await db.AdminPermissions.findAll({ 
                where: { roleId: roleId },
                include: [                    
                    {
                        model: db.AdminRoleFeatures,
                        as: 'feature',
                        attributes: ['title']
                    }
                ],
                attributes: ['id', 'featureId', 'canView', 'canCreate', 'canEdit', 'canDelete']
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthServices();