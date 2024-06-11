const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");
const { format_date } = require("../../functions/general/datetime.js");

const info = async (interaction) => {
  const userdata = await get_userdata(interaction.user.id);
  if (userdata.rowCount > 0) {
    // 基本情報
    let reply_text = "君の今の情報はこんな感じだよ～";
    reply_text += "\n<@" + userdata.rows[0].user_id + ">";
    reply_text += "\n名前：" + userdata.rows[0].user_name;
    reply_text +=
      "\n最終ログイン日時：" + format_date(userdata.rows[0].last_login);
    const now_coins = parseFloat(userdata.rows[0].coins);
    const now_debts = parseFloat(userdata.rows[0].debts);
    const debt_num = parseFloat(userdata.rows[0].debt_num);
    reply_text += "\n現在のコイン数：" + now_coins + "枚";
    reply_text += "\n現在の借金：" + now_debts + "枚";
    reply_text += "\n実質コイン数：" + (now_coins - now_debts) + "枚";
    reply_text += "\n借金回数：" + debt_num + "回";

    // ハイアンドロー情報
    const now_score = await execute_query(
      "select * from T_HIGHANDLOW_SCORE where user_id = $1",
      [interaction.user.id]
    );
    if (now_score.rowCount > 0) {
      const game_num = parseFloat(now_score.rows[0].game_num);
      const play_num = parseFloat(now_score.rows[0].play_num);
      const total_bet = parseFloat(now_score.rows[0].total_bet);
      const total_return = parseFloat(now_score.rows[0].total_return);
      const avr_play_num = game_num > 0 ? play_num / game_num : 0;
      const avr_bet = game_num > 0 ? total_bet / game_num : 0;
      const avr_return = game_num > 0 ? total_return / game_num : 0;
      reply_text += "\n" + "```";
      reply_text += "\n" + "【ハイアンドロー】";
      reply_text += "\n" + "ゲーム回数：" + game_num + "回";
      reply_text += "\n" + "平均継続回数：" + avr_play_num + "回";
      reply_text += "\n" + "総ベットコイン：" + total_bet + "枚";
      reply_text += "\n" + "平均ベットコイン：" + avr_bet + "枚";
      reply_text += "\n" + "総回収コイン：" + total_return + "枚";
      reply_text += "\n" + "平均回収コイン：" + avr_return + "枚";
      reply_text += "\n" + "```";
    }
    await interaction.reply(reply_text);
  } else {
    await interaction.reply("君、ログインしたことないみたいだけど……");
  }
};

module.exports = {
  info,
};
