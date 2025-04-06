"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const App = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "LOOK AT ME I WAS RENDERED BY THE SERVER"),
        react_1.default.createElement("h2", null, "aight pay me"),
        react_1.default.createElement("p", null, "double j for world champ")));
};
exports.default = App;
