const imageUrl = async () => {
    const imageLinkDetails = {
        imageBaseUrl: `${process.env.S3_BUCKET_URL}`,
        imageDirectory: (process.env.NODE_ENV === 'development') ? `staging/` : `live/`,
        directories: [
            'profile',
            'service',
            'category',
            'subcategory',
            'banner',
            'storefront-logo',
            'storefront-banner',
            'storefront-gallery',
        ],
        imageSubDirectory: "sm, md, lg",
        example: "{imageBaseUrl(https://aws.in)}/{imageDirectory(staging)}/{directories(service)}/{imageSubDirectory(md)}/{imageName}"
    }
    return imageLinkDetails;
}

module.exports = imageUrl;