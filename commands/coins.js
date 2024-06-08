const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const { login } = require("../functions/coins/login.js");
const { info } = require("../functions/coins/info.js");
const { debt } = require("../functions/coins/debt.js");
const { repay } = require("../functions/coins/repay.js");

const command = new SlashCommandBuilder()
  .setName("coins")
  .setDescription("コインを管理できるよ")
  .addStringOption((option) =>
    option
      .setName("control")
      .setDescription("何をするか選んでね")
      .setRequired(true)
      .addChoices(
        { name: "ログイン", value: "login" },
        { name: "ユーザ情報", value: "info" },
        { name: "借金", value: "debt" },
        { name: "返済", value: "repay" }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("amt")
      .setDescription("借金額や返済額を指定できるよ")
      .setRequired(false)
  );

const execute = async (interaction) => {
  switch (interaction.options.get("control").value) {
    case "login":
      await login(interaction);
      break;
    case "info":
      await info(interaction);
      break;
    case "debt":
      await debt(interaction);
      break;
    case "repay":
      await repay(interaction);
      break;
    default:
      await error(interaction);
      break;
  }
};

const error = async (interaction) => {
  await interaction.reply("???????");
};

module.exports = {
  data: command,
  execute: execute,
};
