const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Configure SES Client
const sesClient = new SESClient({
    region: process.env.AWS_SES_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Send email function
const sendEmail = async (options) => {
    const params = {
        Destination: {
            ToAddresses: [options.to], // Recipient email address
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: options.body, // HTML body of the email
                },
            },
            Subject: { Data: options.subject }, // Subject of the email
        },
        Source: options.from, // Sender's email address (must be verified in SES)
    };

    try {
        const command = new SendEmailCommand(params);
        const data = await sesClient.send(command);
        console.log("Email sent successfully:", data);
        return { success: true, message: 'Email sent', data };
    } catch (err) {
        console.error("Error sending email:", err);
        return { success: false, message: err.message };
    }
};

module.exports = sendEmail;