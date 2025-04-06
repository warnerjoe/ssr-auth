"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../src/server/server");
const app_1 = __importDefault(require("../../src/server/app"));
const mongoose_1 = __importDefault(require("mongoose"));
jest.mock("mongoose");
test("Should start the server and connect to DB without crashing", async () => {
    const mockServer = {};
    const connectMock = mongoose_1.default.connect;
    connectMock.mockResolvedValueOnce({});
    const mockListen = jest
        .spyOn(app_1.default, "listen")
        .mockImplementation(() => {
        console.log("Mock server started");
        return mockServer;
    });
    await (0, server_1.startServer)();
    expect(mongoose_1.default.connect).toHaveBeenCalled();
    expect(mockListen).toHaveBeenCalled();
    mockListen.mockRestore();
});
afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});
