// const {customerApp, providerApp} = require('../../../config/firebase/index')
const { getCustomerApp, getProviderApp } = require('../../../config/firebase');


const sendPushNotification =  async (message,  receiverUserType) => {

    try {
        let app;
        if(receiverUserType == "CUSTOMER"){
            app = getCustomerApp();
        }else{
            app = getProviderApp();
        }
        if (!app) {
                throw new Error("Firebase app not initialized");
            }

        return await app.messaging().send(message);

    } catch(err) {
        console.log("Push Error:", err);
        throw err; 
    }
    
}



module.exports = sendPushNotification