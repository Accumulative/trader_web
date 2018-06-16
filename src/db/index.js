var mysql = require('mysql');
const config = require('../config-dev');
var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database
});
con.connect(function(err) {
  if (err) throw err;
});

exports.get = function(type, sort, pageNo, pageCount) {
  let sql = "SELECT * FROM " + type + " ORDER BY " + sort + " LIMIT " + (pageNo-1) * pageCount + "," + pageCount + ";"
  return new Promise(function(resolve) {
    con.query(sql, function (err, result) {
      if (err) resolve(null);
      resolve(result);
    });
  });
}

exports.getByDate = function(type, sort, dateName, s, e) {
  let sql = "SELECT open_price, close_price, unix_timestamp(open_date) as open_date, unix_timestamp(close_date) as close_date FROM " + type + " WHERE " + dateName + " BETWEEN from_unixtime(floor(" + s + ")) AND from_unixtime(floor(" + e + ")) ORDER BY " + sort + ";"
  console.log(sql);
  return new Promise(function(resolve) {
    con.query(sql, function (err, result) {
      if (err) resolve(null);
      resolve(result);
    });
  });
}

exports.findOne = function(type, field, value) {
  let sql = "SELECT * FROM " + type + " WHERE " + field + " = '" + value + "' LIMIT 1;"
  return new Promise(function(resolve) {
    con.query(sql, function (err, result) {
      if (err) resolve(null);
      if(result.length > 0) {
        resolve(result[0]);
      }
      resolve(null);
    });
  });
}

exports.updateOne = function(type, updateField, updateValue, searchField, searchValue) {
  let sql = "UPDATE " + type + " SET " + updateField + " = '" + updateValue + "' WHERE " + searchField + " = '" + searchValue + "';";
  console.log(sql);
  return new Promise(function(resolve) {
    con.query(sql, function (err, result) {
      if (err) resolve(false);
      resolve(true);
    });
  });
}
