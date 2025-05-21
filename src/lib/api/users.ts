import api from "../axios";

export const usersService = {
  addXp: async (discordId: string, username: string, amount: number) => {
    const response = await api.post(`/users/${discordId}/add-xp`, {
      amount: amount,
      username: username,
    });

    return response;
  },

  messageCreate: async (discordId: string, username: string) => {
    try {
      const response = await api.post(`/users/${discordId}/message-create`, {
        username: username,
      });

      return response;
    } catch (error) {
      console.error(error);
    }
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

  leaderboard: async () => {
    const response = await api.get("/leaderboard");
    return response;
  },
};
