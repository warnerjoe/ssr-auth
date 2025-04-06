"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("../../src/server/app"));
jest.mock("../../src/server/routes/usersRoutes", () => {
    const router = express_1.default.Router();
    router.get("/", (req, res) => {
        res.status(200).send("Mocked Users Route");
    });
    router.post("/", (req, res) => {
        res.status(201).send("User Created");
    });
    return router;
});
describe("App Initialization", () => {
    test("JSON body is processed correctly", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/users")
            .send({ test: "data" })
            .set("Content-Type", "application/json");
        expect(response.status).not.toBe(500);
    });
    test("URL-encoded body is processed correctly", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/users")
            .send("test=data")
            .set("Content-Type", "application/x-www-form-urlencoded");
        expect(response.status).not.toBe(500);
    });
    test("Handles GET requests to /api/users correctly", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/users");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Mocked Users Route");
    });
    test("Returns 404 for unknown routes", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/unknown-route");
        expect(response.status).toBe(404);
    });
});
