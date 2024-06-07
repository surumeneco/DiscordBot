const { Pool } = require("pg");
require("dotenv").config();

let { CONNECTION_STRING } = process.env;

class Query {
  text;
  params;
  constructor(text, params) {
    this.text = text;
    this.params = params;
  }
}

const conn_db = new Pool({
  connectionString: CONNECTION_STRING,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const get_userdata = async (user_id) => {
  const query = new Query("select * from M_USER where user_id = $1", [user_id]);
  const client = await conn_db.connect();
  const result = await conn_db.query(query.text, query.params);
  await client.release();
  return result;
};

const execute_query = async (text, params) => {
  const query = new Query(text, params);
  const client = await conn_db.connect();
  const result = await conn_db.query(query.text, query.params);
  await console.log(result);
  await client.release();
  return result;
};

module.exports = {
  conn_db,
  Query,
  get_userdata,
  execute_query,
};
