import axios from 'axios';
import fs from 'fs';
import os, { homedir } from 'os';
import { setWallpaper } from './setWallpaper'
import { camelCase, fileExistsLocally } from './utils';
import { format } from 'date-fns';
import * as path from 'path';

const urlprefix = "https://www.bing.com";
const url = `${urlprefix}/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=en-UK`;
const settings = { method: "get" }
const homeDirectory = os.homedir();
const imgDir = `${homeDirectory}/Pictures/bingBG/`;

export async function main(type: string){
    //just check if need to download any new images.    
    const json = await getJson();
    for (let i=0; i<json.images.length; i++) {
        let imageUrl = urlprefix + json.images[i].url;
        let filename = imgDir+camelCase(json.images[i].title)+".jpeg";
        await downloadImage(imageUrl, filename);
    }
    await updateWallpaper(type??"0");
}

async function updateWallpaper(action: string){
    const json = await getJson();
    //default today
    let filename : string = camelCase(json.images[0].title)+".jpeg";
    //if number set background to number from last 8 days.
    if (!isNaN(parseFloat(action))) {
        filename = camelCase(json.images[parseFloat(action) < 8 ? parseFloat(action) : 0].title)+".jpeg";        
        setWallpaper(imgDir+filename);
        return;
    }
    switch (action.toLowerCase()) {
        case "random" : 
            filename = getRandomImage()+""; 
            break;        
    }
    setWallpaper(imgDir+filename);

// Check if the string is a valid number or less than 8. if it is, set to 0
//const imgNum = !isNaN(parseFloat(type)) ? parseFloat(type) < 8 ? parseFloat(type) : 0 : 0;
//await setWallpaper(file+camelCase(json.images[imgNum??0].title)+".jpeg");
}

async function getJson(){
    const cacheFileName = getCacheFileName();
    if (!fs.existsSync(cacheFileName) || isStaleCache(cacheFileName)) {
        console.log('Cached JSON file not found or stale. Downloading fresh copy...');
        try {        
            const response = await axios.get(url, settings);
            fs.writeFileSync(cacheFileName, JSON.stringify(response.data));
        } catch (error) {
            console.log(error);
        }
    }
    return JSON.parse(fs.readFileSync(cacheFileName, 'utf-8'));
}

async function downloadImage(imageUrl: string, filename: string){
    try {
        //make dir if not exist
        fs.promises.mkdir(imgDir, { recursive: true }).catch(console.error);
        const existsLocally = await fileExistsLocally(filename);
        if (existsLocally) {
            //console.log('already downloaded', filename);
            //already have this file, so just return
            return;
        }
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        await fs.promises.writeFile(filename, Buffer.from(response.data, 'binary'));
        console.log('New Image/s downloaded successfully:', filename);
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}

// Function to generate a filename with the current date
function getCacheFileName(): string {
    const currentDate = format(new Date(), 'yyyyMMdd');
    return `data_${currentDate}.json`;
}

// Function to check if the cached file is stale (older than 24 hours)
function isStaleCache(cacheFileName: string): boolean {
    const stats = fs.statSync(cacheFileName);
    const currentTime = new Date().getTime();
    const fileModificationTime = stats.mtime.getTime();
    // Check if the file is older than 24 hours
    return currentTime - fileModificationTime > 24 * 60 * 60 * 1000;
}


function getRandomImage(): string | null {
    // Read the contents of the directory
    try {
        const files = fs.readdirSync(imgDir);
        // Filter out directories, if any
        const fileNames = files.filter(file => fs.statSync(path.join(imgDir, file)).isFile());
        // Check if there are any files in the directory
        if (fileNames.length === 0) {
            console.error('No files found in the directory.');
            return null;
        }
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * fileNames.length);
        // Return the randomly selected filename
        return fileNames[randomIndex];
    } catch (error) {
        console.error('Error reading directory:', error);
        return null;
    }
}