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

export function main(num: number){
    console.log(file);
    return 1+num;
}