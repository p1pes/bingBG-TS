"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const setBackground_1 = require("./lib/setBackground");
const server = http_1.default.createServer((req, res) => {
    // Set the response HTTP header with HTTP status and Content type
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // Send the response body "Hello, world!"
    res.end('Hello, world!\n');
    (0, setBackground_1.main)('0');
    //main(process.argv[2]);
});
// Listen on port 5040
server.listen(5040, () => {
    console.log('Server running at http://localhost:5040/');
});
