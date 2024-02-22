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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWallpaper = void 0;
const child_process_1 = require("child_process");
const os = require('os');
function setWallpaper(image) {
    if (isWindows()) {
    }
    else if (isGNOME()) {
        setGnomWallpaper(image);
        return;
    }
    else {
        console.log('Unsupported operating system.');
    }
}
exports.setWallpaper = setWallpaper;
function isWindows() {
    return os.platform() === 'win32';
}
function isGNOME() {
    return os.platform() === 'linux' && process.env.XDG_CURRENT_DESKTOP && process.env.XDG_CURRENT_DESKTOP.toLowerCase().includes('gnome');
}
function setGnomWallpaper(filename) {
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
function setWindowsWallpaper(filename) {
    // Command to set desktop background using PowerShell
    const command = `powershell.exe -ExecutionPolicy Bypass -Command "Set-ItemProperty -path 'HKCU:\\Control Panel\\Desktop\\' -name Wallpaper -value '${filename}'; rundll32.exe user32.dll, UpdatePerUserSystemParameters"`;
    // Execute the command
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error setting desktop background: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Command error: ${stderr}`);
            return;
        }
        console.log(`Desktop background set to ${filename}`);
    });
}
