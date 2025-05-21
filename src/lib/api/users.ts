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

  async getUserByDiscordId(discordId: string) {
    const response = await api.get(`/users/${discordId}`);

    if (response.data === null) {
      return await this.createUser(discordId);
    }

    return response;
  },

  createUser: async (discordId: string) => {
    const response = await api.post(`/users`, {
      discordId,
    });
    return response;
  },
};
