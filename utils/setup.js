const fs = require("fs");
const { ApplicationCommandOptionType, Routes, REST } = require("discord.js");

const setupBot = (client) => {
  client.on("ready", async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN); // Replace with your bot token

    try {
      await rest.put(
        Routes.applicationCommands(process.env.APP_ID), // Use application ID for global commands
        { body: command } // Assuming 'command' is defined elsewhere with required properties
      );
      console.log("Command registered successfully!");
    } catch (error) {
      console.error("Error registering command:", error);
    }
  });
};

const setupCommands = (rest) => {
  const commands = [
    {
      name: "setup",
      description: "sets up Zooble",
    },
    {
      name: "joke",
      description: "Zooble replies with a joke",
    },
    {
      name: "adventure",
      description: "zooble finds artifacts for you based on your level",
      options: [
        {
          name: "player_level", // Corrected name to lowercase with underscores
          description: "your level",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "drop_number", // Corrected name to lowercase with underscores
          description: "number of item drops you want",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "arcade",
      description:
        "Zooble starts a game of your choice from the arcade for you",
    },
    {
      name: "talk",
      description: "talk with Zooble",
      options: [
        {
          name: "message",
          description: "type a message for Zooble",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ];

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(process.env.APP_ID), {
        body: commands,
      });
      console.log("Commands registered successfully!");
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  })();
};

module.exports = { setupBot, setupCommands };
