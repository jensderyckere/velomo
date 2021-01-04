import { default as mongoose, Connection } from "mongoose";

import { IConfig } from "../config";

export default class Mongo {
    private config: IConfig;
    private db: Connection;

    constructor(config: IConfig) {
        this.config = config;
    };

    public connect(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            mongoose.connect(this.config.dbConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true,
            })
            .then(() => {
                this.db = mongoose.connection;
                console.log('Connected to MongoDB');
                resolve(true);
            })
            .catch((e) => {
                console.log('Can not connect to MongoDB');
                reject(e);
            });
        });
    };

    public disconnect(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.db.close(true)
            .then(() => {
                console.log('Disconnected to MongoDB');
                resolve(true);
            })
            .catch((e) => {
                console.log('Can not disconnect to MongoDB');
                reject(e);
            });
        })
    };
};