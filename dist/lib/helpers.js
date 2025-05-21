"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = capitalize;
exports.addXp = addXp;
const users_1 = require("./api/users");
function capitalize(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
async function addXp(message, left, right) {
    const xp = Math.floor(Math.random() * left) + right;
    const response = await users_1.usersService.addXp(message.author.id, xp);
    return response;
}
