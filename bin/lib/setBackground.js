"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const os_1 = __importDefault(require("os"));
const urlprefix = "https://www.bing.com";
const url = `${urlprefix}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-UK`;
const settings = { method: "get" };
const homeDirectory = os_1.default.homedir();
const file = `${homeDirectory}/Pictures/bingBG/`;
function main(num) {
    return 1 + num;
}
exports.main = main;
