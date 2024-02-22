import { exec } from 'child_process';
const os = require('os');

export function setWallpaper(image: string){
    console.log(os.platform());
    console.log(process.env.XDG_CURRENT_DESKTOP);
}

async function setGnomWallpaper(filename: string){
    const command = `gsettings set org.gnome.desktop.background picture-uri-dark file://${filename}`;    
    //console.log(command);
    exec(command, (error, stdout, stderr) => {
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
}

function setWindowsWallpaper(filename: string) {
    // Command to set desktop background using PowerShell
    const command = `powershell.exe -ExecutionPolicy Bypass -Command "Set-ItemProperty -path 'HKCU:\\Control Panel\\Desktop\\' -name Wallpaper -value '${filename}'; rundll32.exe user32.dll, UpdatePerUserSystemParameters"`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
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