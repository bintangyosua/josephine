import {
  EmbedBuilder,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import { Command } from "../../types/command";

const Confession: Command = {
  category: "🎉 Fun",
  data: new SlashCommandBuilder()
    .setName("confession")
    .setDescription("Create an anonymous confession to the server")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your secret message 💌")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("Optional image to include in the confession")
        .setRequired(false)
    ),

  async execute(interaction) {
    const message = interaction.options.getString("message", true);
    const imageAttachment = interaction.options.getAttachment("image");

    // 1. Kirim konfirmasi ke user secara diam-diam
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("✅ Confession Sent!")
          .setDescription("Your anonymous message has been sent.")
          .setColor("#00b894")
          .setFooter({ text: "Your identity is safe 🤫" }),
      ],
      ephemeral: true,
    });

    // 2. Kirim pesan confession ke publik
    const confessionEmbed = new EmbedBuilder()
      .setTitle("📢 New Confession")
      .setDescription(`"${message}"`)
      .setColor("#ff7675")
      .setFooter({ text: "Sent anonymously via /confession" })
      .setTimestamp();

    // Tambahkan gambar jika ada
    if (imageAttachment && imageAttachment.contentType?.startsWith("image/")) {
      confessionEmbed.setImage(imageAttachment.url);
    }

    const channel = interaction.channel;
    if (channel && "send" in channel) {
      try {
        await channel.send({ embeds: [confessionEmbed] });
      } catch (error) {
        console.error("Failed to send anonymous confession:", error);
      }
    }
  },
};

export default Confession;
