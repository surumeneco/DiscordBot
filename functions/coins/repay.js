const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");

const repay = async (interaction) => {
  // ログイン済みか確認
  const userdata = await get_userdata(interaction.user.id);
  if (userdata.rowCount <= 0) {
    userdata_not_found_public(interaction);
    return;
  }

  let reply_text = "";
  reply_text += "\n<@" + userdata.rows[0].user_id + ">";

  let now_coins = parseFloat(userdata.rows[0].coins);
  let now_debts = parseFloat(userdata.rows[0].debts);
  let repay_amt = interaction.options.get("amt")
    ? Math.floor(interaction.options.get("amt").value)
    : null;
  if (repay_amt && repay_amt > 0) {
    if (now_debts <= 0) {
      reply_text += "\n" + "君は今借金してないみたいだけど……";
      reply_text += "\n" + "ちなみに現在の借金状況はこんな感じだよ～";
    } else {
      repay_amt = now_debts < repay_amt ? now_debts : repay_amt;
      now_coins -= repay_amt;
      now_debts -= repay_amt;
      await execute_query(
        "update M_USER set coins = $1, debts = $2 where user_id = $3",
        [now_coins, now_debts, interaction.user.id]
      );
      reply_text += "\n" + repay_amt + "コイン返済したよ～";
    }
  } else {
    reply_text += "\n" + "現在の借金状況はこんな感じだよ～";
  }

  reply_text += "\n現在のコイン数：" + now_coins + "枚";
  reply_text += "\n現在の借金：" + now_debts + "枚";
  reply_text += "\n実質コイン数：" + (now_coins - now_debts) + "枚";
  await interaction.reply(reply_text);
};

module.exports = {
  repay,
};
