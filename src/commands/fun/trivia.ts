import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";

const Trivia: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Replies with a random trivia"),
  async execute(interaction) {
    // Ambil data trivia dari API
    const data = await funServices.getTrivia();

    const trivia = data.results[0];
    const question = decodeHTML(trivia.question);
    const correct = decodeHTML(trivia.correct_answer);
    const options = [...trivia.incorrect_answers.map(decodeHTML), correct].sort(
      () => Math.random() - 0.5
    );

    const buttons = options.map((opt) =>
      new ButtonBuilder()
        .setCustomId(opt)
        .setLabel(opt)
        .setStyle(ButtonStyle.Primary)
    );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    await interaction.reply({
      content: `🧠 **Trivia:** ${question}`,
      components: [row],
    });

    const collector = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
      max: 1,
    });

    collector?.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "Ini bukan pertanyaan kamu!",
          ephemeral: true,
        });
      }

      const selectedLabel = i.customId;

      const optionText = options
        .map((opt) => {
          const isCorrect = opt === correct;
          const isChosen = opt === selectedLabel;

          const left = isChosen ? "❌" : "▫️";
          const right = isCorrect ? "✅" : "";

          return `${left} ${opt} ${right}`;
        })
        .join("\n");

      const resultText =
        selectedLabel === correct
          ? "🎉 Jawaban kamu **benar**!"
          : `😔 Jawaban kamu **salah**.`;

      await i.update({
        content: `🧠 **Trivia:** ${question}\n\n${optionText}\n\n${resultText}`,
        components: [],
      });
    });
  },
};

export default Trivia;

// Fungsi untuk decode HTML entity (&quot;, &#039;, etc.)
function decodeHTML(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&eacute;/g, "é");
}
