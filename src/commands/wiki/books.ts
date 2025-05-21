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
import { wikiServices } from "../../lib/api/wiki"; // Pastikan ini di-import sesuai dengan file service kamu

const ITEMS_PER_PAGE = 15;

function getBookDetailEmbed(book: any, index: number) {
  return new EmbedBuilder()
    .setTitle(`📚 Buku: ${book.title}`)
    .setColor(0xf59e42)
    .setDescription(`**No:** ${index + 1}`)
    .addFields(
      {
        name: "Pengarang",
        value: book.author_name?.join(", ") || "-",
        inline: true,
      },
      {
        name: "Tahun Terbit",
        value: book.first_publish_year?.toString() || "-",
        inline: true,
      },
      {
        name: "Jumlah Edisi",
        value: book.edition_count?.toString() || "-",
        inline: true,
      },
      {
        name: "Bahasa",
        value: book.language?.join(", ") || "-",
        inline: false,
      },
      {
        name: "Link Ebook",
        value:
          book.ebook_access === "borrowable"
            ? `[Pinjam Ebook](https://openlibrary.org${book.key})`
            : "Tidak Tersedia",
        inline: false,
      }
    )
    .setThumbnail(`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`)
    .setFooter({ text: "Sumber: Open Library" });
}

function getBooksPage(page: number, books: any[]) {
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

  if (page < 1 || page > totalPages) {
    return new EmbedBuilder()
      .setColor(0xf54242)
      .setTitle("Error")
      .setDescription(
        `Halaman yang diminta tidak valid. Halaman yang tersedia: 1-${totalPages}`
      );
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const selected = books.slice(start, start + ITEMS_PER_PAGE);

  const embed = new EmbedBuilder()
    .setTitle(`📚 Daftar Buku (Halaman ${page}/${totalPages})`)
    .setColor(0x5865f2)
    .setFooter({ text: `Total: ${books.length} buku` });

  let bookList = "";
  selected.forEach((b, i) => {
    bookList += `\`${b.title} (${start + i + 1})\` `;
  });

  embed.addFields({
    name: "Daftar Buku:",
    value: bookList || "Tidak ada buku yang ditemukan.",
  });

  return embed;
}

function getNavigationRow(currentPage: number, totalPages: number) {
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

function getBookSelectMenu(page: number, books: any[]) {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const options = pageBooks.map((b, idx) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(`${startIndex + idx + 1}. ${b.title}`)
      .setDescription(b.author_name?.join(", ") || "-")
      .setValue((startIndex + idx).toString())
  );

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_book")
      .setPlaceholder(`🔍 Pilih Buku (Halaman ${page})`)
      .addOptions(options)
  );
}

const BooksCommand: Command = {
  category: "📔 Wiki",
  data: new SlashCommandBuilder()
    .setName("books")
    .setDescription("Show books by name")
    .addStringOption((option) =>
      option
        .setName("book")
        .setDescription("Nama buku untuk mencari")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Nomor halaman untuk menampilkan")
        .setMinValue(1)
        .setRequired(false)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("book", true);
    let page = interaction.options.getInteger("page") || 1;

    // Ambil data buku dari service (dalam hal ini adalah OpenLibrary API)
    const books = await wikiServices.getBookByName(query);
    const totalPages = Math.ceil(books.docs.length / ITEMS_PER_PAGE);

    const embed = getBooksPage(page, books.docs);
    const navRow = getNavigationRow(page, totalPages);
    const selectRow = getBookSelectMenu(page, books.docs);

    const message = await interaction.reply({
      embeds: [embed],
      components: [navRow, selectRow],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      time: 300000, // 5 menit
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: "Kamu tidak bisa menggunakan tombol ini.",
          ephemeral: true,
        });
        return;
      }

      if (i.isButton()) {
        if (i.customId === "prev_page") {
          page--;
        } else if (i.customId === "next_page") {
          page++;
        }

        const updatedEmbed = getBooksPage(page, books.docs);
        const updatedNavRow = getNavigationRow(page, totalPages);
        const updatedSelectRow = getBookSelectMenu(page, books.docs);

        await i.update({
          embeds: [updatedEmbed],
          components: [updatedNavRow, updatedSelectRow],
        });
      } else if (i.isStringSelectMenu()) {
        if (i.customId === "select_book") {
          const selectedIndex = parseInt(i.values[0]);
          const selectedBook = books.docs[selectedIndex];
          const detailEmbed = getBookDetailEmbed(selectedBook, selectedIndex);

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

    collector.on("end", async () => {
      await interaction
        .editReply({
          components: [],
        })
        .catch(() => {});
    });
  },
};

export default BooksCommand;
