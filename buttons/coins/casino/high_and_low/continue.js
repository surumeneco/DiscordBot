const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const {
  trump_card,
  suits,
  load_card,
  load_deck,
} = require("../../../../functions/casino/trump.js");
const {
  get_userdata,
  execute_query,
} = require("../../../../functions/general/postgre_db.js");
const { game_play } = require("../../../../functions/casino/high_and_low.js");

const command = new SlashCommandBuilder()
  .setName("btn-casino-hal-continue")
  .setDescription("ゲームを続ける");

const execute = async (interaction) => {
  let text = "";

  // ユーザデータを取得
  const userdata = await get_userdata(interaction.user.id);
  if (userdata.rowCount <= 0) {
    console.log("ERROR: User data not found " + interaction.user.id + ".");
    return;
  }

  // プレイデータを取得
  const now_play_data = await execute_query(
    "select * from W_HIGHANDLOW where user_id = $1",
    [interaction.user.id]
  );
  if (now_play_data.rowCount <= 0) {
    console.log("ERROR: Play data not found " + interaction.user.id + ".");
    return;
  }

  // 現在情報を取得
  const now_coins = parseFloat(userdata.rows[0].coins);
  const bet_coins = parseFloat(now_play_data.rows[0].now_bet);
  const now_card = load_card(JSON.parse(now_play_data.rows[0].now_card));

  await game_play(interaction, now_card, bet_coins, now_coins);
};

module.exports = {
  data: command,
  execute: execute,
};
