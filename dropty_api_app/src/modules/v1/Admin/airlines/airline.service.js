const db = require("../../../../data-access/sequelize/models");
const { Op } = require("sequelize");
const formatDateTime = require("../../../../utils/dateUtils");

class AirlineService {

  async createAirline(data) {
    try {
      const airlineName = typeof data.airlineName === "string" ? data.airlineName.trim() : "";

      if (!airlineName) {
        throw new Error("Airline name cannot be empty");
      }
      const airlineExists = await db.Airlines.findOne({
        where: { airlineName: data.airlineName }
      });

      if (airlineExists) {
        throw new Error("Airline with this name already exists");
      }

      const airline = await db.Airlines.create({
        airlineName: data.airlineName,
        airlineLogo: data.airlineLogo,
        isActive: data.isActive
      });

      const plain = airline.get({ plain: true });
      plain.createdAt = formatDateTime(airline.createdAt);
      delete plain.updatedAt;
      delete plain.deletedAt;

      return plain;
    } catch (err) {
      throw err;
    }
  }

  // reusable base query 
  baseQuery = {
    attributes: { exclude: ["updatedAt", "deletedAt"] },
    include: [
      {
        model: db.AirlineExtraBagFare,
        as: "extraBagFares",
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] }
      }
    ],
    distinct: true
  };

  async getAllAirlines(filters = {}, limit, offset, sortOptions = {}) {
    try {
      const where = {};

      if (filters.searchKey) {
        where.airlineName = { [Op.iLike]: `%${filters.searchKey}%` };
      }

      if (filters.isActive !== undefined) {
        where.isActive =
          filters.isActive === "true" || filters.isActive === true;
      }

      const result = await db.Airlines.findAndCountAll({
        ...this.baseQuery,
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [[sortOptions.sortBy || "createdAt", sortOptions.sortOrder || "DESC"]]
      });

      result.rows = result.rows.map((airline) => {
        const plain = airline.get({ plain: true });
        plain.createdAt = formatDateTime(airline.createdAt);

        // group & sort extraBagFares
        const bag = [];
        const weight = [];

        (plain.extraBagFares || []).forEach((fare) => {
          if (fare.baggageType === "bag") bag.push(fare);
          if (fare.baggageType === "weight") weight.push(fare);
        });

        const sortByKgAsc = (a, b) =>
          Number(a.additionalKg) - Number(b.additionalKg);

        bag.sort(sortByKgAsc);
        weight.sort(sortByKgAsc);

        plain.extraBagFares = {
          bag,
          weight
        };

        return plain;
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAirlineById(id) {
    try {
      const airline = await db.Airlines.findOne({
        ...this.baseQuery,
        where: { id }
      });

      if (!airline) {
        throw new Error("Airline not found");
      }

      const plain = airline.get({ plain: true });
      plain.createdAt = formatDateTime(airline.createdAt);

      const bag = [];
      const weight = [];

      (plain.extraBagFares || []).forEach((fare) => {
        if (fare.baggageType === "bag") bag.push(fare);
        if (fare.baggageType === "weight") weight.push(fare);
      });

      const sortByKgAsc = (a, b) =>
        Number(a.additionalKg) - Number(b.additionalKg);

      bag.sort(sortByKgAsc);
      weight.sort(sortByKgAsc);

      plain.extraBagFares = {
        bag,
        weight
      };

      return plain;
    } catch (err) {
      throw err;
    }
  }


  async updateAirline(id, data) {
    try {
      const airline = await db.Airlines.findByPk(id);

      if (!airline) {
        throw new Error("Airline not found");
      }

      if (data.airlineName !== undefined)
        airline.airlineName = data.airlineName;

      if (data.airlineLogo !== undefined)
        airline.airlineLogo = data.airlineLogo;

      if (data.isActive !== undefined)
        airline.isActive = data.isActive;

      await airline.save();

      const plain = airline.get({ plain: true });

      return {
        id: plain.id,
        airlineName: plain.airlineName,
        airlineLogo: plain.airlineLogo,
        isActive: plain.isActive,

      };
    } catch (err) {
      throw err;
    }
  }

  async createExtraBagFare(airlineId, data) {
    try {
      await this.getAirlineById(airlineId);

      // check duplication
      const existingFare = await db.AirlineExtraBagFare.findOne({
        where: {
          airlineId,
          flightType: data.flightType,
          baggageType: data.baggageType,
          additionalKg: data.additionalKg
        }
      });

      if (existingFare) {
        throw new Error("Extra baggage fare already exists for this slab");
      }

      const fare = await db.AirlineExtraBagFare.create({
        airlineId,
        flightType: data.flightType,
        baggageType: data.baggageType,
        additionalKg: data.additionalKg,
        additionalKgFare: data.additionalKgFare
      });

      const plain = fare.get({ plain: true });
      plain.createdAt = formatDateTime(fare.createdAt);
      delete plain.updatedAt;
      delete plain.deletedAt;

      return plain;
    } catch (err) {
      throw err;
    }
  }

  async updateExtraBagFarePrice(fareId, price) {
    try {
      const fare = await db.AirlineExtraBagFare.findByPk(fareId);

      if (!fare) {
        throw new Error("Extra baggage fare not found");
      }

      // only price allowed to be updated
      await db.AirlineExtraBagFare.update(
        { additionalKgFare: price },
        {
          where: { id: fareId },
          fields: ["additionalKgFare"]
        }
      );

      const updatedFare = await db.AirlineExtraBagFare.findByPk(fareId);

      const plain = updatedFare.get({ plain: true });
      plain.createdAt = formatDateTime(updatedFare.createdAt);
      delete plain.updatedAt;
      delete plain.deletedAt;

      return plain;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AirlineService();
