"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const usersControllerMock_1 = require("../mocks/usersControllerMock");
jest.mock('../../../src/server/controllers/usersController', () => usersControllerMock_1.mockUsersController);
const usersRoutes_1 = __importDefault(require("../../../src/server/routes/usersRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', usersRoutes_1.default);
beforeEach(() => {
    jest.clearAllMocks();
});
describe("Users Routes", () => {
    test("POST /register calls registerUser controller", async () => {
        await (0, supertest_1.default)(app)
            .post('/api/users/register')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200);
        expect(usersControllerMock_1.registerUserMock).toHaveBeenCalled();
    });
    test("POST /login calls loginUser controller", async () => {
        await (0, supertest_1.default)(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(200);
        expect(usersControllerMock_1.loginUserMock).toHaveBeenCalled();
    });
    test("Handles unknown routes with appropriate error", async () => {
        await (0, supertest_1.default)(app)
            .post('/api/users/unknown')
            .expect(404);
    });
});
