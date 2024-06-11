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
  win,
  finish,
  lose,
} = require("../../../../functions/casino/results.js");
const {
  get_userdata,
  execute_query,
} = require("../../../../functions/general/postgre_db.js");

const command = new SlashCommandBuilder()
  .setName("btn-casino-hal-low")
  .setDescription("ロー");

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
  const deck = load_deck(JSON.parse(now_play_data.rows[0].now_deck));
  const old_card = load_card(JSON.parse(now_play_data.rows[0].now_card));

  // 結果を判定
  const now_card = deck.pop();
  const result = now_card.number <= old_card.number;
  const odds = result ? odds_low[old_card.number - 1] : 0;
  const next_coins = Math.round(bet_coins * odds);
  const sequence = result ? (deck.length > 0 ? "win" : "finish") : "lose";

  // スコアデータを取得
  const now_score = await execute_query(
    "select * from T_HIGHANDLOW_SCORE where user_id = $1",
    [interaction.user.id]
  );
  if (now_score.rowCount <= 0) {
    console.log("ERROR: Score data not found " + interaction.user.id + ".");
    return;
  }

  // スコアデータ更新
  const play_num = parseFloat(now_score.rows[0].play_num);
  await execute_query(
    "update T_HIGHANDLOW_SCORE set play_num = $1 where user_id = $2",
    [play_num + 1, interaction.user.id]
  );

  switch (sequence) {
    case "win":
      await win(
        "ロー",
        interaction,
        deck,
        now_card,
        old_card,
        bet_coins,
        next_coins,
        odds,
        now_coins
      );
      break;
    case "finish":
      await finish(
        "ロー",
        interaction,
        deck,
        now_card,
        old_card,
        bet_coins,
        next_coins,
        odds,
        now_coins
      );
      break;
    case "lose":
      await lose(
        "ロー",
        interaction,
        deck,
        now_card,
        old_card,
        bet_coins,
        next_coins,
        odds,
        now_coins
      );
      break;
    default:
      break;
  }
};

const odds_low = [
  15.5, 7.5, 4.85, 3.55, 2.8, 2.35, 2, 1.75, 1.5, 1.3, 1.15, 1.05, 1,
];

module.exports = {
  data: command,
  execute: execute,
};
