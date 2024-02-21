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
exports.main = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const utils_1 = require("./utils");
const urlprefix = "https://www.bing.com";
const url = `${urlprefix}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-UK`;
const settings = { method: "get" };
const homeDirectory = os_1.default.homedir();
const file = `${homeDirectory}/Pictures/bingBG/`;
function main(days) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the string is a valid number or less than 8. if it is, set to 0
        const imgNum = !isNaN(parseFloat(days)) ? parseFloat(days) < 8 ? parseFloat(days) : 0 : 0;
        const json = yield getJson();
        for (let i = 0; i < json.images.length; i++) {
            let imageUrl = urlprefix + json.images[i].url;
            let filename = file + (0, utils_1.camelCase)(json.images[i].title) + ".jpeg";
            yield downloadImage(imageUrl, filename);
        }
        //set latest as background
        yield setWallpaper(file + (0, utils_1.camelCase)(json.images[imgNum !== null && imgNum !== void 0 ? imgNum : 0].title) + ".jpeg");
    });
}
exports.main = main;
function getJson() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url, settings);
            return response.data;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function setWallpaper(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = `gsettings set org.gnome.desktop.background picture-uri-dark file://${filename}`;
        //console.log(command);
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error setting wallpaper: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`gsettings stderr: ${stderr}`);
                return;
            }
            console.log(`Wallpaper set successfully: ${filename}`);
        });
    });
}
function downloadImage(imageUrl, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //make dir if not exist
            fs_1.default.promises.mkdir(file, { recursive: true }).catch(console.error);
            const existsLocally = yield (0, utils_1.fileExistsLocally)(filename);
            if (existsLocally) {
                //console.log('already downloaded', filename);
                return;
            }
            const response = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
            yield fs_1.default.promises.writeFile(filename, Buffer.from(response.data, 'binary'));
            console.log('New Image/s downloaded successfully:', filename);
        }
        catch (error) {
            console.error('Error downloading image:', error);
        }
    });
}
