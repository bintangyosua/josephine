"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rasi_bintang_json_1 = __importDefault(require("../../data/rasi_bintang.json"));
const ITEMS_PER_PAGE = 25;
const totalPages = Math.ceil(rasi_bintang_json_1.default.length / ITEMS_PER_PAGE);
function getStarDetailEmbed(star, index) {
    return new discord_js_1.EmbedBuilder()
        .setTitle(`🌟 Rasi Bintang: ${star.Name}`)
        .setColor(0xf59e42)
        .setDescription(`**No:** ${index + 1}`)
        .addFields({ name: "Singkatan", value: star.Singkatan || "-", inline: true }, { name: "Genitif", value: star.Genitif || "-", inline: true }, { name: "Asal", value: star.Asal || "-", inline: false }, { name: "Makna", value: star.Makna || "-", inline: false })
        .setThumbnail(star.Simbol_img)
        .setFooter({ text: "Sumber: Wikipedia" });
}
function getStarsPage(page) {
    // Validasi halaman
    if (page < 1 || page > totalPages) {
        return new discord_js_1.EmbedBuilder()
            .setColor(0xf54242)
            .setTitle("Error")
            .setDescription(`Halaman yang diminta tidak valid. Halaman yang tersedia: 1-${totalPages}`);
    }
    const start = (page - 1) * ITEMS_PER_PAGE;
    const selected = rasi_bintang_json_1.default.slice(start, start + ITEMS_PER_PAGE);
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(`🔭 Daftar Rasi Bintang (Halaman ${page}/${totalPages})`)
        .setColor(0x5865f2)
        .setFooter({ text: `Total: ${rasi_bintang_json_1.default.length} rasi bintang` });
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
function getNavigationRow(currentPage) {
    return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId("prev_page")
        .setLabel("⬅️ Prev")
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setDisabled(currentPage <= 1), new discord_js_1.ButtonBuilder()
        .setCustomId("next_page")
        .setLabel("Next ➡️")
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setDisabled(currentPage >= totalPages));
}
function getStarSelectMenu(page) {
    // Creating select menu with proper chunking for star selection based on current page
    // Discord has a 25-option limit, so we'll show stars from current page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageStars = rasi_bintang_json_1.default.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const options = pageStars.map((s, idx) => new discord_js_1.StringSelectMenuOptionBuilder()
        .setLabel(`${startIndex + idx + 1}. ${s.Name}`)
        .setDescription(`${s.Singkatan || "-"}`)
        .setValue((startIndex + idx).toString()));
    return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId("select_star")
        .setPlaceholder(`🔍 Pilih rasi bintang (Halaman ${page})`)
        .addOptions(options));
}
const StarsCommand = {
    category: "📔 Wiki",
    data: new discord_js_1.SlashCommandBuilder()
        .setName("stars")
        .setDescription("Display constellation data from Wikipedia")
        .addIntegerOption((option) => option
        .setName("page")
        .setDescription("Page number to display")
        .setMinValue(1)
        .setMaxValue(totalPages)
        .setRequired(false)),
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
                }
                else if (i.customId === "next_page") {
                    currentPage++;
                    // Update the embed and components
                    const updatedEmbed = getStarsPage(currentPage);
                    const updatedNavRow = getNavigationRow(currentPage);
                    const updatedSelectRow = getStarSelectMenu(currentPage);
                    await i.update({
                        embeds: [updatedEmbed],
                        components: [updatedNavRow, updatedSelectRow],
                    });
                }
                else if (i.customId === "back_to_list") {
                    // Handle going back to the list view
                    const listEmbed = getStarsPage(currentPage);
                    const navRow = getNavigationRow(currentPage);
                    const updatedSelectRow = getStarSelectMenu(currentPage);
                    await i.update({
                        embeds: [listEmbed],
                        components: [navRow, updatedSelectRow],
                    });
                }
            }
            else if (i.isStringSelectMenu()) {
                // Handle select menus
                if (i.customId === "select_star") {
                    const selectedIndex = parseInt(i.values[0]);
                    const star = rasi_bintang_json_1.default[selectedIndex];
                    const detailEmbed = getStarDetailEmbed(star, selectedIndex);
                    // Add a back button
                    const backButton = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setCustomId("back_to_list")
                        .setLabel("⬅️ Kembali ke daftar")
                        .setStyle(discord_js_1.ButtonStyle.Secondary));
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
                .catch(() => { });
        });
    },
};
exports.default = StarsCommand;
