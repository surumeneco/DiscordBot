const { SlashCommandBuilder } = require("discord.js");

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tester")
    .setDescription("これはテスト用コマンド2")
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("言語を指定します。")
        .setRequired(true) //trueで必須、falseで任意
        .addChoices(
          { name: "Japanese", value: "ja" },
          { name: "English", value: "en" }
        )
    ),
  execute: async function (interaction) {
    await interaction.reply("呼んだ～？");
  },
};
