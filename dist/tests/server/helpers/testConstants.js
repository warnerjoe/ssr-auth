"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUser = exports.jwtSecret = exports.mockHashedPassword = exports.mockPassword = exports.mockEmail = exports.mockId = void 0;
exports.mockId = '12345';
exports.mockEmail = 'test@example.com';
exports.mockPassword = 'SecurePassword123!';
exports.mockHashedPassword = 'hashedPassword';
process.env.JWT_SECRET = "testsecret";
exports.jwtSecret = process.env.JWT_SECRET;
exports.mockUser = {
    _id: exports.mockId,
    email: exports.mockEmail,
    password: exports.mockHashedPassword,
};
