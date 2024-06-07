const npath = require("node:path");
const reader = require("../functions/general/read_directory");

const load_commands = async (path, client) => {
  const commandsPath = npath.resolve("");
  const commandFiles = reader
    .readSubDirSync(path)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = npath.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `ERROR: Not found necessary property "data" or "execute" in ${filePath}.`
      );
    }
  }
};

module.exports = {
  load_commands,
};
