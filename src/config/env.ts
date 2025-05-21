import "dotenv/config";

export const config = {
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN!,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID!, // optional, for dev
  API_URL: process.env.API_URL || "http://localhost:3000",
};
