const { REST, Routes } = require("discord.js");
require("dotenv").config();
const reader = require("../functions/general/read_directory");

const deploy_commands = async (path, client) => {
  // commandsフォルダからjsで終わるファイルを取得
  const commands = [];
  const commandFiles = reader
    .readSubDirSync(path)
    .filter((file) => file.endsWith(".js"));

  // 取得したファイルの中身を読込
  const path_text = path.split("/")[0];
  for (const file of commandFiles) {
    console.log(`.${path_text}/${file}`);
    const command = require(`.${path_text}/${file}`);
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
