const { sign } = require("jsonwebtoken");
const AppError = require("../../../utils/errorHandler/appError");
const authService = require("./auth.service");
const db = require("../../../data-access/sequelize/models"); 

class AuthController {
  async verifyMobileNo(req, res) {
    const { mobile_number, country_code, user_type } = req.body;

    if (!mobile_number)
      throw new AppError("mobile_number is required", 400);

    const result = await authService.sendOtp(mobile_number, country_code, user_type);

    const user = result?.userDetail
      ? {
          ...result.userDetail
        }
      : null;

    return res.json({
      success: true,
      message: "OTP sent successfully",
      data: { ...result, userDetail: user },
    });
  }

  async verifyOtp(req, res) {
    const { mobile_number, country_code, otp, user_type, device_id, fcm_token, device_type, isDeleteUser } = req.body;
    
    if (!mobile_number)
      throw new AppError("mobile_number is required", 400);
    if (!otp)
      throw new AppError("otp is required", 400);

    let result = await authService.verifyOtp(mobile_number, country_code, otp, user_type);
    if( !result ) {
      throw new AppError("OTP verification failed", 400);
    }
    if( isDeleteUser ) {
      await result.destroy();
      return res.json({
        success: true,
        message: "User removed successfully",
      });
    }
    const token = sign({
        id: result.id,
        mobile_number: result.mobile_number,
        user_type: result.user_type,
        country_code: result.country_code,
        isActive: result.isActive,
        email: result.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    result = result.toJSON();
    result.token = token;

    const device_manager = await db.DeviceManage.findOne({
      where: {
        user_id: result.id,
        device_id: device_id
      }
    });
    if (device_manager) {
        await device_manager.update({
            fcm_token: fcm_token,
            auth_token: token,
            updatedAt: new Date()
        });
    } else {
        await db.DeviceManage.create({
            user_id: result.id,
            device_id: device_id,
            fcm_token: fcm_token,
            auth_token: token,
            device_type: device_type || 'mobile',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    result.isProfile = result.userProfile ? true : false;
    return res.json({
      success: true,
      message: "OTP verified successfully",
      data: result,
    });
  }
}

module.exports = new AuthController();
