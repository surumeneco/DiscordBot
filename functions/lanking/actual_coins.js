const { get_userdata, execute_query } = require("../general/postgre_db.js");

const actual_coins = async (interaction) => {
  let text = "";
  const order =
    interaction.options.get("order").value == "best" ? "desc" : "asc";
  const query =
    "select *, coins::integer - debts::integer as actual_coins from M_USER order by actual_coins " +
    order +
    " limit $1";
  const lanking_data = await execute_query(query, [
    interaction.options.get("num").value,
  ]);

  text += "\n" + "実質コインの所持数ランキングだよ～";
  text += "\n" + "";
  for (let i = 0; i < lanking_data.rowCount; i++) {
    text +=
      "\n" +
      (i + 1) +
      "位：" +
      lanking_data.rows[i].user_name +
      ", " +
      lanking_data.rows[i].actual_coins +
      "枚";
  }

  await interaction.reply({
    content: text,
  });
};

module.exports = {
  actual_coins,
};
