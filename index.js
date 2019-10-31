#!/usr/bin/env node

const fs = require("fs");
const { promisify } = require("util");

const fsAccess = promisify(fs.access);
const fsReadFile = promisify(fs.readFile);

const fields = process.argv.slice(2);
const filePath = `./package.json`;

const checkFile = async () => {
    let fileExists = false;

    try {
        await fsAccess(filePath);
        fileExists = true;
    } catch (e) {
        fileExists = false;
    } finally {
        return fileExists;
    }
};

const readJsonFile = async () => {
    const fileExists = await checkFile();
    if (fileExists) {
        try {
            const data = await fsReadFile(filePath, "utf8");
            return JSON.parse(data);
        } catch (e) {
            return "package.json could not be read.";
        }
    }
    return "package.json file does not exist.";
};

const jsonify = data => {
    if (Object.keys(data).length) {
        console.log(JSON.stringify(data, null, 4));
    } else {
        console.log(data);
    }
};

const prettyLog = (results, data) => {
    if (typeof data !== "object" || !Object.keys(data).length) {
        console.log("Could not read fields from package.json.");
    } else if (fields.length) jsonify(results);
    else {
        const { name, version, description } = data;
        jsonify({ name, version, description });
    }
};

const getFields = async () => {
    const results = {};
    const data = await readJsonFile();

    fields.forEach(field => {
        if (data[field]) {
            results[field] = data[field];
        }
    });

    return prettyLog(results, data);
};

getFields();
