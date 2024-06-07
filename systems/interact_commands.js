const interact_commands = async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await interact_chat_commands(interaction);
  }
  if (interaction.isButton()) {
    await interact_button_commands(interaction);
  }
};

const interact_chat_commands = async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`ERROR: ${interaction.commandName} is not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "ERROR: Cannot executing command.",
      ephemeral: true,
    });
  }
};

const interact_button_commands = async (interaction) => {
  const command = interaction.client.commands.get(interaction.customId);

  if (!command) {
    console.error(`ERROR: ${interaction.customId} is not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "ERROR: Cannot executing command.",
      ephemeral: true,
    });
  }
};

module.exports = {
  interact_commands,
};
