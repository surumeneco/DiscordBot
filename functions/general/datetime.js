const format_date = (datetime) => {
  return datetime.toLocaleString("sv-SE").replace("T", " ");
};

module.exports = {
  format_date,
};
