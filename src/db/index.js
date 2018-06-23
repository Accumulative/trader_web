var mysql = require('mysql');
const config = require('../config');

var db_config = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
};
var pool  = mysql.createPool(db_config);

function execSql(sql) {
  return new Promise(function(resolve) {
    pool.getConnection(function(err, con) { 
      if(err) resolve(null);
      con.query(sql, function (err, result) {
        if (err) resolve(null);
        con.release();
        resolve(result);
      });
    })
  });
}

exports.get = function(type, sort, pageNo, pageCount) {
  let sql = "SELECT * FROM " + type + " ORDER BY " + sort + " LIMIT " + (pageNo-1) * pageCount + "," + pageCount + ";"
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
