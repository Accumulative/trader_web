var express = require('express');
var router = express.Router();
const tradeController = require('../controllers/trades');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/trades/:page', async function(req, res, next) {
  let result = await tradeController.getTrades('id', req.params.page, 2);
  res.send(result);
});

module.exports = router;
