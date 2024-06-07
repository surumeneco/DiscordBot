const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");
const {
  new_trump_deck,
  shuffle_trumps,
} = require("../../functions/casino/trump.js");

const high_and_low = async (interaction) => {
  // ログイン済みか確認
  const userdata = await get_userdata(interaction.user.id);
  if (userdata.rowCount <= 0) {
    no_userdata(interaction);
    return;
  }

  // ベットできるか確認
  let now_coins = parseFloat(userdata.rows[0].coins);
  const bet_coins = interaction.options.get("bet").value;
  if (now_coins < bet_coins) {
    not_enough_coins(interaction);
    return;
  }

  // 既にプレイ中か確認
  const has_data = await execute_query(
    "select * from W_HIGHANDLOW where user_id = $1",
    [interaction.user.id]
  );
  if (has_data.rowCount > 0) {
    await already_playing(interaction, has_data);
    return;
  }

  // プレイ開始
  await new_game(interaction, now_coins, bet_coins);
};

const no_userdata = async (interaction) => {
  let text = "";
  text += "\n" + "あれれ？まだログインしてないみたいだけど……";
  text += "\n" + "ログインしてからもう一度試してね～！";
  text += "\n" + "/coins control:ログイン";
  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

const not_enough_coins = async (interaction) => {
  let text = "";
  text += "\n" + "おっと、ベットするためのコインが足りてないみたいだねぇ。";
  text += "\n" + "ベットを減らすか、借金してから挑戦してね～。";
  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

const already_playing = async (interaction, now_play_data) => {
  let text = "";
  text += "\n" + "おや？既にプレイ中みたいだけど、";
  text += "\n" + "前回の続きをやるかい？";
  text +=
    "\n" +
    "**現在のベットコイン：" +
    parseFloat(now_play_data.rows[0].now_bet) +
    "枚**";

  // ボタン定義
  const button_continue = new ButtonBuilder()
    .setLabel("続きからやる")
    .setCustomId("btn-casino-hal-continue")
    .setStyle(ButtonStyle.Primary);
  const button_stop = new ButtonBuilder()
    .setLabel("やめる")
    .setCustomId("btn-casino-hal-stop")
    .setStyle(ButtonStyle.Danger);

  // メッセージを送信
  await interaction.reply({
    content: text,
    components: [
      new ActionRowBuilder().setComponents([button_continue, button_stop]),
    ],
    ephemeral: true,
  });
};

const new_game = async (interaction, now_coins, bet_coins) => {
  const deck = shuffle_trumps(new_trump_deck());
  const now_card = deck.pop();

  // 所持コインを減らす
  now_coins -= bet_coins;
  await execute_query("update M_USER set coins = $1 where user_id = $2", [
    now_coins,
    interaction.user.id,
  ]);

  // プレイデータリフレッシュ
  await execute_query("delete from W_HIGHANDLOW where user_id = $1", [
    interaction.user.id,
  ]);
  await execute_query(
    "insert into W_HIGHANDLOW (user_id, now_card, now_deck, now_bet) values ($1, $2, $3, $4)",
    [
      interaction.user.id,
      JSON.stringify(now_card),
      JSON.stringify(deck),
      bet_coins,
    ]
  );

  await game_play(interaction, now_card, bet_coins, now_coins);
};

const game_play = async (interaction, now_card, bet_coins, now_coins) => {
  let text = "";
  text += "\n" + "ハイかローか選んでね";
  text += "\n" + "";
  text += "\n" + "**現在のカード：" + ":" + now_card.suit + ":";
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
  text += "\n" + "**現在のベットコイン：" + bet_coins + "枚**";
  text += "\n" + "**現在の所持コイン：" + now_coins + "枚**";
  text += "\n" + "```";
  text += "\n" + "カードの順番";
  text += "\n" + "小さい← A 2 3 4 5 6 7 8 9 10 J Q K →大きい";
  text += "\n" + "ハイ：現在のカード以上の数字";
  text += "\n" + "ロー：現在のカード以下の数字";
  text += "\n" + "```";

  // ボタン定義
  const button_high = new ButtonBuilder()
    .setLabel("ハイ")
    .setCustomId("btn-casino-hal-high")
    .setStyle(ButtonStyle.Danger);
  const button_low = new ButtonBuilder()
    .setLabel("ロー")
    .setCustomId("btn-casino-hal-low")
    .setStyle(ButtonStyle.Primary);
  const button_stop = new ButtonBuilder()
    .setLabel("やめる")
    .setCustomId("btn-casino-hal-stop")
    .setStyle(ButtonStyle.Secondary);

  // メッセージを送信
  await interaction.reply({
    content: text,
    components: [
      new ActionRowBuilder().setComponents([
        button_high,
        button_low,
        button_stop,
      ]),
    ],
    ephemeral: true,
  });
};

module.exports = {
  high_and_low,
  new_game,
  game_play,
};
