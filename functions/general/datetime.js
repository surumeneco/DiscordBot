const format_date = (datetime) => {
  return datetime.toLocaleString("sv-SE").replace("T", " ");
};

const format_date_only = (datetime) => {
  return datetime.toLocaleString("sv-SE").split(" ")[0];
};

module.exports = {
  format_date,
  format_date_only,
};
