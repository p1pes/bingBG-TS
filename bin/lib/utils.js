"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = camelCase;
exports.fileExistsLocally = fileExistsLocally;
const fs_1 = __importDefault(require("fs"));
function camelCase(str) {
    str = str.replace(/[^a-zA-Z0-9\s]/g, '');
    return str.replace(/\s(.)/g, function (match, group) {
        return group.toUpperCase();
    });
}
function fileExistsLocally(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.access(filename); // Check if file exists
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
