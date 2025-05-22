import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

const eightBallAnswers: string[] = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes – definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
];

const EightBallCommand: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("eightball")
    .setDescription("Ask the magic 8-ball a question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask the magic 8-ball.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const question = interaction.options.getString("question", true);
    const answer =
      eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
    await interaction.reply(
      `User's Question: ${question}\nMagic 8-Ball says: ${answer}`
    );
  },
};

export default EightBallCommand;
