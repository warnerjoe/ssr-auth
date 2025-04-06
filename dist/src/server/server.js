"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const entry_server_1 = require("../entry-server");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, 'config/.env') });
app_1.default.use(express_1.default.json());
app_1.default.use(express_1.default.static(path_1.default.resolve(__dirname, 'dist')));
app_1.default.all('*', (req, res) => {
    try {
        const html = (0, entry_server_1.render)();
        res.send(html);
    }
    catch (error) {
        console.error('SSR Rendering Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
const startServer = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, { dbName: "dev_db" });
        console.log("Database is connected and ");
        const server = app_1.default.listen(process.env.PORT, () => {
            console.log(`we online at port ${process.env.PORT}`);
        });
        return server;
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            console.error("Mongoose Error: ", error.message);
        }
        else if (error instanceof Error) {
            console.error("Error", error.message);
        }
        else {
            console.error("Unknown Error", error);
        }
        process.exit(1);
    }
};
exports.startServer = startServer;
if (process.env.NODE_ENV !== "test") {
    (0, exports.startServer)();
}
