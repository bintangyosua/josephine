import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const Confession: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("confession")
    .setDescription("Create confession anonymously")
    .addStringOption((option) =>
      option.setName("message").setDescription("Message").setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString("message", true);
    const embed = new EmbedBuilder().setDescription(`"${message}"`);

    await interaction.reply({
      content: `**Confession:**\n"${message}"`,
      ephemeral: true,
    });

    // Check if the channel supports the send method
    const channel = interaction.channel;
    if (channel && "send" in channel) {
      try {
        // await interaction.deleteReply();
        await channel.send({
          content: `**Confession:**\n"${message}"`,
        });
      } catch (error) {
        console.error("Failed to send anonymous confession:", error);
      }
    }
  },
};

export default Confession;
