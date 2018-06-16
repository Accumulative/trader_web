const db = require('../db/index')

exports.getParams = async function (sort, pageNumber, pageCount) {
	return await db.get('parameters', sort, pageNumber, pageCount);
}

exports.getParamById = async function (id) {
	return await db.findOne('parameters', 'id', id);
}

exports.updateParamById = async function (param) {
	return await db.updateOne('parameters', "value", param.value ,'id', param.id);
}

exports.getParamByName = async function (name) {
	return await db.findOne('parameters', "name", name);
}