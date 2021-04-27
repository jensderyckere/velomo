"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const services_1 = require("./app/services");
(async () => {
    const config = new services_1.Config();
    try {
        // Initialize mongoDB
        const mongo = new services_1.Mongo(config);
        await mongo.connect();
        // Initialize image storage
        services_1.Storage.initStream('uploads');
        // Initialize express
        const app = new app_1.App(config);
        app.startServer();
        const stop = async () => {
            app.stopServer();
            await mongo.disconnect();
        };
        process.on('SIGINT', () => stop());
        process.on('SIGTERM', () => stop());
    }
    catch (e) {
        console.log(e);
    }
    ;
})();
//# sourceMappingURL=index.js.map