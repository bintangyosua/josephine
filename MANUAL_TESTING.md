# Manual Testing Instructions for New Fun Commands

This document provides instructions on how to manually test the newly added commands: `dadjoke`, `eightball`, and `randomfact`.

## Prerequisites for Testing

Before you begin testing, ensure the following:

1.  **Bot Compilation:** If the bot is a TypeScript project (which it is), it needs to be compiled. Typically, this is done with a command like `npm run build` or `tsc`.
2.  **Bot is Running:** The bot application must be running and successfully connected to your Discord server.
3.  **Command Registration:** Slash commands need to be registered with Discord. This is often handled by a specific script (e.g., `npm run deploy-commands` or similar) or automatically when the bot starts up. Ensure this step has been completed so that Discord is aware of the new commands.
4.  **Bot Permissions:** The bot must have the necessary permissions in the channel where you are testing (e.g., "Send Messages", "Use Application Commands").

## Testing `dadjoke` Command

*   **Trigger:** Type `/dadjoke` in a Discord channel where the bot has permissions.
*   **Options:** None.
*   **Expected Output:** The bot should reply with a single-line dad joke. The content of the joke will vary with each execution as it's fetched from an external API.
    *   Example: "Why don't skeletons fight each other? They don't have the guts."

## Testing `eightball` Command

*   **Trigger:** Type `/eightball` in a Discord channel where the bot has permissions.
*   **Options:**
    *   `question` (required): This is the question you want to ask the magic 8-ball. You must provide a value for this option.
        *   Example value: "Will I have a good day today?"
*   **Expected Output:** The bot should reply in a specific format, including your question and a random answer from its predefined list.
    *   Format:
        ```
        User's Question: [Your Question Here]
        Magic 8-Ball says: [A random answer from the list]
        ```
    *   Example:
        ```
        User's Question: Will I have a good day today?
        Magic 8-Ball says: Signs point to yes.
        ```

## Testing `randomfact` Command

*   **Trigger:** Type `/randomfact` in a Discord channel where the bot has permissions.
*   **Options:** None.
*   **Expected Output:** The bot should reply with a single interesting fact. The content of the fact will vary with each execution as it's fetched from an external API.
    *   Example: "A group of owls is called a parliament."

## General Notes

*   If a command does not appear in the slash command suggestions in Discord, it's likely an issue with command registration or bot permissions.
*   If a command appears but fails to execute or returns an error, check the bot's console logs for error messages. This can help diagnose if the issue is with the API, the bot's code, or its configuration.
