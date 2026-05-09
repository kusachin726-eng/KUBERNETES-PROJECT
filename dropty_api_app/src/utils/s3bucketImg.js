require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const generateSlug = require('./createSlug');
const sharp = require('sharp');


// AWS S3 Configuration
const s3 = new S3Client({
    region: process.env.REGION,
    endpoint: `https://s3.${process.env.REGION}.amazonaws.com`,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

const uploadBase64Image = async (base64Image, folder) => {
    const base64Data = new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = base64Image.split(';')[0].split('/')[1];
    const timestamp = new Date().getTime();
    const fullName = `${timestamp}.${type}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${fullName}`,
        Body: base64Data,
        ContentType: `image/${type}`
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Construct the URL for the uploaded image
        const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${folder}/${fullName}`;

        return imageUrl;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const s3Upload = async (buffer, folder, filename, mimetype) => {
    
    try{
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${folder}/${filename}`,
            Body: buffer, // Use the buffer to upload the file
            ContentType: mimetype
        };
        
        const command = new PutObjectCommand(params);
        
        await s3.send(command);
        return true;
    }catch(error){
        console.error(error);
        return false;
    }    
};

const uploadImage = async (file, folder) => {
    try {
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const imageBuffer = file.buffer;
        const imageType = file.mimetype;
        
        let sizes = [
            { name: 'sm', width: parseInt(process.env.IMAGE_SIZE_SM), height: parseInt(process.env.IMAGE_SIZE_SM) },
            { name: 'md', width: parseInt(process.env.IMAGE_SIZE_MD), height: parseInt(process.env.IMAGE_SIZE_MD) },
            { name: 'lg', width: parseInt(process.env.IMAGE_SIZE_LG), height: parseInt(process.env.IMAGE_SIZE_LG) },
        ];
        const fileName = file.originalname;
        const lastDotIndex = fileName.lastIndexOf('.');
        let fileExtension = fileName.substring(lastDotIndex + 1);
        let fileWithoutExtension;

        if (lastDotIndex !== -1) {
            fileWithoutExtension = fileName.substring(0, lastDotIndex);
            fileExtension = fileName.substring(lastDotIndex + 1);
        }

        const timestamp = new Date().getTime();
        const fullName = fileWithoutExtension != null ? `${await generateSlug(fileWithoutExtension)}-${timestamp}.${fileExtension}` : `${timestamp}.${fileExtension}`;
        const notComressFolders = [
            'banner/home/slider',
            'booking-payment',
            'expert-wallet'
        ];
        if(notComressFolders.includes(folder)){
            const uploadResult = await s3Upload(
                file.buffer,
                (process.env.NODE_ENV === 'development') ? `staging/${folder}` : `live/${folder}`,
                fullName,
                imageType
            );
            return uploadResult ? {
                imageBaseUrl: process.env.S3_BUCKET_URL,
                imageDirectory: (process.env.NODE_ENV === 'development') ? `staging/${folder}/` : `live/${folder}/`,
                imageName: fullName,
            } : null;
        }
        // Loop through sizes, resize and upload each
        const uploadPromises = sizes.map(async (size) => {
            let resizedImage=null;
            if(folder==="kyc"){
                resizedImage = await sharp(imageBuffer)
                .toBuffer();
            }else{
                resizedImage = await sharp(imageBuffer)
                .resize(size.width, size.height)
                .toBuffer();
            }

            const uploadResult = await s3Upload(
                resizedImage,
                (process.env.NODE_ENV === 'development') ? `staging/${folder}/${size.name}` : `live/${folder}/${size.name}`,
                fullName,
                imageType
            );
            return uploadResult;
        });   
        let countTrueStatus = await Promise.all(uploadPromises);
        countTrueStatus = countTrueStatus.filter(Boolean).length;
        if(countTrueStatus !== sizes.length){
            return null;
        }
        return {            
            imageBaseUrl: process.env.S3_BUCKET_URL,
            imageDirectory: (process.env.NODE_ENV === 'development') ? `staging/${folder}/` : `live/${folder}/`,
            imageSubDirectory: "sm, md, lg",
            imageName: fullName,

        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

const uploadPDFOnAWS = async (paramsData) => {
    try {
        const folder = (process.env.NODE_ENV === 'development') ? 'staging' : 'live';
        const fullName = paramsData.filename;         
        const upload = await s3Upload(
            paramsData.Body, 
            `${folder}/${paramsData.Key}`, 
            fullName, 
            'application/pdf'
        )        
            
        if (upload) {
            return {
                imageBaseUrl: process.env.S3_BUCKET_URL,
                imageDirectory: `${folder}/${paramsData.Key}`,
                imageName: fullName,
            };
        } else {
            return null;
        }
    } catch (error) { 
        console.error("Error uploading to S3:", error);
        return null;
    }
};

module.exports = { uploadImage, uploadBase64Image, uploadPDFOnAWS };