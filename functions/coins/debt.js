const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");
const {
  userdata_not_found_public,
} = require("../../functions/general/login.js");

const debt = async (interaction) => {
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
  const debt_amt = interaction.options.get("amt")
    ? Math.floor(interaction.options.get("amt").value)
    : null;
  const debt_interest = Math.random(debt_amt * 0.1);
  if (debt_amt && debt_amt > 0) {
    now_coins += debt_amt;
    now_debts += debt_amt + debt_interest;
    await execute_query(
      "update M_USER set coins = $1, debts = $2 where user_id = $3",
      [now_coins, now_debts, interaction.user.id]
    );
    reply_text +=
      "\n" +
      debt_amt +
      "コイン借金したよ～" +
      " (内利息" +
      debt_interest +
      "枚)";
  } else {
    reply_text += "\n" + "現在の借金状況はこんな感じだよ～";
  }

  reply_text += "\n現在のコイン数：" + now_coins + "枚";
  reply_text += "\n現在の借金：" + now_debts + "枚";
  reply_text += "\n実質コイン数：" + (now_coins - now_debts) + "枚";
  await interaction.reply(reply_text);
};

module.exports = {
  debt,
};
