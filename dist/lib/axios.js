"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: `${env_1.config.API_URL}/api`,
});
exports.default = api;
