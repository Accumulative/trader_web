const db = require('../db/index')

exports.getTrades = async function (sort, pageNumber, pageCount) {
	return await db.get('trades', sort, pageNumber, pageCount);
}

exports.getTradesByDate = async function (s, e, dateName) {
	return await db.getByDate('trades', 'id ASC', dateName, s, e)
}

exports.getPredictionsByDate = async function (s, e, dateName) {
	return await db.getByDate('predictions', 'pred_date ASC', dateName, s, e)
}