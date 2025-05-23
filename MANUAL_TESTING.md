# Manual Testing Instructions for Fun, Info, and Game Commands

This document provides instructions on how to manually test various commands, including `dadjoke`, `eightball`, `randomfact`, `server-info`, `user-info`, `github`, `serverroles`, and the Honkai Star Rail commands (`hsr-profile`, `hsr-character`, `hsr-gameinfo`).

## Prerequisites for Testing

Before you begin testing, ensure the following:

1.  **Bot Compilation:** If the bot is a TypeScript project (which it is), it needs to be compiled. Typically, this is done with a command like `npm run build` or `tsc`.
2.  **Bot is Running:** The bot application must be running and successfully connected to your Discord server.
3.  **Command Registration:** Slash commands need to be registered with Discord. This is often handled by a specific script (e.g., `npm run deploy-commands` or similar) or automatically when the bot starts up. Ensure this step has been completed so that Discord is aware of the new commands.
4.  **Bot Permissions:** The bot must have the necessary permissions in the channel where you are testing (e.g., "Send Messages", "Use Application Commands").
5.  **StarRail.js Cache:** For Honkai Star Rail commands, the `starrail.js` library might need to download/update its cache on first run or after a while. This can take a few moments. Ensure the bot has been running for a bit to allow this process to complete, or check console logs for messages about cache updates.

## Testing Fun Commands

### Testing `dadjoke` Command

*   **Trigger:** Type `/dadjoke` in a Discord channel where the bot has permissions.
*   **Options:** None.
*   **Expected Output:** The bot should reply with a single-line dad joke. The content of the joke will vary with each execution as it's fetched from an external API.
    *   Example: "Why don't skeletons fight each other? They don't have the guts."

### Testing `eightball` Command

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

### Testing `randomfact` Command

*   **Trigger:** Type `/randomfact` in a Discord channel where the bot has permissions.
*   **Options:** None.
*   **Expected Output:** The bot should reply with a single interesting fact. The content of the fact will vary with each execution as it's fetched from an external API.
    *   Example: "A group of owls is called a parliament."

## Testing Info Commands

### Testing `server-info` Command Enhancements

*   **Trigger:** Type `/server-info` in a Discord channel where the bot has permissions.
*   **Expected Output:** The bot should reply with an embed containing server information, including the following new/updated fields:
    *   **Owner:**
        *   **Verification:** Verify that the displayed user tag (e.g., `username#discriminator`) matches the actual server owner.
    *   **Verification Level:**
        *   **Verification:** Check this against the server's "Safety Setup" -> "Verification Level" setting in Discord (e.g., None, Low, Medium, High, Highest). The bot should display the corresponding text.
    *   **Role Count:**
        *   **Verification:** Go to "Server Settings" -> "Roles" and count the number of roles. Compare this with the displayed number. It should be accurate.
    *   **Channels (Counts):**
        *   **Verification:** The embed field typically shows something like "X Text, Y Voice, Z Categories". Manually count the number of text channels, voice channels, and categories in the server. Verify these counts are correctly displayed.
    *   **Description:**
        *   **Verification:** If the server has a description (Server Settings -> Overview -> Server Description), ensure it's displayed. If not, it should show "No server description."

### Testing `user-info` Command Enhancements

*   **Trigger:** Type `/user-info` in a Discord channel. You can test this with and without the optional `target` user option.
    *   Without `target`: `/user-info` (displays info for the user running the command)
    *   With `target`: `/user-info target:@SomeUser`
*   **Expected Output:** The bot should reply with an embed containing user information, including the following new/updated fields:
    *   **Nickname:**
        *   **Verification:** If the target user has a server-specific nickname, verify it's displayed. If they don't have a nickname, their global username should be displayed, or "None" if that's the implemented default.
    *   **Bot?:**
        *   **Verification:** Verify this shows "Yes" if the target user is a bot account, and "No" if it's a regular user account.
    *   **Highest Role:**
        *   **Verification:** Check the target user's roles in the server. The displayed role should be their highest (top-most) role in the server's role hierarchy. If the user has no roles other than `@everyone`, it should display "None" or the equivalent.
    *   **Status:**
        *   **Verification:** Compare the displayed status (e.g., "🟢 Online", "🌙 Idle", "⛔ Do Not Disturb", "⚫ Offline") with the user's actual presence status in Discord.
        *   Test with different statuses if possible (e.g., ask the target user to change their status or test on users with different statuses).
    *   **Badges:**
        *   **Verification:** While not a new field, ensure it's still displaying user badges correctly and is now inline.

### Testing `github` Command

*   **Trigger:** Type `/github` in a Discord channel.
*   **Options:**
    *   `username` (required): The GitHub username to look up.
