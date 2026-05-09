const { Op } = require("sequelize");
const db = require("../../../data-access/sequelize/models");

class UserService {
    async getUserById(userId) {
        return await db.Users.findOne({
            where: {
                id: {
                    [Op.eq]: userId
                }
            },
            attributes: ["id","mobile_number", "email"],
            include:[
                {
                    model: db.UserProfile,
                    as: "userProfile",
                    attributes: ["userId", "firstName", "lastName", "dateOfBirth", "gender", "bio", "avatarUrl"]
                }
            ]
        });
    }
    async createUserProfile(userId, profileData) {
        try{
            const newProfile = await db.UserProfile.create({
                userId: userId,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                dateOfBirth: profileData.dateOfBirth || null,
                gender: profileData.gender || null,
                bio: profileData.bio || null,
                avatarUrl: profileData.avatarUrl || null
            });
            return newProfile;
        }catch(error){
            throw error;
        }
    }
}
module.exports = new UserService()





