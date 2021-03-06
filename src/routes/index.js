var express = require('express');
var router = express.Router();
const tradeController = require('../controllers/trades');
const paramController = require('../controllers/params');
const config = require('../config');

var auth = function(req, res, next) {
  if (req.session && req.session.user === config.Admin.username && req.session.admin)
    return next();
  else
    var error = { stack: "You are not authorised, please login", status: 401 }
    // render the error page
    res.status(401);
    res.render('error', { error: error, message: "You are not authorised, please login" });
};

router.get('/login', async function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', async function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.render('login', { title: 'Login', message: "Please supply a username and passwrrord" });  
  } else if(req.body.username === config.Admin.username || req.body.password === config.Admin.password) {
    req.session.user = config.Admin.username;
    req.session.admin = true;
    res.redirect("/");
  } else {
    res.render('login', { title: 'Login', message: "Username and password incorrect." }); 
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get('/params/:id', auth, async function(req, res, next) {
  let param = await getParameterById(req.params.id);
  res.render('parameter', { title: 'Parameter: ' + param.id, user: req.session.user, param: param });
});

router.post('/params/:id', auth,  async function(req, res, next) {
  let param = req.body;
  param.id = req.params.id;
  let result = await updateParameterById(param);
  if(result) {
    res.redirect("/params");
  }
  res.send("error");
});

router.get('/trades', auth,  async function(req, res, next) {
  let pageNo = 1;
  let recordsPerPage = 10;
  if(req.query.page) { 
    if(isNaN(parseInt(req.query.page))) {
      pageNo = 1
    } else {
      pageNo = req.query.page;
    }
  }
  let trades = await getTrades(pageNo, recordsPerPage);
  res.render('index', { title: 'Trades', user: req.session.user, trades: trades, pagination: {
    startPage: pageNo - 1 < 1 ? 1 : pageNo - 1,
    currPage: pageNo,
    maxPage: (trades.length < recordsPerPage ? pageNo : parseInt(pageNo) + 1)
  } });
});

router.get('/params',  auth, async function(req, res, next) {
  let recordsPerPage = 10;
  let pageNo = 1;
  if(req.query.page) { 
    if(isNaN(parseInt(req.query.page))) {
      pageNo = 1
    } else {
      pageNo = req.query.page;
    }
  }
  let params = await getParameters(pageNo, recordsPerPage);
  res.render('parameters', { title: 'Parameters', user: req.session.user, params: params, pagination: {
    startPage: pageNo - 1 < 1 ? 1 : pageNo - 1,
    currPage: pageNo,
    maxPage: (params.length < recordsPerPage ? pageNo : parseInt(pageNo) + 1)
  } });
});

router.get('/', async function(req, res, next) {
  var stats = [];
  if(req.session.user) {
    stats = await getAllStats();
    var endDate = new Date();
    endDate.setTime(endDate.getTime() + (24*60*60*1000));
    var startDate = new Date();
    startDate.setTime(endDate.getTime() - (24*60*60*1000) * 30);
    var trades = await getTradesByDate(startDate.getTime()/1000, endDate.getTime()/1000, "open_date");
    var numberOfLongs = 0;
    var numberOfShorts = 0;
    var openPositions = 0;
    var sumOfProfit = 0;
    trades.forEach(function(trade) { 
      sumOfProfit += trade.close_price ? (trade.close_price - trade.open_price) * trade.amount : 0;
      numberOfLongs += (trade.amount >= 0 ? 1 : 0);
      numberOfShorts += (trade.amount < 0 ? 1 : 0);
      openPositions += (trade.close_price ? 0 : 1);
    });

    var inMarket = [],
    currentDate = startDate.getTime(),
    d;
    var period = await getParametersByName("period");
    period = (period ? period.value : 7);

    while (currentDate <= endDate.getTime()) {
        d = currentDate;
        var flag = 0;
        trades.forEach(function(trade) {
          if(trade.close_date) {
            if(trade.open_date.getTime() < d && trade.close_date.getTime() > d) {
              flag +=trade.amount;
            }
          } else if(trade.open_date.getTime() < d) {
            flag +=trade.amount;
          }
        })
        inMarket.push({x:d,y:flag});
        currentDate += (period * 1000); // add one day
    }
    res.render('home', { title: 'Home', user: req.session.user, statistics: JSON.stringify(stats), stats: stats,
  open_pos: openPositions, prof_sum: sumOfProfit, longs: numberOfLongs, shorts: numberOfShorts,
  inMarket: JSON.stringify(inMarket) });
  } else {
    res.render('home', { title: 'Home', user: req.session.user } )
  }
});
router.post('/graphs', async function(req, res, next) {
  var time = req.body.time;
  res.redirect(req.originalUrl + "&time=" + time);
});

router.get('/graphs', async function(req, res, next) {
  
  var endDate = new Date();
  endDate.setTime(endDate.getTime() + (24*60*60*1000));
  var predDateEnd = new Date();
  predDateEnd.setTime(predDateEnd.getTime() + (24*60*60*1000) * 100);
  if(req.query.endDate) {
    endDate = new Date(parseInt(req.query.endDate));
    predDateEnd.setTime(endDate.getTime());
  }
  var time = 7;
  if(req.query.time) {
    time = req.query.time;
  } 
  var startDate = new Date(); 
  startDate.setTime(endDate.getTime() - (24*60*60*1000) * time);

  
  
  var period = await getParametersByName("period");
  var pair = await getParametersByName("pair");

  var buyTrades = await getTradesByDate(startDate.getTime()/1000, endDate.getTime()/1000, "open_date");
  var sellTrades = await getTradesByDate(startDate.getTime()/1000, endDate.getTime()/1000, "close_date");
  var preds = await getPredictionsByDate(startDate.getTime()/1000, predDateEnd.getTime()/1000, "pred_date");
  var highPreds = [];
  var lowPreds = [];
  var midPreds = [];
  preds.forEach(element => {
    switch (element.type) {
      case 0:
        midPreds.push(element);
        break;
      case 1:
        lowPreds.push(element);
        break;
      case 2:
        highPreds.push(element);
        break;
    } 
  });
  res.render('graph',{ title: "Graph", user: req.session.user, time: time, buyTrades: JSON.stringify(buyTrades),sellTrades: JSON.stringify(sellTrades), 
  midPreds: JSON.stringify(midPreds), lowPreds: JSON.stringify(lowPreds),highPreds: JSON.stringify(highPreds),period: period.value, pair: pair.value, startDate: startDate, endDate: endDate});
});

async function getTrades(pageNo, perPage) {
  let result = await tradeController.getTrades('id DESC', pageNo, perPage);
  return result;
};
async function getParametersByName(name) {
  let result = await paramController.getParamByName(name);
  return result;
};
async function getParameters(pageNo, perPage) {
  let result = await paramController.getParams('name ASC', pageNo, perPage);
  return result;
};
async function getParameterById(id) {
  let result = await paramController.getParamById(id);
  return result;
};
async function updateParameterById(param) {
  let result = await paramController.updateParamById(param);
  return result;
};

async function getTradesByDate(dateStart, dateFinish, dateName) {
  let result = await tradeController.getTradesByDate(dateStart, dateFinish, dateName);
  return result;
};
async function getPredictionsByDate(dateStart, dateFinish, dateName) {
  let result = await tradeController.getPredictionsByDate(dateStart, dateFinish, dateName);
  return result;
};
async function getAllStats() {
  let result = await tradeController.getAllStatistics();
  let fee = await tradeController.getTotalFees();
  let time_in_market = await tradeController.getTimeInMarket();
  result.push({name: 'fees', value: fee[0].count})
  result.push({name: 'time_in_market', value: time_in_market[0].time_in_market})
  return result;
};
module.exports = router;
