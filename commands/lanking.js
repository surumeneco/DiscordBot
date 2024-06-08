const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const { coins } = require("../functions/lanking/coins.js");
const { debts } = require("../functions/lanking/debts.js");
const { actual_coins } = require("../functions/lanking/actual_coins.js");

const command = new SlashCommandBuilder()
  .setName("lanking")
  .setDescription("色々なランキングが見れるよ")
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("何をするか選んでね")
      .setRequired(true)
      .addChoices(
        { name: "所持コイン数", value: "coins" },
        { name: "実質コイン数", value: "debts" },
        { name: "借金コイン数", value: "actual_coins" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("order")
      .setDescription("ランキングの順番を選べるよ")
      .setRequired(true)
      .addChoices(
        { name: "ベスト", value: "best" },
        { name: "ワースト", value: "worst" }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("num")
      .setDescription("何位まで表示するか選べるよ")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(10)
  );

const execute = async (interaction) => {
  switch (interaction.options.get("type").value) {
    case "coins":
      await coins(interaction);
      break;
    case "debts":
      await debts(interaction);
      break;
    case "actual_coins":
      await actual_coins(interaction);
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
