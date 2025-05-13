import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";

const Simp: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("simp")
    .setDescription("Replies with a random simp rate")
    .addUserOption((option) =>
      option.setName("target").setDescription("Target user").setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const author = interaction.user;

    if (!target) {
      interaction.reply({
        content: "🪞 Kamu simp ke diri sendiri? Ini udah level narcis 😭",
        ephemeral: true,
      });

      return;
    }

    const simpRate = Math.floor(Math.random() * 101); // 0 - 100

    let comment = "";
    if (simpRate < 30) comment = "Masih bisa diselamatkan 😌";
    else if (simpRate < 60) comment = "Udah mulai bahaya bro 😳";
    else if (simpRate < 85) comment = "Down bad alert 🚨";
    else comment = "Lo udah terlalu dalam bro 😭";

    await interaction.reply(
      `💘 **${author.username}** simping to **${target.username}** at **${simpRate}%** level.\n_${comment}_`
    );
  },
};

export default Simp;
