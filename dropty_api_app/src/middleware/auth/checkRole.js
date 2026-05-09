
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/errorHandler/appError');
const db = require('../../data-access/sequelize/models');
const { parse } = require('path');
const auditRequestContext = require('../../utils/auditLog/auditRequestContext');

const checkRole = (requiredRoles) => {
    return async (req, res, next) => {
        if (!Array.isArray(requiredRoles)) {
            requiredRoles = [requiredRoles];
        }

        const authorizationHeader = req.headers.authorization;


        if (!authorizationHeader) {
            return next(new AppError('No token provided', 401));
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return next(new AppError('No token provided', 401));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Set user context for audit logging
            auditRequestContext.setUserContext({
                userId: decoded.id,
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip
              });
            if (!requiredRoles.includes(decoded.user_type)) {
                return next(new AppError('Access denied: insufficient permissions', 403));
            }

            if (decoded.user_type === 'admin') {
                const adminRecord = await db.Users.findOne({
                    where: {
                        id: decoded.id,
                        isActive: true,
                    },
                    // attributes: [],
                    include: [
                        {
                            model: db.DeviceManage,
                            attributes: ['id', 'auth_token', 'is_active'],
                            as: 'devices',
                            where: {
                                auth_token: token,
                                is_active: true
                            },
                            required: true
                        },
                        {
                            model: db.AdminRoles,
                            as: 'adminRole',
                            attributes: ['id', 'title'],
                            where: {
                                isActive: true
                            },
                            include: [
                                {
                                    model: db.AdminPermissions,
                                    as: 'permissions',
                                    attributes: ['featureId', 'canView', 'canCreate', 'canEdit', 'canDelete'],
                                    where: {
                                        isActive: true
                                    },
                                    include: [
                                        {
                                            model: db.AdminRoleFeatures,
                                            as: 'feature',
                                            attributes: ['title'],
                                            where: {
                                                isActive: true
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
                if (!adminRecord) {
                    return next(new AppError('Invalid token or user inactive', 401));
                }
                if (adminRecord.roleChangeFlag === false) {
                    return next(new AppError('Session expired due to role change. Please login again.', 401));
                }
                req.userRolePermissions = adminRecord.adminRole.permissions.map(f => ({
                    featureName: f.feature.title,
                    canView: f.canView,
                    canCreate: f.canCreate,
                    canEdit: f.canEdit,
                    canDelete: f.canDelete
                }));
            }

            req.user = decoded;
            next();
        } catch (err) {
            return next(new AppError('Invalid token', 401));
        }
    };
};

module.exports = checkRole;
