var router = require('express').Router();

//Home Route - Point to Reports
var reports = require('./reports.js');
router.get('/',reports.home);

//Get log reports
router.post('/rntlog',reports.postRntlog);

//Get charts
var charts = require('./charts.js');
router.post('/carcharts',charts.postCarcharts);

module.exports = router;