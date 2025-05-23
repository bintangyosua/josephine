import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";
import { capitalize } from "../../lib/helpers";
import he from "he";

const Trivia: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Replies with a random trivia"),
  async execute(interaction) {
    // Ambil data trivia dari API
    const data = await funServices.getTrivia();

    const trivia = data.results[0];
    const question = he.decode(trivia.question);
    const correct = he.decode(trivia.correct_answer);
    const options = [...trivia.incorrect_answers.map(he.decode), correct].sort(
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
    });

    let answered = false;

    collector?.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "Ini bukan pertanyaan kamu!",
          ephemeral: true,
        });
      }

      const selectedLabel = i.customId;
      answered = true;
      collector.stop();

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

    collector?.on("end", async (_, reason) => {
      if (answered) return;

      try {
        const disabledButtons = options.map((opt) =>
          new ButtonBuilder()
            .setCustomId(opt)
            .setLabel(opt)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );

        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          disabledButtons
        );

        await interaction.editReply({
          content: `🧠 **Trivia:**\n\n${question}\n\n⏰ Waktu habis! Kamu tidak menjawab tepat waktu.`,
          components: [disabledRow],
        });
      } catch (error) {
        console.error("Gagal edit karena interaksi tidak valid lagi:", error);
      }
    });
  },
};

export default Trivia;

// Fungsi untuk decode HTML entity (&quot;, &#039;, etc.)
export function decodeHTML(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&eacute;/g, "é");
}
