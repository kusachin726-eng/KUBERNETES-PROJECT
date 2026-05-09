const firebase = require("firebase-admin");
const db = require("../../data-access/sequelize/models");
const isProduction = process.env.NODE_ENV === "production";

// const firbaseConfig = await db.Settings.findOne({ where: { key: "firbase-config" }, raw: true });

// // Initialize the first Firebase app
// const customerApp = firebase.initializeApp({
//     credential: firebase.credential.cert(firbaseConfig),
// }, "customerApp");


// const providerApp = firebase.initializeApp({
//     credential: firebase.credential.cert(firbaseConfig),
// }, "crewApp");

// module.exports = {customerApp, providerApp}


let customerApp;
let providerApp;

const initializeFirebase = async () => {
    try {
        const firbaseConfig = await db.Settings.findOne({
            where: { slug: "firbase-config" },
            raw: true
        });

        if (!firbaseConfig) {
            throw new Error("Firebase config not found in DB");
        }

         const serviceAccount =
            typeof firbaseConfig.metaData === "string"
                ? JSON.parse(firbaseConfig.metaData)
                : firbaseConfig.metaData;


        if (!firebase.apps.length) {
            customerApp = firebase.initializeApp(
                {
                    credential: firebase.credential.cert(serviceAccount),
                },
                "customerApp"
            );

            providerApp = firebase.initializeApp(
                {
                    credential: firebase.credential.cert(serviceAccount),
                },
                "crewApp"
            );
        }
        console.log("Firebase initialized successfully");

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        process.exit(1); // stop server if firebase fails
    }
};

const getCustomerApp = () => {
    if (!customerApp) throw new Error("Firebase not initialized");
    return customerApp;
};

const getProviderApp = () => {
    if (!providerApp) throw new Error("Firebase not initialized");
    return providerApp;
};

module.exports = {
    initializeFirebase,
    getCustomerApp,
    getProviderApp
};
