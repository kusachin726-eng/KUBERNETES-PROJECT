const { sign } = require("jsonwebtoken");
const AppError = require("../../../utils/errorHandler/appError");
const userService = require("./user.service");
const db = require("../../../data-access/sequelize/models");
const uploadService = require('../Upload/upload.service');


class UserController {
  async uploadSingleImage(req, res, next) {
    const userId = req.user.id;
    const file = req.file;
    const folder = `${req.folderName}/${req.user.user_type}`;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const folderList = [
      'user_avatar/customer',
      'user_avatar/admin'
    ]

    const customerAllowedFolders = [
      'user_avatar/customer'
    ];

    if(req.user.user_type === 'customer' && !customerAllowedFolders.includes(folder)) {
      throw new AppError("You are not allowed to upload image to this folder", 403);
    }

    if(req.user.user_type === 'admin' && !folderList.includes(folder)) {
      throw new AppError("You are not allowed to upload image to this folder222", 403);
    }

    // check file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError("File size exceeds the maximum limit of 50MB", 400);
    }

    if(!folderList.includes(folder)) {
      throw new AppError("Invalid folder name", 400);
    }

    await uploadToAzure(file, folder);

    const fileUrl = `${process.env.AZURE_BLOB_ENDPOINT}/${folder}/${file.originalname}`;

    // Update user's avatarUrl in the database
    await db.UserProfile.update(
      { avatarUrl: fileUrl },
      { where: { userId: userId } }
    );

    res.status(200).json({
      success: true,
      data: {
        imageUrl: fileUrl,
      },
    });
    
  }

  async getProfile(req, res, next) {
    const userId = req.user.id;
    let user = await userService.getUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    user = user.toJSON();
    user.isProfile = user.userProfile ? true : false;
    res.status(200).json({
      success: true,
      data: user,
    });
  }

  async createProfile(req, res, next) {
    const userId = req.user.id;
    const existingProfile = await userService.getUserById(userId);
    if (existingProfile.userProfile) {
      throw new AppError("Profile already exists", 400);
    }
    const profileData = req.body;
    const newProfile = await userService.createUserProfile(userId, profileData);
    res.status(201).json({
      success: true,
      data: newProfile,
    });
  }

  async updateProfile(req, res, next) {
    const userId = req.user.id;
    const profileData = req.body;
    const existingProfile = await userService.getUserById(userId);
    if (!existingProfile.userProfile) {
      throw new AppError("Profile not found", 404);
    }
    const updatedProfile = await db.UserProfile.update(
      {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth || null,
        gender: profileData.gender || null,
        bio: profileData.bio || null,
        avatarUrl: profileData.avatarUrl || null
      },
      {
        where: { userId: userId },
        returning: true,
      }
    );
    res.status(200).json({
      success: true,
      data: updatedProfile[1][0],
    });
  }

  async profileImageUpload(req, res, next) {
    const userId = req.user.id;
    const file = req.file;
    const folder = req.folder;
    if (!file && req.files && req.files.length > 0) {      
      file = req.files.find(f => f.fieldname === 'image') || req.files[0];
    }

    if (!file) {
      return res.status(400).json({ status: false, message: 'No image file provided' });
    }
    const imageUrls = await uploadService.processAndUploadImage(file,folder);
    // const updatedProfile = await db.UserProfile.update(
    //   {
    //     avatarUrl: imageUrls.fileName,
    //   },
    //   {
    //     where: { userId: userId },
    //     returning: true,
    //   }
    // );
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: imageUrls.fileName,
    });
  }

}

module.exports = new UserController();
