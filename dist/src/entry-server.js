"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const App_1 = __importDefault(require("./App"));
function render() {
    const appHtml = server_1.default.renderToString(react_1.default.createElement(App_1.default, null));
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Sentomment</title>
        <script type="module" src="/src/main.js"></script>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `;
    return html;
}
