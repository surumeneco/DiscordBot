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
  get_userdata,
  execute_query,
} = require("../../../../functions/general/postgre_db.js");
const {
  load_deck,
  new_trump_deck,
} = require("../../../../functions/casino/trump.js");

const command = new SlashCommandBuilder()
  .setName("btn-casino-hal-stop")
  .setDescription("やめる");

const execute = async (interaction) => {
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

  // ベットしたコインを回収
  let now_coins = parseFloat(userdata.rows[0].coins);
  const bet_coins = parseFloat(now_play_data.rows[0].now_bet);
  now_coins += bet_coins;
  await execute_query("update M_USER set coins = $1 where user_id = $2", [
    now_coins,
    interaction.user.id,
  ]);

  // スコアデータを取得
  const now_score = await execute_query(
    "select * from T_HIGHANDLOW_SCORE where user_id = $1",
    [interaction.user.id]
  );
  if (now_score.rowCount <= 0) {
    console.log("ERROR: Score data not found " + interaction.user.id + ".");
    return;
  }
  const game_num = parseFloat(now_score.rows[0].game_num);
  const total_bet = parseFloat(now_score.rows[0].total_bet);
  const total_return = parseFloat(now_score.rows[0].total_return);

  // スコアデータ更新
  const deck = load_deck(JSON.parse(now_play_data.rows[0].now_deck));
  if (deck.length + 1 < new_trump_deck.length) {
    await execute_query(
      "update T_HIGHANDLOW_SCORE set game_num = $1, total_return = $2 where user_id = $3",
      [game_num + 1, total_return + bet_coins, interaction.user.id]
    );
  } else {
    await execute_query(
      "update T_HIGHANDLOW_SCORE set total_bet = $1 where user_id = $2",
      [total_bet - bet_coins, interaction.user.id]
    );
  }

  // プレイデータリフレッシュ
  await execute_query("delete from W_HIGHANDLOW where user_id = $1", [
    interaction.user.id,
  ]);

  // メッセージを生成
  let text = "";
  text += "\n" + "**手に入れたコイン：" + bet_coins + "枚**";
  text += "\n" + "**現在の所持コイン：" + now_coins + "枚**";

  // メッセージを送信
  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

module.exports = {
  data: command,
  execute: execute,
};
