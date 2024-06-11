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
  .setName("btn-casino-hal-high")
  .setDescription("ハイ");

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
  const result = old_card.number <= now_card.number;
  const odds = result ? odds_high[old_card.number - 1] : 0;
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
    "update T_HIGHANDLOW_SCORE set game_num = $1 where user_id = $3",
    [play_num + 1, interaction.user.id]
  );

  switch (sequence) {
    case "win":
      win(
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
      finish(
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
      lose(
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

const win = async (
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
  text += "\n" + "**選択：ハイ**";
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
  text += "\n" + "**選択：ハイ**";
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
    "update T_HIGHANDLOW_SCORE set game_num = $1 where user_id = $3",
    [game_num + 1, interaction.user.id]
  );

  text += "\n" + "残念～。";
  text += "\n" + "また遊んでね。";
  text += "\n" + "**選択：ハイ**";
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

const odds_high = [
  1, 1.05, 1.15, 1.3, 1.5, 1.75, 2, 2.35, 2.8, 3.55, 4.85, 7.5, 15.5,
];

module.exports = {
  data: command,
  execute: execute,
};
