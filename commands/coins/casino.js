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
  .setName("casino")
  .setDescription("コインを使って遊べるよ")
  .addStringOption((option) =>
    option
      .setName("game")
      .setDescription("ゲームを選んでね")
      .setRequired(true)
      .addChoices(
        { name: "ハイ&ロー", value: "high_and_low" },
        { name: "ブラックジャック", value: "black_jack" },
        { name: "ポーカー", value: "poker" }
      )
  )
  .addNumberOption((option) =>
    option.setName("bet").setDescription("賭け金").setRequired(true)
  );

const casino = async (interaction) => {
  switch (interaction.options.get("game").value) {
    case "high_and_low":
      await high_and_low(interaction);
      break;
    case "black_jack":
      await black_jack(interaction);
      break;
    case "poker":
      await poker(interaction);
      break;
    default:
      await error(interaction);
      break;
  }
};

const high_and_low = async (interaction) => {
  await interaction.reply("未実装だよ～");
  // const button_join = new ButtonBuilder()
  //   .setLabel("参加")
  //   .setCustomId("ito_join")
  //   .setStyle(ButtonStyle.Primary);
  // const button_checked = new ButtonBuilder()
  //   .setLabel("参加を締め切ってゲームを始める")
  //   .setCustomId("ito_gamestart")
  //   .setStyle(ButtonStyle.Secondary);
  // await interaction.reply({
  //   content: "itoを始めるよ～",
  //   components: [
  //     new ActionRowBuilder().setComponents([button_join, button_checked]),
  //   ],
  // });
};

const black_jack = async (interaction) => {
  await interaction.reply("未実装だよ～");
};

const poker = async (interaction) => {
  await interaction.reply("未実装だよ～");
};

const error = async (interaction) => {
  await interaction.reply("???????");
};

module.exports = {
  data: command,
  execute: casino,
};
