module.exports = {
    apps: [
      {
        name: "dropty", // Give your app a name
        script: "./src", // Entry point of your application
        instances: "max", // Or a number to load balance across CPU cores
        env: {
          // Environment variables for the app
          NODE_ENV: "development",
        },
      },
    ],
  };