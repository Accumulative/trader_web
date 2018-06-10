var mysql = require('mysql');
const config = require('../config');
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
  console.log(sql);
  return new Promise(function(resolve) {
    con.query(sql, function (err, result) {
      if (err) resolve(null);
      resolve(result);
    });
  });
}
