var mysql = require('mysql');
const config = require('../config');

var db_config = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
};
var con;
var offline = true;

function handleDisconnect() {
  con = mysql.createConnection(db_config); // Recreate the con, since
                                                  // the old one cannot be reused.

  con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else {
      offline = false;
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
    console.log('db error', err);
    // if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    offline = true;  
    handleDisconnect();                         // lost due to either server restart, or a
    // } else {                                      // connnection idle timeout (the wait_timeout
      // throw err;                                  // server variable configures this)
    // }
  });
}

handleDisconnect();

function execSql (sql) {
  return new Promise(function(resolve) {
    if(!offline) {
      con.query(sql, function (err, result) {
        if (err) resolve(null);
        resolve(result);
      });
    } else {
      resolve(null);
    }
  });
}
exports.execSql = execSql;

exports.get = function(type, sort, pageNo, pageCount) {
  let sql = "SELECT * FROM " + type + " ORDER BY " + sort + " LIMIT " + (pageNo-1) * pageCount + "," + pageCount + ";"
  return execSql(sql);
}

exports.count = function(type, field) {
  let sql = "SELECT count(" + field + ") as count FROM " + type + ";"
  return execSql(sql);
}

exports.getByDate = function(type, sort, dateName, s, e) {
  let sql = "SELECT *, unix_timestamp(" + dateName + ") as " + dateName + "_conv FROM " + type + " WHERE " + dateName + " BETWEEN from_unixtime(floor(" + s + ")) AND from_unixtime(floor(" + e + ")) ORDER BY " + sort + ";"
  return execSql(sql);
}

exports.findOne = async function(type, field, value) {
  let sql = "SELECT * FROM " + type + " WHERE " + field + " = '" + value + "' LIMIT 1;"
  var res = await execSql(sql);
  if (res) return res[0];
  return null;
}

exports.updateOne = function(type, updateField, updateValue, searchField, searchValue) {
  let sql = "UPDATE " + type + " SET " + updateField + " = '" + updateValue + "' WHERE " + searchField + " = '" + searchValue + "';";
  return execSql(sql);
}

exports.getTimeInMarket = function() {
  let sql = "select SUM(TIME_TO_SEC(TIMEDIFF(CASE WHEN close_date IS NULL THEN NOW() ELSE close_date END, open_date))) as time_in_market from trades;";
  return execSql(sql);
}