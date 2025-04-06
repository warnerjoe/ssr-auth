"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockEmailAlreadyExists = exports.mockLoginSetup = exports.mockPasswordMatch = exports.mockUserFound = exports.mockSuccessfulLogin = exports.mockUserCreate = exports.mockUsersController = exports.loginUserMock = exports.registerUserMock = void 0;
const User_1 = __importDefault(require("../../../src/server/models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const testConstants_1 = require("../helpers/testConstants");
const testHelpers_1 = require("../helpers/testHelpers");
exports.registerUserMock = jest.fn((req, res) => res.status(200).json({ message: 'Mocked registerUser' }));
exports.loginUserMock = jest.fn((req, res) => res.status(200).json({ message: 'Mocked loginUser' }));
exports.mockUsersController = {
    registerUser: exports.registerUserMock,
    loginUser: exports.loginUserMock,
};
const mockUserCreate = (User, bcrypt, email = 'test@example.com', password = 'SecurePassword123!') => {
    User.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue(testConstants_1.mockHashedPassword);
    User.create.mockResolvedValue({ _id: testConstants_1.mockId, email });
};
exports.mockUserCreate = mockUserCreate;
const mockSuccessfulLogin = () => {
    User_1.default.findOne.mockResolvedValue(testConstants_1.mockUser);
    bcryptjs_1.default.compare.mockResolvedValue(true);
};
exports.mockSuccessfulLogin = mockSuccessfulLogin;
const mockUserFound = (user) => {
    User_1.default.findOne.mockResolvedValue(user);
};
exports.mockUserFound = mockUserFound;
const mockPasswordMatch = (match) => {
    bcryptjs_1.default.compare.mockResolvedValue(match);
};
exports.mockPasswordMatch = mockPasswordMatch;
const mockLoginSetup = (email, password, user) => {
    const { req, res } = (0, testHelpers_1.buildReqRes)({ email, password });
    const mockUser = user || (email ? { _id: testConstants_1.mockId, email, password: testConstants_1.mockHashedPassword } : null);
    if (mockUser) {
        (0, exports.mockUserFound)(mockUser);
    }
    if (email && password) {
        (0, exports.mockPasswordMatch)(true);
    }
    return { req, res };
};
exports.mockLoginSetup = mockLoginSetup;
const mockEmailAlreadyExists = () => {
    User_1.default.findOne.mockResolvedValue({ email: testConstants_1.mockEmail });
};
exports.mockEmailAlreadyExists = mockEmailAlreadyExists;
