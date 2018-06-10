const db = require('../db/index')

exports.getTrades = async function (sort, pageNumber, pageCount) {
	return await db.get('trades', sort, pageNumber, pageCount);
}