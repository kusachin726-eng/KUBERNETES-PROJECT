const express = require("express");

const catchAsyncErr = require("../../../utils/errorHandler/catchAsyncErr");
const UserController = require("./user.controller");
const { createProfileValidation } = require("./validations");
const checkRole = require("../../../middleware/auth/checkRole");
const uploadController = require('../Upload/upload.controller');
const { uploadSingleImage } = require('../../../middleware/multer/singleImageUpload');
const router = express.Router();

router.get(
  "/profile",
  checkRole(["customer", "admin", "crew"]),
  catchAsyncErr(UserController.getProfile.bind(UserController))
);

router.post(
  "/profile",
  createProfileValidation,
  checkRole(["customer", "admin", "crew"]),
  catchAsyncErr(UserController.createProfile.bind(UserController))
);

router.put(
  "/profile",
  createProfileValidation,
  checkRole(["customer", "admin", "crew"]),
  catchAsyncErr(UserController.updateProfile.bind(UserController))
);

router.post(
    '/profile-image', 
    uploadSingleImage,
    checkRole(["customer", "admin", "crew"]),
    (req,res,next)=>{
        if(req.user.user_type==="customer"){
            req.folder = "customer/profile";
        }else if(req.user.user_type==="admin"){
            req.folder = "admin/profile";
        }else if(req.user.user_type==="crew"){
            req.folder = "crew/profile";
        }
        
        next();
    },
    catchAsyncErr(UserController.profileImageUpload.bind(UserController))
);

module.exports = router;