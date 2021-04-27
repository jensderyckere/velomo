"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Mongo {
    constructor(config) {
        this.config = config;
    }
    ;
    connect() {
        return new Promise((resolve, reject) => {
            mongoose_1.default.connect(this.config.dbConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true,
            })
                .then(() => {
                this.db = mongoose_1.default.connection;
                console.log('Connected to MongoDB');
                resolve(true);
            })
                .catch((e) => {
                console.log('Can not connect to MongoDB');
                reject(e);
            });
        });
    }
    ;
    disconnect() {
        return new Promise((resolve, reject) => {
            this.db.close(true)
                .then(() => {
                console.log('Disconnected to MongoDB');
                resolve(true);
            })
                .catch((e) => {
                console.log('Can not disconnect to MongoDB');
                reject(e);
            });
        });
    }
    ;
}
exports.default = Mongo;
;
//# sourceMappingURL=Mongo.js.map