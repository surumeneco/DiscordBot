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
      .setName("genre")
      .setDescription("何のランキングを見るか選んでね")
      .setRequired(false)
      .addChoices(
        { name: "所持コイン数", value: "coins" },
        { name: "実質コイン数", value: "debts" },
        { name: "借金コイン数", value: "actual_coins" },
        { name: "借金回数", value: "debt_num" },
        { name: "ハイアンドローゲーム回数", value: "highandlow_game_num" },
        {
          name: "ハイアンドロー平均連続プレイ回数",
          value: "highandlow_avr_play_num",
        },
        { name: "ハイアンドロー総ベット額", value: "highandlow_total_bet" },
        { name: "ハイアンドロー総回収額", value: "highandlow_total_return" },
        { name: "ハイアンドロー回収率", value: "highandlow_return_rate" }
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
      .setDescription("何位まで表示するか選べるよ(1～10)")
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
    case "debt_num":
      await debt_num(interaction);
      break;
    case "highandlow_avr_play_num":
      await highandlow_avr_play_num(interaction);
      break;
    case "highandlow_total_bet":
      await highandlow_total_bet(interaction);
      break;
    case "highandlow_total_return":
      await highandlow_total_return(interaction);
      break;
    case "highandlow_return_rate":
      await highandlow_return_rate(interaction);
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
