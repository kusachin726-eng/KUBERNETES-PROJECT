const { verify } = require("jsonwebtoken");
const AppError = require('../../utils/errorHandler/appError');
module.exports = {
    checkToken: (req, res, next)=>{
        let token = req.get("authorization");
        if(token){
            token = token.slice(7);
            verify(token, process.env.JWT_SECRET, (err, decoded)=>{                
                if(err){

                    res.json({
                        success: false,
                        message: "Invalid Token"
                    });
                }else{
                    req.user = decoded; 
                    requestContext.set('userId', decoded.id);
                    next();
                }
            })
        }else{
            res.json({
                success: false,
                message: "Access denied! unauthorized user"
            });
        }
    }
}