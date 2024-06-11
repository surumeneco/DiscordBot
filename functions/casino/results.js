const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const { get_userdata, execute_query } = require("../general/postgre_db.js");

const win = async (
  choise,
  interaction,
  deck,
  now_card,
  old_card,
  bet_coins,
  next_coins,
  odds,
  now_coins
) => {
  let text = "";

  await execute_query(
    "update W_HIGHANDLOW set now_card = $1, now_deck = $2, now_bet = $3 where user_id = $4",
    [
      JSON.stringify(now_card),
      JSON.stringify(deck),
      next_coins,
      interaction.user.id,
    ]
  );

  text += "\n" + "成功！";
  text += "\n" + "返ってきたコインをそのままベットして続けるかい？";
  text += "\n" + "**選択：" + choise + "**";
  text += card_info(now_card, old_card);
  text += "\n" + "**ベットしたコイン：" + bet_coins + "枚**";
  text +=
    "\n" +
    "**返ってくるコイン：" +
    next_coins +
    "枚" +
    " (" +
    odds +
    "倍)" +
    "**";
  text += "\n" + "**現在の所持コイン：" + now_coins + "枚**";
  text += "\n" + "**残りのカード枚数：" + deck.length + "枚**";

  // ボタン定義
  const button_continue = new ButtonBuilder()
    .setLabel("続ける")
    .setCustomId("btn-casino-hal-continue")
    .setStyle(ButtonStyle.Primary);
  const button_stop = new ButtonBuilder()
    .setLabel("やめる")
    .setCustomId("btn-casino-hal-stop")
    .setStyle(ButtonStyle.Danger);

  await interaction.reply({
    content: text,
    components: [
      new ActionRowBuilder().setComponents([button_continue, button_stop]),
    ],
    ephemeral: true,
  });
};

const finish = async (
  choise,
  interaction,
  deck,
  now_card,
  old_card,
  bet_coins,
  next_coins,
  odds,
  now_coins
) => {
  let text = "";

  now_coins += next_coins;
  await execute_query("update M_USER set coins = $1 where user_id = $2", [
    now_coins,
    interaction.user.id,
  ]);

  await execute_query("delete from W_HIGHANDLOW where user_id = $1", [
    interaction.user.id,
  ]);

  text += "\n" + "成功！";
  text += "\n" + "今ので最後の1枚だったよ～！";
  text += "\n" + "また遊んでね。";
  text += "\n" + "**選択：" + choise + "**";
  text += card_info(now_card, old_card);
  text += "\n" + "**ベットしたコイン：" + bet_coins + "枚**";
  text +=
    "\n" +
    "**手に入れたコイン：" +
    next_coins +
    "枚" +
    " (" +
    odds +
    "倍)" +
    "**";
  text += "\n" + "**現在の所持コイン：" + now_coins + "枚**";
  text += "\n" + "**残りのカード枚数：" + deck.length + "枚！**";

  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

const lose = async (
  choise,
  interaction,
  deck,
  now_card,
  old_card,
  bet_coins,
  next_coins,
  odds,
  now_coins
) => {
  let text = "";

  await execute_query("delete from W_HIGHANDLOW where user_id = $1", [
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

  // スコアデータ更新
  await execute_query(
    "update T_HIGHANDLOW_SCORE set game_num = $1 where user_id = $2",
    [game_num + 1, interaction.user.id]
  );

  text += "\n" + "残念～。";
  text += "\n" + "また遊んでね。";
  text += "\n" + "**選択：" + choise + "**";
  text += card_info(now_card, old_card);
  text += "\n" + "**ベットしたコイン：" + bet_coins + "枚**";
  text += "\n" + "**現在の所持コイン：" + now_coins + "枚**";
  text += "\n" + "**残りのカード枚数：" + deck.length + "枚**";

  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

const card_info = (now_card, old_card) => {
  let text = "";
  text += "\n" + "**現在のカード：" + card_text(old_card) + "**";
  text += "\n" + "**引いたカード：" + card_text(now_card) + "**";
  return text;
};

const card_text = (card) => {
  let text = "";
  text += ":" + card.suit + ":";
  switch (card.number) {
    case 1:
      text += "A";
      break;
    case 11:
      text += "J";
      break;
    case 12:
      text += "Q";
      break;
    case 13:
      text += "K";
      break;
    default:
      text += card.number;
      break;
  }
  return text;
};

module.exports = {
  win,
  finish,
  lose,
};
