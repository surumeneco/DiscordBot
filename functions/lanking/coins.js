const { get_userdata, execute_query } = require("../general/postgre_db.js");

const coins = async (interaction) => {
  const order =
    interaction.options.get("order").value == "best" ? "asc" : "desc";
  const has_data = await execute_query(
    "select * from M_USER order by coins $1",
    [order]
  );
};

module.exports = {
  coins,
};
