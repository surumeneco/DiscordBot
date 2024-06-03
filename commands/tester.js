const { SlashCommandBuilder } = require("discord.js");

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tester")
    .setDescription("これはテスト用コマンド2"),
  execute: async function (interaction) {
    await interaction.reply("呼んだ～？");
  },
};
