const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "kedaval",
  password: "Vale2312D",
  port: 5432,
});

module.exports = pool;
