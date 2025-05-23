import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  Role,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  PermissionsBitField, // For formatting permissions
} from "discord.js";
import { Command } from "../../types/command";
import { colors } from "../../config"; // Assuming you have a config file for colors

const ServerRolesCommand: Command = {
  category: "ℹ️ Info",
  data: new SlashCommandBuilder()
    .setName("serverroles")
    .setDescription("Lists all roles in the server."),
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    const guild = interaction.guild;

    // Fetch roles and sort by position (highest first), filter out @everyone
    const sortedRoles = guild.roles.cache
      .filter((role: Role) => role.id !== guild.id) // Filter out @everyone role
      .sorted((a: Role, b: Role) => b.position - a.position);

    if (sortedRoles.size === 0) {
      await interaction.reply({
        content: "This server has no roles to display (besides @everyone).",
        ephemeral: true,
      });
      return;
    }

    let roleListString = sortedRoles.map((role: Role) => role.name).join("\n");
    const maxDescriptionLength = 4000; // Slightly less than 4096 to be safe

    if (roleListString.length > maxDescriptionLength) {
      const rolesArray = sortedRoles.map((role: Role) => role.name);
      let truncatedList = "";
      let numTruncatedRoles = 0;

      for (const roleName of rolesArray) {
        if (
          truncatedList.length +
            roleName.length +
            1 + // for newline
            `\n...and X more roles.`.length < // estimate for the footer message
          maxDescriptionLength
        ) {
          truncatedList += `${roleName}\n`;
        } else {
          numTruncatedRoles++;
        }
      }
      roleListString = truncatedList.trim(); // Remove last newline
      if (numTruncatedRoles > 0) {
        roleListString += `\n...and ${numTruncatedRoles} more roles.`;
      }
    }

    let mainEmbedDescription = roleListString || "No roles to display.";

    // --- Select Menu ---
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("select_role_details")
      .setPlaceholder("Select a role for more details...");

    const rolesForMenu = sortedRoles.first(25); // Max 25 options
    rolesForMenu.forEach((role) => {
      selectMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(role.name.substring(0, 100)) // Max 100 chars for label
          .setValue(role.id)
          .setDescription(`ID: ${role.id}`.substring(0, 100)) // Max 100 chars for description
      );
    });

    if (sortedRoles.size > 25) {
      mainEmbedDescription +=
        "\n\n*Note: Only the top 25 roles (by position) are shown in the select menu.*";
    }

    const mainEmbed = new EmbedBuilder()
      .setColor(colors.primary || "#0099ff")
      .setTitle(`Server Roles for ${guild.name}`)
      .setDescription(mainEmbedDescription)
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const actionRow =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    const reply = await interaction.reply({
      embeds: [mainEmbed],
      components: rolesForMenu.length > 0 ? [actionRow] : [], // Only add menu if there are roles
    });

    // --- Interaction Collector ---
    if (rolesForMenu.length === 0) return; // No need for collector if menu is empty

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 120000, // 2 minutes
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({
          content: "This select menu is not for you.",
          ephemeral: true,
        });
        return;
      }

      const selectedRoleId = i.values[0];
      const role = guild.roles.cache.get(selectedRoleId);

      if (!role) {
        await i.update({
          content: "Selected role not found. It might have been deleted.",
          embeds: [],
          components: [],
        });
        return;
      }

      let permissionsString = role.permissions.toArray().join(", ");
      if (permissionsString.length > 1020) {
        // Max field value 1024
        permissionsString = permissionsString.substring(0, 1020) + "...";
      }
      if (!permissionsString) permissionsString = "None";

      const detailEmbed = new EmbedBuilder()
        .setColor(role.color || colors.primary || "#0099ff")
        .setTitle(`Role Details: ${role.name}`)
        .addFields(
          { name: "ID", value: role.id, inline: true },
          { name: "Name", value: role.name, inline: true },
          { name: "Color (Hex)", value: role.hexColor, inline: true },
          {
            name: "Mentionable",
            value: role.mentionable ? "Yes" : "No",
            inline: true,
          },
          { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
          { name: "Position", value: role.position.toString(), inline: true },
          {
            name: "Members",
            value: role.members.size.toString(),
            inline: true,
          },
          {
            name: "Created At",
            value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          { name: "Permissions", value: permissionsString, inline: false }
        )
        .setTimestamp()
        .setFooter({
          text: `Details for role ${role.name}`,
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await i.update({ embeds: [detailEmbed], components: [] }); // Remove menu after selection
    });

    collector.on("end", async (collected) => {
      // Attempt to fetch the original message and disable the select menu
      try {
        const message = await interaction.fetchReply();
        if (message.components.length > 0) {
          const disabledActionRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              selectMenu.setDisabled(true)
            );
          await interaction.editReply({ components: [disabledActionRow] });
        }
      } catch (error) {
        console.error(
          "Failed to disable select menu on serverroles command:",
          error
        );
      }
    });
  },
};

export default ServerRolesCommand;
