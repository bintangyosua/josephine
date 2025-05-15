import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import { funServices } from "../../lib/api/fun";
import { opentdbService } from "../../lib/api/opentdb";
import { decodeHTML } from "./trivia";
import { capitalize } from "../../lib/helpers";
import he from "he";

const Trivia2: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("trivia2")
    .setDescription("Random Trivia")
    .addSubcommand((option) => option.setName("anime").setDescription("Anime"))
    .addSubcommand((option) => option.setName("game").setDescription("Game"))
    .addSubcommand((option) => option.setName("movie").setDescription("Movie"))
    .addSubcommand((option) =>
      option.setName("gadgets").setDescription("Gadgets")
    )
    .addSubcommand((option) =>
      option.setName("geo").setDescription("Geography")
    )
    .addSubcommand((option) =>
      option.setName("compsci").setDescription("Computer Science")
    )
    .addSubcommand((option) =>
      option.setName("politics").setDescription("Politics")
    )
    .addSubcommand((option) =>
      option.setName("history").setDescription("History")
    ),
  async execute(interaction) {
    const category = interaction.options.getSubcommand();

    let categoryId;
    switch (category) {
      case "anime":
        categoryId = 31;
        break;
      case "game":
        categoryId = 15;
        break;
      case "movie":
        categoryId = 11;
        break;
      case "politics":
        categoryId = 24;
        break;
      case "history":
        categoryId = 23;
        break;
      case "compsci":
        categoryId = 18;
        break;
      case "geo":
        categoryId = 22;
        break;
      case "gadgets":
        categoryId = 30;
        break;
      default:
        categoryId = 9;
        break;
    }

    const level = ["easy", "medium", "hard"][Math.floor(Math.random() * 3)];

    const response = await opentdbService.getQuestion(
      1,
      categoryId,
      level as any,
      "multiple"
    );

    const trivia = response.results[0];
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
      content: `🧠 **${capitalize(
        category
      )} Trivia:**\nDifficulty: ${capitalize(level)}\n\n ${question}\n`,
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

      const selected = i.customId;
      answered = true;
      collector.stop();

      const feedback = options
        .map((opt) => {
          const isCorrect = opt === correct;
          const isChosen = opt === selected;

          const left = isChosen ? (isCorrect ? "🎯" : "❌") : "▫️";
          const right = isCorrect ? "✅" : "";

          return `${left} ${opt} ${right}`;
        })
        .join("\n");

      const result =
        selected === correct
          ? "🎉 Jawaban kamu **benar**!"
          : `😔 Jawaban kamu **salah**. Jawaban yang benar adalah **${correct}**.`;

      await i.update({
        content: `🧠 **${capitalize(
          category
        )} Trivia:**\nDifficulty: ${capitalize(
          level
        )}\n\n ${question}\n\n${feedback}\n\n${result}`,
        components: [],
      });

      return;
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
          content: `🧠 **${capitalize(
            category
          )} Trivia:**\nDifficulty: ${capitalize(
            level
          )}\n\n${question}\n\n⏰ Waktu habis! Kamu tidak menjawab tepat waktu.`,
          components: [disabledRow],
        });
      } catch (error) {
        console.error("Gagal edit karena interaksi tidak valid lagi:", error);
      }
    });
  },
};

export default Trivia2;
