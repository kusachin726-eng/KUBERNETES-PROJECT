const { Op } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
const AppError = require("../../../../utils/errorHandler/appError");

class citiesServices {
    async getAllCities(filters, limit, offset, sortOptions) {
        const whereClause = {
          deletedAt: null
        };
      
        if (filters.searchKey) {
          whereClause[Op.or] = [
            { city: { [Op.iLike]: `%${filters.searchKey}%` } },
            { state: { [Op.iLike]: `%${filters.searchKey}%` } },
            { country: { [Op.iLike]: `%${filters.searchKey}%` } },
            { countryCode: { [Op.iLike]: `%${filters.searchKey}%` } },
            { stateCode: { [Op.iLike]: `%${filters.searchKey}%` } },
            { pincode: { [Op.contains]: `%${filters.searchKey}%` } },
          ];
        }
        if (filters.isActive !== undefined) {
          whereClause.isActive =
            filters.isActive === 'true' || filters.isActive === true;
        }
      
        return await db.Cities.findAndCountAll({
          where: whereClause,
          limit: Number(limit),
          offset: Number(offset),
          order: [[sortOptions.sortBy, sortOptions.sortOrder]],
        });
      }
      
      async getCityById(id) {
        return await db.Cities.findOne({
            where: {
                id,
                deletedAt: null
            }
        });
    }
    
      async updateCity(id, updateData) {
        const city = await db.Cities.findOne({
          where: { id: Number(id), deletedAt: null }
        });
      
        if (!city) {
          throw new AppError("City not found", 404);
        }      
        if (updateData.city || updateData.country) {
      
          const duplicate = await db.Cities.findOne({
            where: {
              city: updateData.city || city.city,
              country: updateData.country || city.country,
              id: { [Op.ne]: id },
              deletedAt: null
            }
          });
      
          if (duplicate) {
            throw new AppError("City with this country already exists", 400);
          }
        }
        Object.assign(city, updateData);
        await city.save();
        return city;
      }
      
      async updateCityStatus(id, status) {
        const city = await db.Cities.findOne({
          where: { id, deletedAt: null }
        });
        if (!city) {
          throw new AppError("City not found", 404);
        }
        city.isActive = status;
        await city.save();
        return city;
      }
    
  
  async deleteCity(id) {
    const city = await db.Cities.findOne({
      where: { id, deletedAt: null }
    });
    if (!city) {
      throw new AppError("City not found", 404);
    }
    await city.destroy();
    return true;
  }  
}

module.exports = new citiesServices();