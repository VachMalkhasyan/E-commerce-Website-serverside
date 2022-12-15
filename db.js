const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "Barevvoncches23$",
  port: 5432,
  database: "ecommerce"
});

module.exports = pool;