*   **Test Cases:**
    1.  **Valid Username:**
        *   **Input:** Use a known valid GitHub username (e.g., `octocat`, `torvalds`).
        *   **Expected Output:** An embed displaying the GitHub user's information:
            *   Avatar (thumbnail and author icon).
            *   Username (in author field, linked to their profile).
            *   Real Name (if available, e.g., "Name: Linus Torvalds").
            *   Bio (if available).
            *   Public Repos count.
            *   Followers count.
            *   Following count.
        *   **Verification:** Compare the displayed information with the user's actual GitHub profile page.
    2.  **Invalid/Non-existent Username:**
        *   **Input:** Use a username that is highly unlikely to exist (e.g., `thisusernameprobablydoesnotexist12345`).
        *   **Expected Output:** An ephemeral error message, for example: "Could not fetch information for that GitHub user. Please ensure the username is correct and the user exists."

### Testing `serverroles` Command (Interactive)

*   **Initial List Trigger:** Type `/serverroles` in a Discord channel within a server where the bot has permissions.
*   **Expected Output (Initial List):**
    1.  **General Embed:** An embed listing server roles (excluding @everyone), sorted by their position in the server's role hierarchy (highest position first).
    2.  **Select Menu (if > 0 custom roles):**
        *   If the server has 1 to 25 custom roles (excluding @everyone), a select menu should be present, populated with all custom roles.
        *   If the server has more than 25 custom roles, the select menu should be populated with the top 25 roles (by position). The main embed description should also include a note like "*Note: Only the top 25 roles (by position) are shown in the select menu.*"
    3.  **No Custom Roles:**
        *   **Input:** Test in a server with no custom roles (only @everyone).
        *   **Expected Output:** An ephemeral message like "This server has no roles to display (besides @everyone)." and no select menu.
    4.  **Role List Truncation (Description):** If the text list of roles in the main embed's description is very long (e.g., many roles with long names), verify it's truncated with a message like "...and X more roles."

*   **Interactive Detail View Trigger:**
    *   From the select menu displayed by `/serverroles`, choose a role.
*   **Expected Output (Detail View):**
    1.  **Updated Embed:** The original message should update to display a new embed with details for the selected role. This embed should include:
        *   Role ID.
        *   Role Name.
        *   Role Color (Hex).
        *   Mentionable status (Yes/No).
        *   Hoisted status (Yes/No).
        *   Position (numerical).
        *   Member Count (number of members with that role).
        *   Creation Date (displayed as a relative timestamp, e.g., "2 years ago").
        *   Permissions (a list of permissions the role has, potentially truncated if very long).
        *   **Verification:** Manually check these details against the role's settings in "Server Settings" -> "Roles" to ensure accuracy.
    2.  **Select Menu Removal:** After selecting a role and the detail embed is shown, the select menu should be removed from the message.
    3.  **User Interaction Exclusivity:**
        *   **Test:** Have another user (User B) try to select an option from the menu generated by User A's `/serverroles` command.
        *   **Expected Output:** User B should receive an ephemeral error message (e.g., "This select menu is not for you.") and User A's message should remain unchanged.
    4.  **Collector Timeout:**
        *   **Test:** Trigger the `/serverroles` command. Do not interact with the select menu for the duration of the collector timeout (e.g., 2 minutes).
        *   **Expected Output:** After the timeout, the select menu on the original message should become disabled (grayed out and unclickable). Trying to interact with it should do nothing.

## Testing Honkai Star Rail Commands

### Testing `hsr-profile` Command

*   **Trigger:** `/hsr-profile uid:<valid_hsr_uid>`
*   **Options:**
    *   `uid` (required): A valid Honkai Star Rail User ID (e.g., a known working UID from the game).
*   **Test Cases:**
    1.  **Valid UID:**
        *   **Input:** Provide a valid HSR UID.
        *   **Expected Output:** An embed displaying the player's profile information:
            *   UID
            *   Nickname
            *   Trailblaze Level
            *   Equilibrium Level (World Level)
            *   Friends (Friend Count)
            *   Achievement Count
            *   Signature (if set by the player)
            *   Characters in Showcase (list of character names)
            *   Player Avatar as thumbnail.
            *   A link to Enka.Network if `enkaUserHash` is available.
        *   **Verification:** Compare the displayed information with the player's actual in-game profile or their profile on a site like Enka.Network (if linked).
    2.  **Invalid/Non-existent UID:**
        *   **Input:** Provide an invalid UID (e.g., "123", "abcdef") or a UID that does not exist.
        *   **Expected Output:** An error message indicating the profile could not be fetched, user not found, or UID is invalid.

### Testing `hsr-character` Command

*   **Trigger:** `/hsr-character name:<character_name>`
*   **Options:**
    *   `name` (required): The name of a Honkai Star Rail character.
*   **Autocomplete Testing:**
    1.  Start typing a character name (e.g., "Mar", "See", "Jing").
    2.  **Expected Behavior:** A list of matching character names should appear as autocomplete suggestions.
    3.  Select a character from the suggestions and execute the command.
*   **Direct Input Testing:**
    1.  Type a full, valid character name (e.g., "March 7th", "Seele", "Jing Yuan") and execute.
