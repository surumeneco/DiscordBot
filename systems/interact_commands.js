const interact_commands = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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

module.exports = {
  interact_commands,
};
