const { Client, GatewayIntentBits, REST, Routes  } = require("discord.js");
const fs = require("fs");
const { handleInteractions } = require("./utils/handleCommands");
const { setupBot, setupCommands } = require("./utils/setup");

require("dotenv").config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.TOKEN);

// setupBot(client);
setupCommands(rest);

client.on("interactionCreate", handleInteractions);
