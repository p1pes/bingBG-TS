import { exec } from 'child_process';
import { platform } from 'os';
import { join } from 'path';


export function setWallpaper(image: string){
    if (isWindows()) {
        setWindowsWallpaper(image);
        return;
    }
    else if (isGNOME()) {
        setGnomWallpaper(image); 
        return;
    }
    else {
        console.log('Unsupported operating system.');
    }
}

function isWindows() {
    return platform() === 'win32';
}

function isGNOME() {
    return platform() === 'linux' && process.env.XDG_CURRENT_DESKTOP && process.env.XDG_CURRENT_DESKTOP.toLowerCase().includes('gnome');
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
async function setWindowsWallpaper(imagePath: string) {
    const psScriptPath = join(__dirname, 'SetWall.ps1');  
    const command = `powershell.exe -ExecutionPolicy Bypass -File "${psScriptPath}" "${imagePath}"`;
    //console.log(command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error setting wallpaper:', error);
        } else {
            console.log('Wallpaper set successfully!');
        }
    });
}
