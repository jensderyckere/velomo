"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
class Router {
    constructor(config, app, auth) {
        this.config = config;
        this.app = app;
        this.auth = auth;
        this.apiRouter = new api_1.ApiRouter(this.config, this.auth);
        this.startRouting();
    }
    ;
    startRouting() {
        this.app.use('/velomo-api', this.apiRouter.router);
    }
    ;
}
exports.default = Router;
;
//# sourceMappingURL=Router.js.map