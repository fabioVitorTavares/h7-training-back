const { Pool } = require('pg');
function createConnection() {
  // const pool = new Pool({
  //   user: process.env.DBUSER,
  //   host: process.env.HOSTNAME,
  //   port: process.env.DBPORT,
  //   database: process.env.DBNAME,
  //   max: 20, 
  // });

  const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.HOSTNAME,
    port: process.env.DBPORT,
    database: process.env.DBNAME,
    max: 20, 
  }); 
  return pool;
}

module.exports = { createConnection };
