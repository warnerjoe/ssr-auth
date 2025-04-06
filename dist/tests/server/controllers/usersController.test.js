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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../../src/server/models/User"));
const tokenUtils = __importStar(require("../../../src/server/utils/tokenUtils"));
const usersControllerMock_1 = require("../mocks/usersControllerMock");
const testConstants_1 = require("../helpers/testConstants");
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
describe("JWT - Token creation logic", () => {
    describe("Success", () => {
        test("JWT creates token containing the correct payload (_id and expiration)", () => {
            tokenUtils.createToken(testConstants_1.mockId);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ _id: testConstants_1.mockId }, testConstants_1.jwtSecret, { expiresIn: '10d' });
            const signCall = jsonwebtoken_1.default.sign.mock.calls[0];
            const payload = signCall[0];
            const options = signCall[2];
            expect(payload).toEqual({ _id: testConstants_1.mockId });
            expect(options).toHaveProperty('expiresIn', '10d');
        });
    });
    describe("Failure", () => {
        test("Handles jwt.sign throwing an error gracefully", () => {
            const mockError = new Error('JWT failed');
            jsonwebtoken_1.default.sign.mockImplementation(() => {
                throw mockError;
            });
            expect(() => tokenUtils.createToken(testConstants_1.mockId)).toThrow('JWT failed');
        });
    });
});
