import api from "../axios";

export const commandService = {
  create: async (command: any) => {
    const response = await api.post("/commands", command);
    return response;
  },
};
