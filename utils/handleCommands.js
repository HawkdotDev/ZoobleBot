const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const lootSystem = require("./handleLoot");

const apiKey = "AIzaSyA63lU5mwK1mJ9Z47Py54V3CkxjA4edGOY";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const handleInteractions = async (interaction) => {
  const jsonFileName = `${interaction.guild.name}_${interaction.guild.id}.json`;

  try {
    if (fs.existsSync(`./data/${jsonFileName}`)) {
      const serverData = JSON.parse(
        fs.readFileSync(`./data/${jsonFileName}`, "utf-8")
      );

      if (interaction.channelId === serverData.channelId) {
        if (interaction.commandName === "talk") {
          try {
            await interaction.reply({
              content: "Zooble is typing...",
              // ephemeral: true,
            });
            const prompt = `you are a young genZ bulter named Zooble. you are tasked to serve a millionaire by managing his discord server and aid your masters vigilante activities at night in the city called "Undercity".
            Reply appropiately to the following message that ${
              interaction.member.displayName
            } has sent/intended for you in a chat reply format (write only the reply in first person as Zooble) : "${
              interaction.options.get("message").value
            }"`;
            console.log(interaction.options.get("message").value);
            try {
              const res = await model.generateContent(prompt);
              const data = await res.response.text();

              await interaction.editReply({
                content: data,
                // ephemeral: false,
              });
              // console.log(data, prompt);
            } catch (error) {
              await interaction.editReply({
                content: `${error}`,
                ephemeral: true,
              });
              console.log(error, prompt);
            }
          } catch (error) {
            console.log(error);
          }
        } else if (interaction.commandName === "adventure") {
          try {
            interaction.reply(
              `${lootSystem.simulateLootDrops(
                interaction.options.get("drop_number").value,
                interaction.options.get("player_level").value
              )}`
            );
          } catch (error) {
            console.log(error);
          }
        } else if (interaction.commandName === "arcade") {
          try {
            interaction.reply(`arcade is under construction`);
          } catch (error) {
            console.log(error);
          }
        } else if (interaction.commandName === "setup") {
          if (
            interaction.member.permissions.has("ADMINISTRATOR" || condition)
          ) {
            try {
              interaction.reply(`setup is under construction`);
            } catch (error) {
              console.log(error.message);
            }
          } else {
            return interaction.reply({
              content: "You need administrator rights to run this command",
              ephemeral: true,
            });
          }
        }
      } else {
        return interaction.reply({
          content: "Not the channel Zooble works in",
          ephemeral: true,
        });
      }
    } else {
      console.log("setting up");
      if (interaction.commandName === "setup") {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
          return interaction.reply({
            content: "You need administrator rights to run this command",
            ephemeral: true,
          });
        } else {
          try {
            const jsonData = {
              server: interaction.guild.name,
              serverId: interaction.guildId,
              channelId: interaction.channelId,
              channelData: interaction.channel,
            };
            fs.writeFileSync(
              `./data/${jsonFileName}`,
              JSON.stringify(jsonData, null, 2),
              "utf-8"
            );
          } catch (error) {
            console.log(error.message);
            return;
          }
          interaction.reply(`setup completed successfully`);
        }
      } else {
        interaction.reply({
          content: `use /setup to set up Zooble first`,
          ephemeral: true,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { handleInteractions };
