import {
    App
} from "./app";

import {
    IConfig,
    Config,
    Mongo,
    Storage
} from "./app/services";

(async () => {
    const config: IConfig = new Config();

    try {
        // Initialize mongoDB
        const mongo = new Mongo(config);
        await mongo.connect();

        // Initialize image storage
        Storage.initStream('uploads');

        // Initialize express
        const app: App = new App(config);
        app.startServer();

        const stop = async () => {
            app.stopServer();
            await mongo.disconnect();
        };

        process.on('SIGINT', () => stop());
        process.on('SIGTERM', () => stop());
    } catch (e) {
        console.log(e);
    };
})();