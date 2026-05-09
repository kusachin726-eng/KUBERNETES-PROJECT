const puppeteer = require("puppeteer");
const fs = require("fs");
const { uploadPDFOnAWS } = require("./s3bucketImg");

const createPDFAndUploadOnS3 = async (htmlContent, tempFilePath, filename, directoryName) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser", // Adjust if needed
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        await page.pdf({ path: tempFilePath, format: "A4" });
        await browser.close();

        const fileContent = fs.readFileSync(tempFilePath);
        const params = {
            Key: `${directoryName}`,
            Body: fileContent,
            filename
        };
        const uploadResult = await uploadPDFOnAWS(params);

        fs.unlinkSync(tempFilePath);

        return uploadResult;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = createPDFAndUploadOnS3;