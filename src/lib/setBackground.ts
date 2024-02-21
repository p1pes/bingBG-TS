import axios from 'axios';
import fs from 'fs';
import os, { homedir } from 'os';
import { exec } from 'child_process';
import { camelCase, fileExistsLocally } from './utils';

const urlprefix = "https://www.bing.com";
const url = `${urlprefix}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-UK`;
const settings = { method: "get" }
const homeDirectory = os.homedir();
const file = `${homeDirectory}/Pictures/bingBG/`;

export async function main(days: string){
// Check if the string is a valid number or less than 8. if it is, set to 0
const imgNum = !isNaN(parseFloat(days)) ? parseFloat(days) < 8 ? parseFloat(days) : 0 : 0;

    const json = await getJson();
    for (let i=0; i<json.images.length; i++) {
        let imageUrl = urlprefix + json.images[i].url;
        let filename = file+camelCase(json.images[i].title)+".jpeg";
        await downloadImage(imageUrl, filename);
    }
    //set latest as background
    await setWallpaper(file+camelCase(json.images[imgNum??0].title)+".jpeg");    
}

async function getJson(){
    try {
        const response = await axios.get(url, settings);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

async function setWallpaper(filename: string){
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


async function downloadImage(imageUrl: string, filename: string){
    try {
        //make dir if not exist
        fs.promises.mkdir(file, { recursive: true }).catch(console.error);
        const existsLocally = await fileExistsLocally(filename);
        if (existsLocally) {
            //console.log('already downloaded', filename);
            return;
        }
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.promises.writeFile(filename, Buffer.from(response.data, 'binary'));
        console.log('New Image/s downloaded successfully:', filename);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}    
