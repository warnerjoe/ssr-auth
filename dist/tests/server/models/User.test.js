"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../src/server/models/User"));
describe("User Model - Valid User", () => {
    it("should save a valid user successfully", async () => {
        const validUser = new User_1.default({
            email: "test@example.com",
            password: "secret123",
        });
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe("test@example.com");
        expect(savedUser.createdAt).toBeDefined();
        expect(savedUser.updatedAt).toBeDefined();
    });
});
