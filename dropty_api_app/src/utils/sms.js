const { logger } = require("../config/logger");

class SmsService {
    constructor({ analyticService } = {}) {
        this.analyticService = analyticService;
        this.logger = logger;
    }

    async sendSMS(recipients, templateId) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authkey: process.env.MSG91_AUTH_KEY
                },
                body: JSON.stringify({
                    template_id: templateId,
                    short_url: '0',
                    recipients: recipients
                })
            };

            const smsres = await fetch(process.env.MSG91_BASE_URL, options);
            this.logger.info('sms send successfully');
            return smsres;
        } catch (error) {
            this.logger.error('sms send error', error);
            throw error;
        }
    }
}


module.exports = new SmsService();