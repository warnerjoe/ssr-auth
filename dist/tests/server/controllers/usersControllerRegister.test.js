"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../../src/server/models/User"));
const usersController_1 = require("../../../src/server/controllers/usersController");
const tokenUtils = __importStar(require("../../../src/server/utils/tokenUtils"));
const testHelpers_1 = require("../helpers/testHelpers");
const testConstants_1 = require("../helpers/testConstants");
const usersControllerMock_1 = require("../mocks/usersControllerMock");
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockedToken'),
}));
jest.mock('../../../src/server/models/User');
jest.mock('bcryptjs');
beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
    (0, usersControllerMock_1.mockUserCreate)(User_1.default, bcryptjs_1.default);
});
describe("POST /register", () => {
    describe("Success", () => {
        beforeEach(() => {
            jest.spyOn(tokenUtils, 'createToken').mockReturnValue('mockedToken');
        });
        test("Creates a new user with valid email & password", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            expect(User_1.default.findOne).toHaveBeenCalledWith({ email: testConstants_1.mockEmail });
            (0, testHelpers_1.expectPasswordHashCalled)();
            (0, testHelpers_1.expectSuccessfulRegisterRes)(res);
        });
        test("Generates a valid JWT token for new user and 200 status for successful registration", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            (0, testHelpers_1.expectSuccessfulRegisterRes)(res);
        });
        test("Ensures bcrypt salt and hash functions are called correctly", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            (0, testHelpers_1.expectPasswordHashCalled)();
        });
        test("Returns valid JWT token and email after successful registration", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            (0, testHelpers_1.expectSuccessfulRegisterRes)(res);
        });
        test("Ensures next() is not called on successful registration", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            const next = jest.fn();
            await (0, usersController_1.registerUser)(req, res, next);
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe("Missing Fields", () => {
        const cases = [
            { name: "missing email", body: { password: testConstants_1.mockPassword } },
            { name: "missing password", body: { email: testConstants_1.mockEmail } },
            { name: "missing both fields", body: {} },
        ];
        test.each(cases)("Returns 400 when $name", async ({ body }) => {
            const { req, res } = (0, testHelpers_1.buildReqRes)(body);
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.registerUser, req, res, 400, "All fields are required.");
        });
    });
    describe("Email already exists", () => {
        test("Returns 400 status if user with email already exists", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            (0, usersControllerMock_1.mockEmailAlreadyExists)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            expect(res.status).toHaveBeenCalledWith(400);
        });
        test("Returns error message if email is already in use", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            (0, usersControllerMock_1.mockEmailAlreadyExists)();
            await (0, usersController_1.registerUser)(req, res, jest.fn());
            expect(res.json).toHaveBeenCalledWith({ error: "Email is already in use" });
        });
    });
    describe("Error handling", () => {
        test("Returns 500 status and error message for database failures", async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            User_1.default.create.mockRejectedValue(new Error("Database error"));
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.registerUser, req, res, 500, "Database error");
        });
        test('Handles createToken failure during registration', async () => {
            const { req, res } = (0, testHelpers_1.buildValidReqRes)();
            jest.spyOn(tokenUtils, 'createToken').mockImplementation(() => {
                throw new Error('JWT failed');
            });
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.registerUser, req, res, 500, "JWT failed");
        });
    });
});
