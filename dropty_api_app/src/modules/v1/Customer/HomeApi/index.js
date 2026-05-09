const express = require("express");

const { getBanners, getCategory, getSubCategory, getCategoryFromView, getSubCategoryFromView, getFilter, masterServiceBySubCategory, childServicesByMasterServiceId, providersByChildService, getBannerList } = require("./controller");
const { bannerValidation } = require("./validations");
const checkRole = require("../../../../middleware/auth/checkRole");

const router = express.Router();


router.get("/filter", checkRole(["2"]), getFilter);
router.get("/banner/:bannerType", checkRole(["2"]), getBanners);
router.get("/banners", checkRole(["2"]), getBannerList);

router.get("/category", checkRole(["2"]), getCategoryFromView);
router.get("/subCategory/:categoryId", checkRole(["2"]), getSubCategoryFromView);
router.get("/masterServicesBySubCategory/:subCategoryId", checkRole(["2"]), masterServiceBySubCategory);
router.get("/childServicesByMasterServiceId/:masterServiceId", checkRole(["2"]), childServicesByMasterServiceId);
router.get("/providersByChildService/:childServiceId", checkRole(["2"]), providersByChildService);

module.exports = router;