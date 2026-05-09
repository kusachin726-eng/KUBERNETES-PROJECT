const { Op, fn, col, where, literal, and, or } = require("sequelize");
const db = require("../../../../data-access/sequelize/models");
let limitKm = 11;
const METERS_PER_KM = 1000;

const latLongCondition = (latitude, longitude) => {
    return {
        [Op.and]: [
            where(fn('ST_Y', col('coordinates')), '<', 90.0),
            where(fn('ST_Y', col('coordinates')), '>', 0.0),
            where(
                fn(
                    'ST_Distance',
                    fn('ST_Transform', col('coordinates'), 3857),
                    fn(
                        'ST_Transform',
                        fn('ST_SetSRID', fn('ST_MakePoint', longitude, latitude), 4326),
                        3857
                    )
                ),
                {
                    [Op.lte]: limitKm * 1000, 
                }
            )
        ]
    }
}
// Helper function for Haversine distance calculation (fallback method)
const calculateHaversineDistance= (lat1, lon1, lat2, lon2) => {
    // Check if all coordinates are valid
    if (!lat1 || !lon1 || !lat2 || !lon2) {
        return null;
    }

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance; // Distance in kilometers
};
// Helper function to convert degrees to radians
const toRad= (value) => {
    return value * Math.PI / 180;
};
const BannerServices = {
    getBanners: async (data) => {
        try {
            const response = await db.ManageBanners.findAll({
                where: {
                    bannerType: data.bannerType,
                    status: "active",
                    startDate: {
                        [Op.lte]: new Date()
                    },
                    expireDate: {
                        [Op.gte]: new Date()
                    }
                },
                order: [
                    ['position', 'ASC'],
                ]
            });
            return response;
        } catch (err) {
            throw new Error(err);
        }
    },

    // bannerList: async (options) => {
    //     console.log("filter optionsssssssssssssssssssssssssssssssssssss:", options);
    //     // status active check
    //     let whereCondition = {
    //         status: 'active',
    //     };
    //     // banner category check...homescreen or other
    //     if (options.category) {
    //         whereCondition.bannerCategory = options.category;
    //     }
    //     // banner platform check
    //     if (options.platform) {
    //         whereCondition.platformName = options.platform;
    //     }

    //     // Add time filter: either valid date range OR null dates
    //     whereCondition[Op.and] = [
    //         {
    //             [Op.or]: [
    //                 {
    //                     startDate: { [Op.lte]: new Date() },
    //                     expireDate: { [Op.gte]: new Date() }
    //                 },
    //                 {
    //                     startDate: null,
    //                     expireDate: null
    //                 }
    //             ]
    //         }
    //     ];

    //     // Spatial filter: include if coordinates and area exist, else include all
    //     if (options.latitude && options.longitude) {
    //         whereCondition[Op.and].push({
    //             [Op.or]: [
    //                 // Case 1: both coordinates and areaInKm exist → apply ST_DWithin
    //                 {
    //                     [Op.and]: [
    //                         { coordinates: { [Op.ne]: null } },
    //                         { areaInKm: { [Op.ne]: null } },
    //                         where(
    //                             fn(
    //                                 'ST_DWithin',
    //                                 col('coordinates'),
    //                                 fn('ST_SetSRID', fn('ST_MakePoint', options.longitude, options.latitude), 4326),
    //                                 literal('"areaInKm" * 1000')
    //                             ),
    //                             true
    //                         )
    //                     ]
    //                 },
    //                 // Case 2: either coordinates or areaInKm is null → include without location check
    //                 {
    //                     [Op.or]: [
    //                         { coordinates: null },
    //                         { areaInKm: null }
    //                     ]
    //                 }
    //             ]
    //         });
    //     }


    //     try {
    //         const banners = await db.ManageBanners.findAll({
    //             attributes: [
    //                 'id',
    //                 'platformName',
    //                 'bannerCategory',
    //                 'isSlider',
    //                 'bannerPosition',
    //                 'dimension',
    //                 'bannerType',
    //                 'appUrl',
    //                 'linkUrl',
    //                 'imageUrl',
    //                 'position',
    //                 'areaInKm',
    //                 'latitude',
    //                 'longitude'
    //             ],
    //             where: whereCondition,
    //             order: [['createdAt', 'desc']]
    //         });

    //         return {
    //             banners: banners,
    //             totalCount: banners.length
    //         };
    //     } catch (error) {
    //         throw new Error(error);
    //     }
    // },

    bannerList: async (options) => {
        console.log("filter optionsssssssssssssssssssssssssssssssssssss:", options);
        const { Op, fn, col, literal, where, cast } = require('sequelize');
        
        // status active check
        let whereCondition = {
            status: 'active',
        };
        // banner category check...homescreen or other
        if (options.category) {
            whereCondition.bannerCategory = options.category;
        }
        // banner platform check
        if (options.platform) {
            whereCondition.platformName = options.platform;
        }

        // Add time filter: either valid date range OR null dates
        whereCondition[Op.and] = [
            {
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: new Date() },
                        expireDate: { [Op.gte]: new Date() }
                    },
                    {
                        startDate: null,
                        expireDate: null
                    }
                ]
            }
        ];

        // Prepare attributes array with distance calculation if user coordinates are provided
        let attributes = [
            'id',
            'platformName',
            'bannerCategory',
            'isSlider',
            'bannerPosition',
            'dimension',
            'bannerType',
            'appUrl',
            'linkUrl',
            'imageUrl',
            'position',
            'areaInKm',
            'latitude',
            'longitude',
            'startDate',
            'expireDate'
            // 'coordinates'
        ];

        // Add distance calculation to attributes if user location is provided
        if (options.latitude && options.longitude) {
            attributes.push([
                fn(
                    'ST_Distance',
                    cast(col('coordinates'), 'geography'),
                    cast(
                        fn('ST_SetSRID', fn('ST_MakePoint', options.longitude, options.latitude), 4326),
                        'geography'
                    )
                ),
                'distanceInMeters'
            ]);
        }

        // Spatial filter: include banners within range OR banners without location restrictions
        if (options.latitude && options.longitude) {
            whereCondition[Op.and].push({
                [Op.or]: [
                    // Case 1: No location restrictions (coordinates or areaInKm is null)
                    {
                        [Op.or]: [
                            { coordinates: null },
                            { areaInKm: null }
                        ]
                    },
                    // Case 2: Has location restrictions and user is within range
                    where(
                        fn(
                            'ST_DWithin',
                            cast(col('coordinates'), 'geography'),
                            cast(
                                fn('ST_SetSRID', fn('ST_MakePoint', options.longitude, options.latitude), 4326),
                                'geography'
                            ),
                            // Multiply areaInKm by 1000 to convert to meters
                            literal('COALESCE("areaInKm", 0) * 1000')
                        ),
                        true
                    )
                ]
            });
        }

        try {
            const banners = await db.ManageBanners.findAll({
                attributes: attributes,
                where: whereCondition,
                // order: [['createdAt', 'desc']],
                order: [
                    ['position', 'ASC'],
                ],
                raw: true // Add raw to get plain objects
            });

            // Process banners to format distance and remove unnecessary fields
            const processedBanners = banners.map(banner => {
                // Create a new object without the coordinates field
                const { coordinates, distanceInMeters, ...bannerData } = banner;
                
                // Add formatted distance if available
                if (distanceInMeters !== undefined && distanceInMeters !== null) {
                    // Convert meters to kilometers and round to 2 decimal places
                    bannerData.distanceInKm = parseFloat((distanceInMeters / 1000).toFixed(2));
                    
                    // Optional: Add human-readable distance
                    if (distanceInMeters < 1000) {
                        bannerData.distanceFormatted = `${Math.round(distanceInMeters)} meters`;
                    } else {
                        bannerData.distanceFormatted = `${(distanceInMeters / 1000).toFixed(1)} km`;
                    }
                } else if (options.latitude && options.longitude && banner.latitude && banner.longitude) {
                    // Fallback: Calculate distance using Haversine formula if coordinates field is null
                    // but latitude and longitude fields exist
                    const distance = calculateHaversineDistance(
                        parseFloat(options.latitude),
                        parseFloat(options.longitude),
                        parseFloat(banner.latitude),
                        parseFloat(banner.longitude)
                    );
                    if (distance !== null) {
                        bannerData.distanceInKm = parseFloat(distance.toFixed(2));
                        bannerData.distanceFormatted = distance < 1 
                            ? `${Math.round(distance * 1000)} meters` 
                            : `${distance.toFixed(1)} km`;
                    }
                }
                
                return bannerData;
            });

            return {
                banners: processedBanners,
                // banners: banners,
                // totalCount: banners.length
                totalCount: processedBanners.length
            };
        } catch (error) {
            throw new Error(error.message || error);
        }
    },

    getServiceCategory: async (conditions) => {
        try {
            return await db.ServiceCategory.findAll({
                where: conditions,
                attributes: ['id', 'title', 'description', 'image', 'slug'],
            });
        } catch (error) {
            throw error;
        }
    },
    getServiceCategoryByCoordinates: async (latitude, longitude) => {
        try {
            let whereCond = {};
            if (latitude && longitude) {
                whereCond = {
                    [Op.and]: [
                        where(fn('ST_Y', col('coordinates')), '<', 90.0),
                        where(fn('ST_Y', col('coordinates')), '>', 0.0),
                        where(
                            fn(
                                'ST_Distance',
                                fn('ST_Transform', col('coordinates'), 3857),
                                fn(
                                    'ST_Transform',
                                    fn('ST_SetSRID', fn('ST_MakePoint', longitude, latitude), 4326),
                                    3857
                                )
                            ),
                            {
                                [Op.lte]: limitKm * 1000, // 10 km converted to meters
                            }
                        )
                    ]
                }
            }
            return await db.ProviderServiceView.findAll({
                where: whereCond,
                attributes: ['catId', [fn('COUNT', col('catId')), 'count'], 'catTitle', 'catImage'],
                group: ['catId', 'ProviderServiceView.catTitle', 'ProviderServiceView.catImage'],  // Group by catId
                order: [['catTitle', 'ASC']]
            });
        } catch (err) {
            throw new Error(err);
        }
    },

    getServiceSubCategoryByCoordinates: async (latitude, longitude, conditions) => {
        try {
            let whereCond = {};
            if (latitude && longitude) {
                whereCond = {
                    [Op.and]: [
                        where(fn('ST_Y', col('coordinates')), '<', 90.0),
                        where(fn('ST_Y', col('coordinates')), '>', 0.0),
                        where(
                            fn(
                                'ST_Distance',
                                fn('ST_Transform', col('coordinates'), 3857),
                                fn(
                                    'ST_Transform',
                                    fn('ST_SetSRID', fn('ST_MakePoint', longitude, latitude), 4326),
                                    3857
                                )
                            ),
                            {
                                [Op.lte]: limitKm * 1000, // 10 km converted to meters
                            }
                        )
                    ]
                }
            }
            return await db.ProviderServiceView.findAll({
                where: { ...whereCond, ...conditions },
                attributes: ['subCatId', [fn('COUNT', col('subCatId')), 'count'], 'subCatTitle', 'subCatImage'],
                group: ['subCatId', 'ProviderServiceView.subCatTitle', 'ProviderServiceView.subCatImage'],  // Group by catId
                order: [['subCatTitle', 'ASC']]
            });
        } catch (err) {
            throw new Error(err);
        }
    },
    getMasterServiceBySubCategoryByCoordinates: async (latitude, longitude, conditions) => {
        try {
            let whereCond = {};
            if (latitude && longitude) {
                whereCond = latLongCondition(latitude, longitude);
            }
            return await db.ProviderServiceView.findAll({
                where: { ...whereCond, ...conditions },
                attributes: ['servicesMasterId'],
                include: [
                    {
                        model: db.ServicesMaster,
                        as: 'servMaster',
                        attributes: ['id', 'title', 'images', 'slug'],
                        where: {
                            parentServiceId: 0
                        }
                    }
                ],
                distinct: true,
                group: ['servicesMasterId', 'servMaster.id', 'servMaster.title', 'servMaster.images', 'servMaster.slug'],
            });
        } catch (err) {
            throw new Error(err);
        }
    },
    getChildServicesBySubCategory: async (latitude, longitude, conditions) => {
        try {
            let whereCond = {};
            if (latitude && longitude) {
                whereCond = latLongCondition(latitude, longitude);
            }
            return await db.ProviderServiceView.findAll({
                where: { 
                    ...whereCond, 
                    ...conditions 
                },
                attributes: [
                    'servicesChildId',
                    'serviceTitle',
                    [literal(`(SELECT "shortTitle" FROM "services_master" WHERE "services_master"."id" = "ProviderServiceView"."servicesChildId")`), 'shortTitle'],
                    'serviceImages',
                    'serviceSlug',
                    [literal(`(SELECT description FROM "services_master" WHERE "services_master"."id" = "ProviderServiceView"."servicesChildId")`), 'serviceDescription'],
                    // [literal(`(SELECT count(*) FROM "ProviderServiceView" WHERE "provider_services"."servicesChildId" = "ProviderServiceView"."servicesChildId")`), 'noOfExperts'],
                    [
                        fn('COUNT', literal('DISTINCT "ProviderServiceView"."userId"')),
                        'noOfExperts'
                    ]
                ],
                distinct: true,
                group: ['servicesChildId', 'serviceTitle', 'serviceImages', 'serviceSlug', 'ProviderServiceView.servicesMasterId'],
                order: [['serviceTitle', 'ASC']],
            });
        } catch (err) {
            throw new Error(err);
        }
    },
    getProvidersByChildService: async (latitude, longitude, conditions, customerId) => {
        try {
            let whereCond = {};
            if (latitude && longitude) {
                whereCond = latLongCondition(latitude, longitude);

            }
            const distanceCalc = `
                    ST_Distance(
                        ST_Transform(coordinates::geometry, 3857),
                        ST_Transform(
                            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geometry,
                            3857
                        )
                    ) / ${METERS_PER_KM}
                `;
            return await db.ProviderServiceView.findAll({
                where: {
                    ...whereCond,
                    ...conditions
                },
                attributes: [
                    'providerServiceId',
                    'userId',
                    'firstName',
                    'middleName',
                    'lastName',
                    // need gender of user
                    [literal(`(SELECT "gender" FROM "user_profile_details" WHERE "user_profile_details"."userId" = "ProviderServiceView"."userId")`), 'gender'],
                    'profileImage',
                    'price',
                    'provTotRating',
                    'provAvgRating',
                    'provServTotRating',
                    'provServAvgRating',
                    [literal(distanceCalc), 'distance'],
                    [literal(`(SELECT COUNT(*) FROM "service_bookings" WHERE "service_bookings"."bookingStatus"='completed' AND "service_bookings"."providerId" = "ProviderServiceView"."userId")`), 'totalCompletedBookings'],
                    [literal(`(SELECT COUNT(*) FROM "carts" WHERE "quantity">0 AND "customerId"='${customerId}' AND "carts"."providerId" = "ProviderServiceView"."userId")`), 'cartCount'],
                    [literal(`(SELECT "quantity" FROM "carts" WHERE "quantity">0 AND "customerId"='${customerId}' AND "carts"."providerServiceId" = "ProviderServiceView"."providerServiceId" ORDER BY id DESC LIMIT 1)`), 'quantity'],
                    [literal(`(SELECT COUNT(*) FROM "provider_service_cat_rel_view" AS psv WHERE psv."userId" = "ProviderServiceView"."userId")`), 'totalServices']
                ],
                distinct: true,
                order: [
                    ["distance", "ASC"]
                ]
            });
        } catch (err) {
            throw new Error(err);
        }
    },
    getFilteredDataByCoordinates: async (filters) => {
        try {
            let whereCond = {};
            // Add provider condition
            if (filters.providerId) {
                whereCond.userId = filters.providerId;
            }

            // Add subcategory condition
            if (filters.subCategory) {
                whereCond.subCatId = filters.subCategory;
            }

            // Add rating condition
            if (filters.rating) {
                // whereCond.rating = {
                //     [Op.gte]: filters.rating // Assuming you want to filter providers with a rating greater than or equal to the given value
                // };
            }

            // Add price condition
            // if (filters.price) {
            //     whereCond.price = {
            //         [Op.lte]: filters.price // Assuming you're filtering for services with a price lower than or equal to the given value
            //     };
            // }
            if (filters.latitude && filters.longitude) {
                whereCond = {
                    [Op.and]: [
                        where(fn('ST_Y', col('coordinates')), '<', 90.0),
                        where(fn('ST_Y', col('coordinates')), '>', 0.0),
                        where(
                            fn(
                                'ST_Distance',
                                fn('ST_Transform', col('coordinates'), 3857),
                                fn(
                                    'ST_Transform',
                                    fn('ST_SetSRID', fn('ST_MakePoint', filters.longitude, filters.latitude), 4326),
                                    3857
                                )
                            ),
                            {
                                [Op.lte]: limitKm * 1000, // 10 km converted to meters
                            }
                        )
                    ]
                }
            }

            return await db.ProviderServiceView.findAll({
                where: whereCond,

            });
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = BannerServices;