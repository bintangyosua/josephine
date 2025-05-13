import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import wouldyourather from "../../data/would-you-rather.json";

const WouldYouRatherCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("would-you-rather")
    .setDescription(
      "A fun game where the bot gives you two tough or funny choices, and you have to pick one!"
    ),
  async execute(interaction) {
    const randomQuestion =
      wouldyourather[Math.floor(Math.random() * wouldyourather.length)];
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .addFields({ name: "Category", value: randomQuestion.category })
      .addFields({
        name: "Question",
        value: randomQuestion.question_content,
      })
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL(),
      });
    await interaction.reply({ embeds: [embed] });
  },
};

export default WouldYouRatherCommand;
