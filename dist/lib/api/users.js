"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const axios_1 = __importDefault(require("../axios"));
exports.usersService = {
    addXp: async (discordId, amount) => {
        const response = await axios_1.default.post(`/users/${discordId}/add-xp`, {
            amount: amount,
        });
        return response;
    },
    messageCreate: async (discordId) => {
        const response = await axios_1.default.get(`/users/${discordId}/message-create`);
        return response;
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
};
