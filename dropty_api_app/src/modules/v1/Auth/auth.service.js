const { Op } = require("sequelize");
const db = require("../../../data-access/sequelize/models");
const { sendSMS } = require("../../../utils/sms");
const User = db.Users;


class AuthServices {
    async isUserExist(conditions) {
        try {
            return await User.findOne({
                where: conditions,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password', 'otp', 'otp_expires_at', 'admin_role_id'] },
                include: [
                    {
                        model: db.UserProfile,
                        as: 'userProfile',
                        attributes: { exclude: ['id', 'userId', 'createdAt', 'updatedAt'] }
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    }

    async createOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        const expirationTime = new Date(now.getTime() + 10 * 60000);
        return {
            otp: otp,
            expirationTime: expirationTime
        };
    }

    async sendOtp(mobile_number, country_code, user_type, deviceInfo = '') {
        try {
            const { otp, expirationTime } = await this.createOTP();
            const isRegistered = await this.isUserExist({
                country_code: country_code,
                mobile_number: mobile_number.toString(),
                user_type: user_type
            });

            let userDetail = {};

            let newUser = false;
            if (isRegistered) {
                if (isRegistered.isActive === false) {
                    return false;
                }
                let updateUser = await isRegistered.update({
                    otp: otp,
                    otp_expires_at: expirationTime,
                    updatedAt: new Date()
                });
                userDetail = { id: isRegistered.id, isActive: isRegistered.isActive };
            } else {
                let createUser = await this.createUser({
                    mobile_number: mobile_number.toString(),
                    otp: otp,
                    otp_expires_at: expirationTime,
                    country_code: country_code,
                    user_type: user_type ? user_type : 'customer',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                newUser = true;
                createUser = createUser.get({ plain: true });
                userDetail = { id: createUser.id, isActive: createUser.isActive };
            }
            if (process.env.NODE_ENV === 'production') {
                if (deviceInfo == 'android') {
                    const sendOtp = await sendSMS([
                        {
                            "mobiles": `91${mobile_number}`,
                            "var1": `${otp}`,
                            "var2": `${appSignature}`
                        }
                    ], 'adfasdfasdfsadfasdf');
                } else {
                    const sendOtp = await sendSMS([
                        {
                            "mobiles": `91${mobile_number}`,
                            "number": `${otp}`
                        }
                    ], 'asdfasdfasdfsadfasdfa');
                }
            }
            if (process.env.NODE_ENV === 'development') {
                return { userDetail, newUser, otp, ss: process.env.NODE_ENV }
            }

            return { userDetail, newUser }

        } catch (error) {
            throw error;
        }
    }

    async verifyOtp(mobile_number, country_code, otp, user_type) {
        try {
            const checkExpiredOtp = await User.count({
                where: {
                    country_code: country_code,
                    mobile_number: mobile_number.toString(),
                    user_type: user_type,
                    otp_expires_at: {
                        [Op.gt]: new Date()
                    },
                }
            });
            if (checkExpiredOtp === 0) {
                const error = new Error("OTP has expired");
                error.statusCode = 400;
                throw error;
            }
            let userData = await this.isUserExist({
                country_code: country_code,
                mobile_number: mobile_number.toString(),
                user_type: user_type,
                otp: otp.toString(),
                deletedAt: null,
            });

            if (!userData) {
                const error = new Error("Invalid OTP");
                error.statusCode = 400;
                throw error;
            }

            userData = await userData.update({
                isMobileVerified: true,
                otp: null,
                otp_expires_at: null,
                updatedAt: new Date()
            });
            return userData;

        } catch (error) {
            throw error;
        }
    }

    async isRegistered(mobileNumber) {
        try {
            return await User.findOne({
                where: {
                    mobileNumber: mobileNumber.toString(),
                    deletedAt: null
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async createUser(data) {
        try {
            return await User.create(
                data,
                { attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'user_type', 'password', 'otp', 'otp_expires_at', 'admin_role_id'] } }
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthServices();