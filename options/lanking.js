const lanking_options = (interaction, focusedOption, callback) => {
  const genre = interaction.options.get("genre").value;
  if (focusedOption.name === "type") {
    let choices = [];

    if (genre === "coins") {
      choices = [
        { name: "所持コイン数", value: "coins" },
        { name: "実質コイン数", value: "debts" },
        { name: "借金コイン数", value: "actual_coins" },
        { name: "借金回数", value: "debt_num" },
      ];
    } else if (genre === "casino") {
      choices = [
        { name: "ゲーム回数", value: "game_num" },
        {
          name: "平均連続プレイ回数",
          value: "avr_play_num",
        },
        { name: "総ベット額", value: "total_bet" },
        { name: "総回収額", value: "total_return" },
        { name: "回収率", value: "return_rate" },
      ];
    }

    callback(interaction, choices);
  }
};

module.exports = {
  lanking_options,
};
