const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const deploy_commands = async (path, client) => {
  // commandsフォルダからjsで終わるファイルを取得
  const commands = [];
  const commandFiles = fs
    .readdirSync(path)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    console.log(`.${path}/${file}`);
    const command = require(`.${path}/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.KONATA_TOKEN);

  try {
    // コマンドを全削除
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    guild.commands.set([]);

    // コマンドを登録
    const data = await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      {
        body: commands,
      }
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};

module.exports = {
  deploy_commands,
};
