const db = require("./index");
const scripts = require("./sql_scripts")


exports.seedTable = async function() {
  if(await newDatabase() == true) {
    console.log('New database ...');
    await createTables();
  }
}

async function newDatabase() {
  const res = await db.execSql(scripts.check_trades_exists_sql);
  if(res != null && res[0].table_no == 4) {
    return true;
  }
  return false;
}

async function createTables() {
  await db.execSql(scripts.create_trades_sql);
  await db.execSql(scripts.create_parameters_sql);
  await db.execSql(scripts.create_predictions_sql);
  await db.execSql(scripts.create_statistics_sql);
  
}

exports.insertTrades = function() {

}