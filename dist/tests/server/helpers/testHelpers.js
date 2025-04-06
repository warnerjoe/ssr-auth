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
exports.createMockedToken = exports.expectPasswordHashCalled = exports.expectSuccessfulRegisterRes = exports.expectErrorResponse = exports.buildValidReqRes = exports.buildReqRes = void 0;
const jest_mock_req_res_1 = require("jest-mock-req-res");
const tokenUtils = __importStar(require("../../../src/server/utils/tokenUtils"));
const testConstants_1 = require("../helpers/testConstants");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Helper function to take the body in, and return the request and response
const buildReqRes = (body = {}) => {
    const req = (0, jest_mock_req_res_1.mockRequest)({ body });
    const res = (0, jest_mock_req_res_1.mockResponse)();
    return { req, res };
};
exports.buildReqRes = buildReqRes;
const buildValidReqRes = () => (0, exports.buildReqRes)({ email: testConstants_1.mockEmail, password: testConstants_1.mockPassword });
exports.buildValidReqRes = buildValidReqRes;
// Helper function to test a (controller, req, res, status, message) and return an error.
const expectErrorResponse = async (controller, req, res, expectedStatus, expectedMessage) => {
    await Promise.resolve(controller(req, res, jest.fn()));
    expect(res.status).toHaveBeenCalledWith(expectedStatus);
    expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
};
exports.expectErrorResponse = expectErrorResponse;
const expectSuccessfulRegisterRes = (res) => {
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        email: testConstants_1.mockEmail,
        token: "mockedToken"
    });
};
exports.expectSuccessfulRegisterRes = expectSuccessfulRegisterRes;
const expectPasswordHashCalled = () => {
    expect(bcryptjs_1.default.genSalt).toHaveBeenCalled();
    expect(bcryptjs_1.default.hash).toHaveBeenCalledWith(testConstants_1.mockPassword, "salt");
};
exports.expectPasswordHashCalled = expectPasswordHashCalled;
// Helper function for creating mock JWT tokens
const createMockedToken = (id) => {
    return tokenUtils.createToken(id);
};
exports.createMockedToken = createMockedToken;
