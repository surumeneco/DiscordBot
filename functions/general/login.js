const userdata_not_found = async (interaction) => {
  let text = "";
  text += "\n" + "あれれ？まだログインしてないみたいだけど……";
  text += "\n" + "ログインしてからもう一度試してね～！";
  text += "\n" + "/coins control:ログイン";
  await interaction.reply({
    content: text,
    ephemeral: true,
  });
};

const userdata_not_found_public = async (interaction) => {
  let text = "";
  text += "\n" + "あれれ？まだログインしてないみたいだけど……";
  text += "\n" + "ログインしてからもう一度試してね～！";
  text += "\n" + "/coins control:ログイン";
  await interaction.reply({
    content: text,
  });
};

module.exports = {
  userdata_not_found,
  userdata_not_found_public,
};
