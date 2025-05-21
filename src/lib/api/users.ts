import api from "../axios";

export const usersService = {
  addXp: async (discordId: string, amount: number) => {
    const response = await api.post(`/users/${discordId}/add-xp`, {
      amount: amount,
    });

    return response;
  },

  messageCreate: async (discordId: string) => {
    const response = await api.get(`/users/${discordId}/message-create`);
    return response;
  },

  getUserByDiscordId: async (discordId: string) => {
    const response = await api.get(`/users/${discordId}`);
    return response;
  },
};
