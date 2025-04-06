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
const usersControllerMock_1 = require("../mocks/usersControllerMock");
const testConstants_1 = require("../helpers/testConstants");
let req, res;
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
    jest.spyOn(tokenUtils, 'createToken').mockReturnValue('mockedToken');
    const { req: mockReq, res: mockRes } = (0, usersControllerMock_1.mockLoginSetup)(testConstants_1.mockEmail, testConstants_1.mockPassword);
    req = mockReq;
    res = mockRes;
});
describe("POST /login", () => {
    describe("Success", () => {
        test("Returns 200 status when valid email and password are provided", async () => {
            await (0, usersController_1.loginUser)(req, res, jest.fn());
            expect(res.status).toHaveBeenCalledWith(200);
        });
        test("Returns valid JWT token and email after successful login", async () => {
            await (0, usersController_1.loginUser)(req, res, jest.fn());
            expect(res.json).toHaveBeenCalledWith({
                email: testConstants_1.mockEmail,
                token: 'mockedToken',
            });
        });
    });
    describe("Incorrect Email", () => {
        test("Returns 400 status and 'incorrect email' error message if email is not found", async () => {
            const { req, res } = (0, usersControllerMock_1.mockLoginSetup)('otherEmail@email.com', testConstants_1.mockPassword);
            (0, usersControllerMock_1.mockUserFound)(null);
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.loginUser, req, res, 400, "Incorrect email");
        });
    });
    describe("Incorrect Password", () => {
        test("Returns 'Incorrect password'  error message and 400 status if password does not match", async () => {
            const { req, res } = (0, usersControllerMock_1.mockLoginSetup)(testConstants_1.mockEmail, 'WrongPassword123!', testConstants_1.mockUser);
            (0, usersControllerMock_1.mockPasswordMatch)(false);
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.loginUser, req, res, 400, "Incorrect password");
        });
    });
    describe("Missing Fields", () => {
        const cases = [
            { name: "email is missing", password: testConstants_1.mockPassword },
            { name: "password is missing", email: testConstants_1.mockEmail },
            { name: "all fields are missing" },
        ];
        test.each(cases)("Returns error message when $name", async ({ email, password }) => {
            const { req, res } = (0, usersControllerMock_1.mockLoginSetup)(email, password);
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.loginUser, req, res, 400, "All fields are required.");
        });
    });
    describe("Error Handling", () => {
        test("Returns 500 status and error message if JWT creation fails", async () => {
            jest.spyOn(tokenUtils, 'createToken').mockImplementation(() => {
                throw new Error('JWT failed');
            });
            await (0, testHelpers_1.expectErrorResponse)(usersController_1.loginUser, req, res, 500, "JWT failed");
        });
    });
});
