import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder,
  AutocompleteInteraction,
} from "discord.js";

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
  category: string;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
