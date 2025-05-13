import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import tod from "../../data/truth-or-dare.json";

const WouldYouRatherCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("tod")
    .setDescription(
      "Start a fun game where you get a random truth question or dare challenge!"
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("truth").setDescription("Get a random truth question.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("dare").setDescription("Get a random dare challenge.")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    // Filter pertanyaan berdasarkan kategori
    const filteredQuestions = tod.filter(
      (item) => item.category.toLowerCase() === subcommand.toLowerCase()
    );

    // Cek apakah ada pertanyaan dalam kategori tersebut
    if (filteredQuestions.length === 0) {
      await interaction.reply({
        content: `No ${subcommand} questions found.`,
        ephemeral: true,
      });
      return;
    }

    // Ambil pertanyaan acak
    const randomQuestion =
      filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    // Buat embed
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
      .setColor(subcommand === "truth" ? 0x00bfff : 0xff4500) // warna opsional
      .setFooter({
        text: interaction.client.user.username,
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};

export default WouldYouRatherCommand;
