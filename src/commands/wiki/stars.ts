import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../types/command";
import stars from "../../data/rasi_bintang.json";

const ITEMS_PER_PAGE = 25;
const totalPages = Math.ceil(stars.length / ITEMS_PER_PAGE);

function getStarDetailEmbed(star: any, index: number) {
  return new EmbedBuilder()
    .setTitle(`🌟 Rasi Bintang: ${star.Name}`)
    .setColor(0xf59e42)
    .setDescription(`**No:** ${index + 1}`)
    .addFields(
      { name: "Singkatan", value: star.Singkatan || "-", inline: true },
      { name: "Genitif", value: star.Genitif || "-", inline: true },
      { name: "Asal", value: star.Asal || "-", inline: false },
      { name: "Makna", value: star.Makna || "-", inline: false }
    )
    .setThumbnail(star.Simbol_img)
    .setFooter({ text: "Sumber: Wikipedia" });
}

function getStarsPage(page: number) {
  // Validasi halaman
  if (page < 1 || page > totalPages) {
    return new EmbedBuilder()
      .setColor(0xf54242)
      .setTitle("Error")
      .setDescription(
        `Halaman yang diminta tidak valid. Halaman yang tersedia: 1-${totalPages}`
      );
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const selected = stars.slice(start, start + ITEMS_PER_PAGE);

  const embed = new EmbedBuilder()
    .setTitle(`🔭 Daftar Rasi Bintang (Halaman ${page}/${totalPages})`)
    .setColor(0x5865f2)
    .setFooter({ text: `Total: ${stars.length} rasi bintang` });

  // Create a single string with all constellations
  let constellationList = "";
  selected.forEach((s, i) => {
    constellationList += `\`${s.Name} (${start + i + 1})\` `; // Add each constellation in a new line
  });

  // Add the string to the embed
  embed.addFields({
    name: "Daftar Rasi Bintang:",
    value: constellationList || "No constellations available.",
  });

  return embed;
}

function getNavigationRow(currentPage: number) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("prev_page")
      .setLabel("⬅️ Prev")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage <= 1),
    new ButtonBuilder()
      .setCustomId("next_page")
      .setLabel("Next ➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage >= totalPages)
  );
}

function getStarSelectMenu(page: number) {
  // Creating select menu with proper chunking for star selection based on current page
  // Discord has a 25-option limit, so we'll show stars from current page
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageStars = stars.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const options = pageStars.map((s, idx) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`${startIndex + idx + 1}. ${s.Name}`)
      .setDescription(`${s.Singkatan || "-"}`)
      .setValue((startIndex + idx).toString())
  );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_star")
      .setPlaceholder(`🔍 Pilih rasi bintang (Halaman ${page})`)
      .addOptions(options)
  );
}

const StarsCommand: Command = {
  category: "📔 Wiki",
  data: new SlashCommandBuilder()
    .setName("stars")
    .setDescription("Display constellation data from Wikipedia")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page number to display")
        .setMinValue(1)
        .setMaxValue(totalPages)
        .setRequired(false)
    ),
  async execute(interaction) {
    let currentPage = interaction.options.getInteger("page") || 1;

    // Handle initial response
    const embed = getStarsPage(currentPage);
    const navRow = getNavigationRow(currentPage);
    const selectRow = getStarSelectMenu(currentPage);

    const message = await interaction.reply({
      embeds: [embed],
      components: [navRow, selectRow],
      fetchReply: true,
    });

    // Create collector for the buttons and select menu
    const collector = message.createMessageComponentCollector({
      time: 300000, // 5 minutes
    });

    // Handle navigation buttons and back button
    collector.on("collect", async (i) => {
      // Only let the original user interact with components
      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: "Kamu tidak bisa menggunakan tombol ini.",
          ephemeral: true,
        });
        return;
      }

      // Handle different component types
      if (i.isButton()) {
        // Handle buttons
        if (i.customId === "prev_page") {
          currentPage--;

          // Update the embed and components
          const updatedEmbed = getStarsPage(currentPage);
          const updatedNavRow = getNavigationRow(currentPage);
          const updatedSelectRow = getStarSelectMenu(currentPage);

          await i.update({
            embeds: [updatedEmbed],
            components: [updatedNavRow, updatedSelectRow],
          });
        } else if (i.customId === "next_page") {
          currentPage++;

          // Update the embed and components
          const updatedEmbed = getStarsPage(currentPage);
          const updatedNavRow = getNavigationRow(currentPage);
          const updatedSelectRow = getStarSelectMenu(currentPage);

          await i.update({
            embeds: [updatedEmbed],
            components: [updatedNavRow, updatedSelectRow],
          });
        } else if (i.customId === "back_to_list") {
          // Handle going back to the list view
          const listEmbed = getStarsPage(currentPage);
          const navRow = getNavigationRow(currentPage);
          const updatedSelectRow = getStarSelectMenu(currentPage);

          await i.update({
            embeds: [listEmbed],
            components: [navRow, updatedSelectRow],
          });
        }
      } else if (i.isStringSelectMenu()) {
        // Handle select menus
        if (i.customId === "select_star") {
          const selectedIndex = parseInt(i.values[0]);
          const star = stars[selectedIndex];
          const detailEmbed = getStarDetailEmbed(star, selectedIndex);

          // Add a back button
          const backButton =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("back_to_list")
                .setLabel("⬅️ Kembali ke daftar")
                .setStyle(ButtonStyle.Secondary)
            );

          await i.update({
            embeds: [detailEmbed],
            components: [backButton],
          });
        }
      }
    });

    // Handle timeouts
    collector.on("end", async () => {
      await interaction
        .editReply({
          components: [],
        })
        .catch(() => {});
    });
  },
};

export default StarsCommand;
