require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const cli = require("nodemon/lib/cli/index.js");
// const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.login(process.env.KONATA_TOKEN);

client.once("ready", async () => {
  // コマンドを登録
  await require("./systems/deploy_commands.js").deploy_commands(
    "./commands",
    client
  );

  // コマンドを読込
  client.commands = new Collection();
  await require("./systems/load_commands.js").load_commands(
    "../commands",
    client
  );

  console.log(`SYSTEM: Logged in as ${client.user.tag}`);
});

// コマンドに反応
client.on("interactionCreate", async (interaction) => {
  require("./systems/interact_commands.js").interact_commands(interaction);
});
