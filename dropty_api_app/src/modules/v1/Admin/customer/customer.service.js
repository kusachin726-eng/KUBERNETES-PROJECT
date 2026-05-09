const { Op } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");

class customerServices {
    async getCustomerById(id) {
        try {
            return await db.Users.findOne({
                where: { id, user_type: 'customer' },
                attributes: { exclude: ['password', 'otp', 'otp_expires_at', 'user_type', 'deletedAt'] },
                include: [
                    {
                        model: db.UserProfile,
                        as: "userProfile",
                        attributes: ["id","firstName", "lastName", "avatarUrl", "gender", "dateOfBirth", "bio"],
                        required: false,
                    },
                ],
            });
        } catch (err) {
            throw err;
        }
    }

    async updateCustomer(id, updateData) {
        try {
            const customer = await this.getCustomerById(id);

            if (!customer) {
                throw new Error("Customer not found");
            }
            
            if (updateData.email !== undefined) {
                customer.email = updateData.email;
            }
            if (updateData.isActive !== undefined) {
                customer.isActive = updateData.isActive;
            }

            if (!customer.userProfile) {
                customer.userProfile = await db.UserProfile.create({ userId: customer.id });
            }

            const profileFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bio', 'avatarUrl'];
            profileFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    customer.userProfile[field] = updateData[field];
                }
            });

            await customer.save();
            await customer.userProfile.save();

            return customer;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new customerServices();