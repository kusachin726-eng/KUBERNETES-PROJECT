const catchAsyncErr = require("../../../../utils/errorHandler/catchAsyncErr");
const AppError = require("../../../../utils/errorHandler/appError");

const { getBanners, getServiceCategory, getServiceCategoryByCoordinates, getServiceSubCategoryByCoordinates, getFilteredDataByCoordinates, getProvidersByChildService, getMasterServiceBySubCategoryByCoordinates, getChildServicesBySubCategory, bannerList
 } = require("./service");
const imageUrl = require("../../../../utils/imageUrl");
const db = require("../../../../data-access/sequelize/models");
const { getCustomerDefaultAddress } = require("../Customer/service");



module.exports = {
    getBanners: catchAsyncErr(async (req, res, next) => {
        const bannerType = req.params.bannerType;
        const response = await getBanners({ bannerType: bannerType });
        return res.json({
            success: true,
            message: "Banners fetched successfully",
            data: response,
            imageUrl: await imageUrl()
        });
    }),
    getBannerList: catchAsyncErr(async (req, res, next) => {
        // const bannerType = req.params.bannerType;
        const platform = req.query.platform;
        const category = req.query.category;
        const customerId = req.user.id;
        let Latitude = null;
        let Longitude = null;
        if (!customerId) {
            return next(new AppError("Customer not found", 400));
        }
        const userDefaultAddress = await getCustomerDefaultAddress({ id: customerId });
        if (userDefaultAddress) {
            console.log("userDefaultAddressssssssssssssssssssssssssssss:", userDefaultAddress);
            // return next(new AppError("Default address not found for the user", 400));
            const { latitude, longitude } = userDefaultAddress;
            Latitude = latitude;
            Longitude = longitude;
        }
        

        const response = await bannerList({
            platform,
            category,
            latitude:Latitude,
            longitude:Longitude,
        });
        return res.json({
            success: true,
            message: "Banners fetched successfully",
            data: response.banners,
            totalCount: response.totalCount,
            imageUrl: await imageUrl()
        });
    }),
    getCategoryFromView: catchAsyncErr(async (req, res, next) => {
        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        let response = await getServiceCategoryByCoordinates(latitude, longitude);
        response = response.map((item) => {
            return {
                id: item.catId,
                title: item.catTitle,
                description: '',
                image: item.catImage,
                slug: ''
            }
        })
        return res.json({
            success: true,
            message: "Category fetched successfully",
            data: response
        });
    }),

    getSubCategoryFromView: catchAsyncErr(async (req, res, next) => {
        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        let response = await getServiceSubCategoryByCoordinates(latitude, longitude, { catId: req.params.categoryId });
        response = response.map((item) => {
            return {
                id: item.subCatId,
                title: item.subCatTitle,
                description: '',
                image: item.subCatImage,
                slug: ''
            }
        })
        return res.json({
            success: true,
            message: "Sub Category fetched successfully",
            data: response
        });
    }),
    masterServiceBySubCategory:  catchAsyncErr(async (req, res, next) => {
        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        let response = await getMasterServiceBySubCategoryByCoordinates(latitude, longitude, { subCatId: req.params.subCategoryId });
        response = response.map((item) => {
            return {
                id: item.servMaster.id,
                title: item.servMaster.title,
                image: item.servMaster.images,
                slug: item.servMaster.slug
            }
        })
        if( response.length > 0) {
            response.sort((a, b) => a.title.localeCompare(b.title));
        }
        return res.json({
            success: true,
            message: "Master Services fetched successfully",
            data: response
        });
    }),
    childServicesByMasterServiceId:  catchAsyncErr(async (req, res, next) => {
        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        let response = await getChildServicesBySubCategory(latitude, longitude, { servicesMasterId: req.params.masterServiceId });
        response = response.map((item) => {
            item = item.toJSON();
            return {
                id: item.servicesChildId,
                title: item.serviceTitle,
                shortTitle: item.shortTitle,
                image: item.serviceImages,
                slug: item.serviceSlug,
                description: item.serviceDescription,
                noOfExperts: item.noOfExperts
            }
        })
        return res.json({
            success: true,
            message: "Child Services fetched successfully",
            data: response
        });
    }),
    providersByChildService:  catchAsyncErr(async (req, res, next) => {
        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        let response = await getProvidersByChildService(latitude, longitude, { servicesChildId: req.params.childServiceId }, req.user.id);
        
        response = response.map((item) => {
            item = item.toJSON();
            let name = `${item.firstName}`;
            if(item.middleName) {
                name += ` ${item.middleName}`;
            }
            if(item.lastName) {
                if(item.lastName.trim() !== "."){
                    name += ` ${item.lastName}`;
                }
            }
            name = name.trim();
            return {
                "providerServiceId": item.providerServiceId,
                "userId": item.userId,
                "name": name,
                "gender": item.gender,
                "image": item.profileImage,
                "quantity": parseInt(item.quantity) || 0,
                "price": item.price,
                "rating": item.provServAvgRating || 0,
                "distance": item.distance > 1 ? `${item.distance.toFixed(2) || 0} km` : "Near you",
                "noOfReviews": item.provServTotRating || 0,
                "completedBooking": item.totalCompletedBookings,
                "totalServices": item.totalServices,
                "inCart": item.cartCount>0 ? true : false,
                "noOfAddedServices": item.cartCount>0 ? item.cartCount : "0"
            }
        })
        return res.json({
            success: true,
            message: "Experts fetched successfully",
            data: response
        });
    }),
    getCategory: catchAsyncErr(async (req, res, next) => {
        const response = await getServiceCategory({
            isActive: true,
            parentId: 0
        });

        return res.json({
            success: true,
            //dd,
            message: "Category fetched successfully",
            data: response
        });
    }),
    getSubCategory: catchAsyncErr(async (req, res, next) => {
        const response = await getServiceCategory({
            isActive: true,
            parentId: req.params.categoryId
        });
        return res.json({
            success: true,
            message: "Sub Category fetched successfully",
            data: response
        });
    }),
    getFilter: catchAsyncErr(async (req, res, next) => {

        let defaultAddress = await getCustomerDefaultAddress({ id: req.user.id });
        const longitude = defaultAddress.longitude;
        const latitude = defaultAddress.latitude;
        
        const filters = {
            latitude: latitude,
            longitude: longitude,
            subCategory: req.query.subCategory,
            // rating: req.query.rating,
            // price: req.query.price,
            // providerId: req.query.providerId
        }
        const otherFilter = [
            {
                type: "Rating",
                values: [
                    {
                        id: 1,
                        title: '1 Star and above'
                    },
                    {
                        id: 2,
                        title: '2 Star and above'
                    },
                    {
                        id: 3,
                        title: '3 Star and above'
                    },
                    {
                        id: 4,
                        title: '4 Star and above'
                    }
                ]
            },
            {
                type: "Price",
                values: [
                    {
                        id: 1,
                        title: 'price (Low to High)'
                    },
                    {
                        id: 2,
                        title: 'price (High to Low)'
                    } ]
            } 
        ]
        

        const data = await getFilteredDataByCoordinates(filters);

        let customizeData = data.reduce((acc, item) => {
            // Check if the subCategory is already added
            let subCategoryExists = acc.subCategory.find(sub => sub.subCatId === item.subCatId);
            
            if (!subCategoryExists && item.subCatId) {
                acc.subCategory.push({
                    subCatId: item.subCatId,
                    subCatTitle: item.subCatTitle,
                });
            }
        
            // Check if the provider (userId) is already added
            let providerExists = acc.providers.find(provider => provider.userId === item.userId);
            
            if (!providerExists && item.userId) {
                acc.providers.push({
                    userId: item.userId,
                    fullName: `${item.firstName} ${item.lastName}`, // Assign firstName separately or fetch from the user database
                });
            }
        
            return acc;
        }, { subCategory: [], providers: [] });
        // customizeData.subCategory = customizeData.subCategory.map((item) => {
        //   return { id : item.subCatId,
        //     title : item.subCatTitle
        //    }
        // })
        customizeData.providers = customizeData.providers.map((item) => {
            return { id : item.userId,
              title : item.fullName
             }
          })

        let result = [
            // {
            //     type: "subCategory",
            //     values: customizeData.subCategory
            // },
            {
                type: "Service Experts",
                values: customizeData.providers
            },
            ...otherFilter
        ]

        return res.json({
            success: true,
            data: result,
            message: "Filter Data fetched Successfully",
            // data
        });
    })
}