var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { 
    res.render('test');
});

router.post('/', function(req, res, next) {

  console.log("ใในใ");

});

module.exports = router;
