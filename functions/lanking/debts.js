const { get_userdata, execute_query } = require("../general/postgre_db.js");

const debts = async (interaction) => {
  const result = await get_userdata(interaction.user.id);
};

module.exports = {
  debts,
};
