"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users = () => {
    try {
        const buffer = fs_1.default.readFileSync(path_1.default.join(__dirname, 'userDatabase.json'));
        return JSON.parse(buffer.toString());
    }
    catch (error) {
        console.log(error);
    }
};
exports.users = users;
