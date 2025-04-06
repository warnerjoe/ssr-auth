"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenUtils_1 = require("../utils/tokenUtils");
require("dotenv/config.js");
/*************************** REGISTER USER ***************************/
const registerUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'All fields are required.' });
        return;
    }
    ;
    const exist = await User_1.default.findOne({ email });
    if (exist) {
        res.status(400).json({ error: 'Email is already in use' });
        return;
    }
    ;
    const salt = await bcryptjs_1.default.genSalt();
    const hashed = await bcryptjs_1.default.hash(password, salt);
    const sanitizedBody = { email, password: hashed };
    try {
        const user = await User_1.default.create(sanitizedBody);
        const token = (0, tokenUtils_1.createToken)(user._id.toString());
        res.status(200).json({ email, token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'JWT failed' });
        }
        ;
    }
    ;
};
exports.registerUser = registerUser;
/*************************** LOGIN USER ***************************/
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'All fields are required.' });
        return;
    }
    const user = await User_1.default.findOne({ email });
    if (!user) {
        res.status(400).json({ error: 'Incorrect email' });
        return;
    }
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        res.status(400).json({ error: 'Incorrect password' });
        return;
    }
    try {
        const token = (0, tokenUtils_1.createToken)(user._id.toString());
        res.status(200).json({ email, token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
};
exports.loginUser = loginUser;
