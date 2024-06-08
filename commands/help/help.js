const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");

const command = new SlashCommandBuilder()
  .setName("help")
  .setDescription("botについての説明だよ");

const help = async (interaction) => {
  let reply_text = "今の機能はこんな感じだよ～";
  reply_text += "\n" + "```";
  reply_text += "\n" + "・/coins：コインを管理できるよ";
  reply_text += "\n" + "control:ログイン";
  reply_text += "\n" + "一日一回ログインボーナスとして10コイン貰えるよ";
  reply_text += "\n" + "control:情報";
  reply_text += "\n" + "コインの数や借金額を確認できるよ";
  reply_text += "\n" + "control:借金";
  reply_text += "\n" + "未実装だよ";
  reply_text += "\n" + "control:返済";
  reply_text += "\n" + "未実装だよ";
  reply_text += "\n" + "```";
  reply_text += "\n" + "```";
  reply_text += "\n" + "・/casino：コインを使って遊べるよ";
  reply_text += "\n" + "game:ハイ&ロー";
  reply_text += "\n" + "ハイ&ローが遊べるよ";
  reply_text += "\n" + "game:ブラックジャック";
  reply_text += "\n" + "未実装だよ";
  reply_text += "\n" + "game:ポーカー";
  reply_text += "\n" + "未実装だよ";
  reply_text += "\n" + "```";
  reply_text += "\n" + "```";
  reply_text += "\n" + "・/ito：未実装";
  reply_text += "\n" + "今後itoをdiscordでプレイできるようにするつもりだよ";
  reply_text += "\n" + "```";
  await interaction.reply(reply_text);
};

module.exports = {
  data: command,
  execute: help,
};
