"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const axios_1 = __importDefault(require("../axios"));
exports.usersService = {
    addXp: async (discordId, username, amount) => {
        const response = await axios_1.default.post(`/users/${discordId}/add-xp`, {
            amount: amount,
            username: username,
        });
        return response;
    },
    messageCreate: async (discordId, username) => {
        try {
            const response = await axios_1.default.post(`/users/${discordId}/message-create`, {
                username: username,
            });
            return response;
        }
        catch (error) {
            console.error(error);
        }
    },
    async getUserByDiscordId(discordId) {
        const response = await axios_1.default.get(`/users/${discordId}`);
        if (response.data === null) {
            return await this.createUser(discordId);
        }
        return response;
    },
    createUser: async (discordId) => {
        const response = await axios_1.default.post(`/users`, {
            discordId,
        });
        return response;
    },
    leaderboard: async () => {
        const response = await axios_1.default.get("/leaderboard");
        return response;
    },
};