*   **Expected Output (for valid character):**
    *   An embed displaying character details:
        *   Name (e.g., "March 7th")
        *   Color (matching the character's element/Combat Type)
        *   Thumbnail (character's icon)
        *   Image (character's splash art)
        *   Rarity (e.g., ⭐⭐⭐⭐ or ⭐⭐⭐⭐⭐)
        *   Path (e.g., "The Preservation")
        *   Element/Combat Type (e.g., "Ice")
        *   Description (a brief overview of the character)
        *   Skills: A list of skills, each showing:
            *   Skill Name
            *   Skill Type (e.g., "Basic ATK", "Skill", "Ultimate", "Talent", "Technique")
            *   Skill Description (cleaned of HTML and truncated if too long)
    *   **Verification:** Compare the displayed details with in-game information or reliable HSR databases/wikis for accuracy.
*   **Non-existent Character Name:**
    *   **Input:** Type a name that is not a valid HSR character (e.g., "Pikachu").
    *   **Expected Output:** An error message indicating the character was not found.

### Testing `hsr-gameinfo` Command

*   **`events` Subcommand:**
    *   **Trigger:** `/hsr-gameinfo events`
    *   **Expected Output:**
        *   **If data is available via the library:** An embed listing current in-game events. Each event entry should ideally show:
            *   Event Name
            *   Duration (Start Date - End Date)
            *   A brief Description
            *   A URL to more details (if provided by the API)
        *   **Verification (if data shown):** Check the general accuracy of event names and durations against official Honkai Star Rail announcements or in-game information.
        *   **Important Note for Tester:** If the bot replies with a message like "Fetching event information is currently not supported..." or similar, this is an **acceptable outcome**. It indicates that the `starrail.js` library (or the version used) does not provide a direct method to fetch this specific live game data.
*   **`banners` Subcommand:**
    *   **Trigger:** `/hsr-gameinfo banners`
    *   **Expected Output:**
        *   **If data is available via the library:** An embed listing current character and light cone banners. Each banner entry should ideally show:
            *   Banner Name/Title
            *   Featured 5-star character/light cone
            *   Featured 4-star characters/light cones
            *   Banner End Time
            *   An image of the banner (if provided by the API)
        *   **Verification (if data shown):** Check the general accuracy of featured items and end times against official Honkai Star Rail announcements or in-game information.
        *   **Important Note for Tester:** Similar to the `events` subcommand, if the bot replies with a message like "Fetching banner information is currently not supported..." or similar, this is an **acceptable outcome** due to potential library limitations.

## General Notes

*   If a command does not appear in the slash command suggestions in Discord, it's likely an issue with command registration or bot permissions.
*   If a command appears but fails to execute or returns an error, check the bot's console logs for error messages. This can help diagnose if the issue is with the API, the bot's code, or its configuration.
*   For commands fetching from external APIs (GitHub, HSR APIs), ensure the testing environment has internet connectivity. API responses can also vary or be temporarily unavailable.I have reviewed the `MANUAL_TESTING.md` file that I updated in the previous turn. It seems I have already included all the requested information for testing the new Honkai Star Rail commands: `hsr-profile`, `hsr-character`, and `hsr-gameinfo`, as per the current subtask description.

Specifically:

For `hsr-profile`:
*   **Trigger and Options:** `/hsr-profile uid:<valid_hsr_uid>` is specified.
*   **Expected Output (Valid UID):** Details like UID, Nickname, Trailblaze Level, Equilibrium Level, Friends, Achievement Count, Signature, Characters in Showcase, avatar, and Enka.Network link are listed for verification.
*   **Invalid UID:** Instruction to test with an invalid UID and expect an error message.

For `hsr-character`:
*   **Trigger and Options:** `/hsr-character name:<character_name>` is specified.
*   **Autocomplete Testing:** Steps to test autocomplete by typing parts of a name and selecting from suggestions are included.
*   **Direct Input Testing:** Instruction to test by typing a full valid name.
*   **Expected Output (Valid Character):** Details like Name, Color, Thumbnail, Image, Rarity, Path, Element, Description, and Skills (name, type, description) are listed for verification.
*   **Non-existent Character:** Instruction to test with a non-existent name and expect an error.

For `hsr-gameinfo`:
*   **`events` Subcommand:**
    *   **Trigger:** `/hsr-gameinfo events` is specified.
    *   **Expected Output:** Describes the ideal embed contents (name, duration, description, URL).
    *   **Important Note for Tester:** Explicitly states that an "unsupported feature" message is an acceptable outcome due to library limitations.
    *   Includes verification against official sources if data is displayed.
*   **`banners` Subcommand:**
    *   **Trigger:** `/hsr-gameinfo banners` is specified.
    *   **Expected Output:** Describes the ideal embed contents (name, featured items, end times, image).
    *   **Important Note for Tester:** Explicitly states that an "unsupported feature" message is an acceptable outcome.
    *   Includes verification against official sources if data is displayed.

The "Prerequisites for Testing" section was also updated to include a note about `starrail.js` cache initialization. "General Notes" are present. The title of the document was updated to "Manual Testing Instructions for Fun, Info, and Game Commands".

Therefore, the `MANUAL_TESTING.md` file should already be complete according to the current subtask's requirements. No further modifications seem necessary.
