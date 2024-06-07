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
  if (result) {
    await execute_query(
      "update W_HIGHANDLOW set now_card = $1, now_deck = $2, now_bet = $3 where user_id = $4",
      [
        JSON.stringify(now_card),
        JSON.stringify(deck),
        next_coins,
        interaction.user.id,
      ]
    );
  } else {
    await execute_query("delete from W_HIGHANDLOW where user_id = $1", [
      interaction.user.id,
    ]);
  }

  text += "\n" + "**現在のカード：" + ":" + old_card.suit + ":";
  switch (old_card.number) {
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
      text += old_card.number;
      break;
  }
  text += "**";
  text += "\n" + "**引いたカード：" + ":" + now_card.suit + ":";
  switch (now_card.number) {
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
      text += now_card.number;
      break;
  }
  text += "**";

  // メッセージを生成
  if (result) {
    text += "\n" + "成功！";
    text += "\n" + "返ってきたコインをそのままベットして続けるかい？";
  } else {
    text += "\n" + "残念～。";
    text += "\n" + "また遊んでね。";
  }

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

  // ボタン定義
  const button_continue = new ButtonBuilder()
    .setLabel("続ける")
    .setCustomId("btn-casino-hal-continue")
    .setStyle(ButtonStyle.Primary);
  const button_stop = new ButtonBuilder()
    .setLabel("やめる")
    .setCustomId("btn-casino-hal-stop")
    .setStyle(ButtonStyle.Danger);

  // メッセージを送信
  if (result) {
    await interaction.reply({
      content: text,
      components: [
        new ActionRowBuilder().setComponents([button_continue, button_stop]),
      ],
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: text,
      ephemeral: true,
    });
  }
};

const odds_low = [
  15.5, 7.5, 4.85, 3.55, 2.8, 2.35, 2, 1.75, 1.5, 1.3, 1.15, 1.05, 1,
];

module.exports = {
  data: command,
  execute: execute,
};
