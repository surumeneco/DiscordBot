const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");
const { format_date } = require("../../functions/general/datetime.js");

const info = async (interaction) => {
  const result = await get_userdata(interaction.user.id);
  if (result.rowCount > 0) {
    let reply_text = "君の今の情報はこんな感じだよ～";
    reply_text += "\n<@" + result.rows[0].user_id + ">";
    reply_text +=
      "\n最終ログイン日時：" + format_date(result.rows[0].last_login);
    const now_coins = parseFloat(result.rows[0].coins);
    const now_debts = parseFloat(result.rows[0].debts);
    reply_text += "\n現在のコイン数：" + now_coins + "枚";
    reply_text += "\n現在の借金：" + now_debts + "枚";
    reply_text += "\n実質コイン数：" + (now_coins - now_debts) + "枚";
    await interaction.reply(reply_text);
  } else {
    await interaction.reply("君、ログインしたことないみたいだけど……");
  }
};

module.exports = {
  info,
};
