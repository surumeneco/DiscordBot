const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const {
  get_userdata,
  execute,
} = require("../../functions/general/postgre_db.js");
const { datetime } = require("../../functions/general/datetime.js");

const command = new SlashCommandBuilder()
  .setName("coins")
  .setDescription("コインを管理できるよ")
  .addStringOption((option) =>
    option
      .setName("control")
      .setDescription("何をするか選んでね")
      .setRequired(true)
      .addChoices(
        { name: "ログイン", value: "login" },
        { name: "ユーザ情報", value: "info" },
        { name: "借金", value: "debt" },
        { name: "返済", value: "repay" }
      )
  );

const coins = async (interaction) => {
  switch (interaction.options.get("control").value) {
    case "login":
      await login(interaction);
      break;
    case "info":
      await info(interaction);
      break;
    case "debt":
      await debt(interaction);
      break;
    case "repay":
      await repay(interaction);
      break;
    default:
      await error(interaction);
      break;
  }
};

const login = async (interaction) => {
  let reply_text = "";
  let now_coins = 0;
  const result = await get_userdata(interaction.user.id);
  if (result.rowCount > 0) {
    await execute("update M_USER set last_login = $1 where user_id = $2", [
      datetime.format(new Date()),
      interaction.user.id,
    ]);
    now_coins = parseFloat(result.rows[0].coins);

    if (result.rows[0].last_login < datetime.format(new Date())) {
      now_coins += 10;
      await execute("update M_USER set coins = $1 where user_id = $2", [
        now_coins,
        interaction.user.id,
      ]);
      reply_text += "\nログインありがと～！";
      reply_text += "\nボーナスに10コインプレゼント (=ω=.)";
    } else {
      reply_text += "\n今日はもうログインしてるみたいだね～";
    }
  } else {
    await execute(
      "insert into M_USER (user_id, last_login, coins, debts) values ($1, $2, 100, 0)",
      [interaction.user.id, datetime.format(new Date())]
    );
    now_coins = 100;
    reply_text += "\n新規ログインありがとね～";
    reply_text += "\n特典に100コインをプレゼント～";
  }
  reply_text += "\n現在のコイン：" + now_coins + "枚";
  await interaction.reply(reply_text);
};

const info = async (interaction) => {
  const result = await get_userdata(interaction.user.id);
  if (result.rowCount > 0) {
    let reply_text = "君の今の情報はこんな感じだよ～";
    reply_text += "\n<@" + result.rows[0].user_id + ">";
    reply_text += "\n最終ログイン日時：" + result.rows[0].last_login;
    reply_text += "\n現在のコイン数：" + result.rows[0].coins + "枚";
    reply_text += "\n現在の借金：" + result.rows[0].debts + "枚";
    await interaction.reply(reply_text);
  } else {
    await interaction.reply("君、ログインしたことないみたいだけど……");
  }
};

const debt = async (interaction) => {
  await interaction.reply("未実装だよ～");
};

const repay = async (interaction) => {
  await interaction.reply("未実装だよ～");
};

const error = async (interaction) => {
  await interaction.reply("???????");
};

module.exports = {
  data: command,
  execute: coins,
};
