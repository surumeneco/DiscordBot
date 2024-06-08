const {
  get_userdata,
  execute_query,
} = require("../../functions/general/postgre_db.js");
const {
  format_date,
  format_date_only,
} = require("../../functions/general/datetime.js");

const login = async (interaction) => {
  let reply_text = "";
  let now_coins = 0;
  const result = await get_userdata(interaction.user.id);
  if (result.rowCount > 0) {
    now_coins = parseFloat(result.rows[0].coins);
    if (
      format_date_only(result.rows[0].last_login) < format_date_only(new Date())
    ) {
      now_coins += 10;
      await execute_query("update M_USER set coins = $1 where user_id = $2", [
        now_coins,
        interaction.user.id,
      ]);
      reply_text += "\nログインありがと～！";
      reply_text += "\nボーナスに10コインプレゼント (=ω=.)";
    } else {
      reply_text += "\n今日はもうログインしてるみたいだね～";
    }
    await execute_query(
      "update M_USER set last_login = $1 where user_id = $2",
      [format_date(new Date()), interaction.user.id]
    );
  } else {
    await execute_query(
      "insert into M_USER (user_id, last_login, coins, debts) values ($1, $2, 100, 0)",
      [interaction.user.id, format_date(new Date())]
    );
    now_coins = 100;
    reply_text += "\n新規ログインありがとね～";
    reply_text += "\n特典に100コインをプレゼント～";
  }
  reply_text += "\n現在のコイン：" + now_coins + "枚";
  await interaction.reply(reply_text);
};

module.exports = {
  login,
};
