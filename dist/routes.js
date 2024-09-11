"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sources = exports.crud = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const users_1 = require("./src/users/users");
exports.crud = {
    //Read route
    GET: (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const userList = (0, users_1.users)();
        if (!Array.isArray(userList)) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ message: "Error on reading database." }));
        }
        if (userList.length == 0) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ message: "Empty database." }));
        }
        if (req.url && req.url.includes('id=')) { //Checking if the client is requesting an user
            const ID = req.url.split('id=')[1]; //If yes, gets the ID
            const user = userList.find((user) => user.id === ID);
            //If user does not exist, sends an obj with property exists setted to false
            if (!user) {
                res.statusCode = 404;
                return res.end();
            }
            return res.end(JSON.stringify(user)); //If exixsts, returns the user
        }
        else { //This sends all users (without sensible info)
            const userList = (0, users_1.users)();
            if (!Array.isArray(userList)) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ message: "Error on reading database." }));
            }
            userList.forEach((user) => {
                delete user.email;
                delete user.age;
            });
            res.end(JSON.stringify(userList));
        }
    },
    //Create route
    POST: (req, res) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        const userList = (0, users_1.users)(); //Gets users
        if (!Array.isArray(userList)) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ message: "Error on reading database." }));
        }
        req.on('data', (chunk) => {
            const user = JSON.parse(chunk);
            user.id = crypto_1.default.randomBytes(12).toString('hex');
            userList.push(user);
            try {
                fs_1.default.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList)); //Write the user list with the new user inside
            }
            catch (error) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ message: "Error on writing data." }));
            }
            res.end(JSON.stringify(user));
        });
    },
    //Update route
    PUT: (req, res) => {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        req.on('data', (chunk) => {
            const newUserData = JSON.parse(chunk);
            const userList = (0, users_1.users)();
            if (!Array.isArray(userList)) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ message: "Error on reading database." }));
            }
            const userIndex = userList.findIndex((userFromList) => userFromList.id === newUserData.id);
            if (userIndex === -1) {
                res.statusCode = 404;
                return res.end();
            }
            if (userIndex !== -1) { //Updates if the index is not -1
                userList[userIndex] = newUserData;
                try {
                    fs_1.default.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList));
                }
                catch (error) {
                    res.statusCode = 500;
                    return res.end(JSON.stringify({ message: "Error on writing data." }));
                }
                return res.end();
            }
        });
    },
    //Delete route
    DELETE: (req, res) => {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        req.on('data', (chunk) => {
            const { ID } = JSON.parse(chunk); //Getting the ID
            const userList = (0, users_1.users)();
            if (!Array.isArray(userList)) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ message: "Error on reading database." }));
            }
            const userIndex = userList.findIndex(userFromList => userFromList.id === ID);
            if (userIndex === -1) {
                res.statusCode = 404;
                return res.end();
            }
            userList.splice(userIndex, 1);
            try {
                fs_1.default.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList));
            }
            catch (error) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ message: "Error on writing data." }));
            }
            res.end();
        });
    }
};
exports.sources = {
    home: function (req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fs_1.default.readFileSync("./index.html"));
    },
    html: function (req, res, file) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fs_1.default.readFileSync(path_1.default.join(__dirname, "src", "pages", file)));
    },
    css: function (req, res, file) {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(fs_1.default.readFileSync(path_1.default.join(__dirname, "src", "css", file)));
    },
    png: function (req, res, file) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(fs_1.default.readFileSync(path_1.default.join(__dirname, "src", "images", file)));
    },
    js: function (req, res, file) {
        res.writeHead(200, { "Content-Type": "text/javascript" });
        res.end(fs_1.default.readFileSync(path_1.default.join(__dirname, "src", "scripts", file)));
    },
    ico: function (req, res) {
    },
    page404: function (req, res, file) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(fs_1.default.readFileSync(path_1.default.join(__dirname, "src", "pages", "404.html")));
    }
};
