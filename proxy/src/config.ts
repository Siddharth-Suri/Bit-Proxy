import fs from 'fs';

const path = "../config/proxy.json"

function loadConfig():JSON {
    const parsed = JSON.parse(fs.readFileSync(path,"utf-8"));
    return parsed
}