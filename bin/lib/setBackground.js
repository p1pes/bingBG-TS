"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.main = main;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const setWallpaper_1 = require("./setWallpaper");
const utils_1 = require("./utils");
const date_fns_1 = require("date-fns");
const path = __importStar(require("path"));
const urlprefix = "https://www.bing.com";
const url = `${urlprefix}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-UK`;
const settings = { method: "get" };
const homeDirectory = os_1.default.homedir();
const imgDir = `${homeDirectory}/Pictures/bingBG/`;
function main(type) {
    return __awaiter(this, void 0, void 0, function* () {
        //just check if need to download any new images.    
        const json = yield getJson();
        for (let i = 0; i < json.images.length; i++) {
            let imageUrl = urlprefix + json.images[i].url;
            let filename = imgDir + (0, utils_1.camelCase)(json.images[i].title) + ".jpeg";
            yield downloadImage(imageUrl, filename);
        }
        yield updateWallpaper(type !== null && type !== void 0 ? type : "0");
    });
}
function updateWallpaper(action) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield getJson();
        //default today
        let filename = (0, utils_1.camelCase)(json.images[0].title) + ".jpeg";
        //if number set background to number from last 8 days.
        if (!isNaN(parseFloat(action))) {
            filename = (0, utils_1.camelCase)(json.images[parseFloat(action) < 8 ? parseFloat(action) : 0].title) + ".jpeg";
            (0, setWallpaper_1.setWallpaper)(imgDir + filename);
            return;
        }
        switch (action.toLowerCase()) {
            case "random":
                filename = getRandomImage() + "";
                break;
        }
        (0, setWallpaper_1.setWallpaper)(imgDir + filename);
        // Check if the string is a valid number or less than 8. if it is, set to 0
        //const imgNum = !isNaN(parseFloat(type)) ? parseFloat(type) < 8 ? parseFloat(type) : 0 : 0;
        //await setWallpaper(file+camelCase(json.images[imgNum??0].title)+".jpeg");
    });
}
function getJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheFileName = getCacheFileName();
        if (!fs_1.default.existsSync(cacheFileName) || isStaleCache(cacheFileName)) {
            console.log('Cached JSON file not found or stale. Downloading fresh copy...');
            try {
                const response = yield axios_1.default.get(url, settings);
                fs_1.default.writeFileSync(cacheFileName, JSON.stringify(response.data));
            }
            catch (error) {
                console.log(error);
            }
        }
        return JSON.parse(fs_1.default.readFileSync(cacheFileName, 'utf-8'));
    });
}
function downloadImage(imageUrl, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //make dir if not exist
            fs_1.default.promises.mkdir(imgDir, { recursive: true }).catch(console.error);
            const existsLocally = yield (0, utils_1.fileExistsLocally)(filename);
            if (existsLocally) {
                //console.log('already downloaded', filename);
                //already have this file, so just return
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
// Function to generate a filename with the current date
function getCacheFileName() {
    const currentDate = (0, date_fns_1.format)(new Date(), 'yyyyMMdd');
    return `data_${currentDate}.json`;
}
// Function to check if the cached file is stale (older than 24 hours)
function isStaleCache(cacheFileName) {
    const stats = fs_1.default.statSync(cacheFileName);
    const currentTime = new Date().getTime();
    const fileModificationTime = stats.mtime.getTime();
    // Check if the file is older than 24 hours
    return currentTime - fileModificationTime > 24 * 60 * 60 * 1000;
}
function getRandomImage() {
    // Read the contents of the directory
    try {
        const files = fs_1.default.readdirSync(imgDir);
        // Filter out directories, if any
        const fileNames = files.filter(file => fs_1.default.statSync(path.join(imgDir, file)).isFile());
        // Check if there are any files in the directory
        if (fileNames.length === 0) {
            console.error('No files found in the directory.');
            return null;
        }
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * fileNames.length);
        // Return the randomly selected filename
        return fileNames[randomIndex];
    }
    catch (error) {
        console.error('Error reading directory:', error);
        return null;
    }
}
