var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'A.M. Fredericks PDF Selector' });
});

module.exports = router;
