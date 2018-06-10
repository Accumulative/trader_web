var mysql = require('mysql');
const config = require('../config');
const scripts = require('./sql_scripts')

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});

exports.seedTable = async function() {
  console.log('Seeding ...');
  con.connect(function(err) {
    if (err) throw err;
  });
  if(await newDatabase() == false) {
    console.log('New database ...');
    createTables();
  }
}

function　newDatabase() {
  return new Promise(function(resolve) {
    con.query(scripts.check_trades_exists_sql, function (err, result) {
      if (err) resolve(false);
      resolve(true);
    });
  });
}

function　createTables() {
  con.query(scripts.create_trades_sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
}

exports.insertTrades = function() {

}