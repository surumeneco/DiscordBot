const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");

const command = new SlashCommandBuilder()
  .setName("ito")
  .setDescription("itoが遊べるよ～")
  .addStringOption((option) =>
    option
      .setName("control")
      .setDescription("ゲームコントローラ")
      .setRequired(true)
      .addChoices(
        { name: "始める", value: "start" },
        { name: "終わる", value: "end" }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("time")
      .setDescription("1ラウンドの制限時間(デフォルト:無し)")
      .setRequired(false)
  );

const ito_controller = async (interaction) => {
  switch (interaction.options.get("control").value) {
    case "start":
      await start(interaction);
      break;
    case "end":
      await end(interaction);
      break;
    default:
      await error(interaction);
      break;
  }
};

const start = async (interaction) => {
  const button_join = new ButtonBuilder()
    .setLabel("参加")
    .setCustomId("ito_join")
    .setStyle(ButtonStyle.Primary);
  const button_checked = new ButtonBuilder()
    .setLabel("参加を締め切ってゲームを始める")
    .setCustomId("ito_gamestart")
    .setStyle(ButtonStyle.Secondary);
  await interaction.reply({
    content: "itoを始めるよ～",
    components: [
      new ActionRowBuilder().setComponents([button_join, button_checked]),
    ],
  });
};

const end = async (interaction) => {
  await interaction.reply("itoを終わるよ～");
};

const error = async (interaction) => {
  await interaction.reply("???????");
};

module.exports = {
  data: command,
  execute: ito_controller,
};
