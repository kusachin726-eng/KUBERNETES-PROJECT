const AppError = require("../../../../../utils/errorHandler/appError");
const { bannerValidationSchema } = require("./schema")

module.exports = {
    bannerValidation: async(req, res, next)=>{
        const value = await bannerValidationSchema.validate(req.body);
        if(value.error){
            return next(new AppError( value.error.details[0].message, 400));
        }else{
            next();
        }
    },
}