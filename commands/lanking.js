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
      .setDescription("ランキングのジャンルを選んでね")
      .setRequired(true)
      .addChoices(
        { name: "コイン", value: "coins" },
        { name: "カジノ", value: "casino" }
      )
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("何のランキングを見るか選んでね")
      .setRequired(true)
      .setAutocomplete(true)
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

const autocomplete = async (interaction) => {
  const genre = interaction.options.getString("genre");
  let choices = [];

  if (genre === "coins") {
    choices = [
      { name: "所持コイン数", value: "coins" },
      { name: "実質コイン数", value: "debts" },
      { name: "借金コイン数", value: "actual_coins" },
      { name: "借金回数", value: "debt_num" },
    ];
  } else if (genre === "casino") {
    choices = [
      { name: "ゲーム回数", value: "game_num" },
      {
        name: "平均連続プレイ回数",
        value: "avr_play_num",
      },
      { name: "総ベット額", value: "total_bet" },
      { name: "総回収額", value: "total_return" },
      { name: "回収率", value: "return_rate" },
    ];
  }

  const focusedValue = interaction.options.getFocused();
  const filtered = choices.filter(
    (choice) => choice.name.startsWith(focusedValue)
    // choice.value.startsWith(focusedValue) // どっち？
  );
  await interaction.respond(filtered);
};

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
  autocomplete: autocomplete,
  execute: execute,
};
