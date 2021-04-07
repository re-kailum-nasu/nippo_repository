var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('login');
});

router.post('/', function(req, res, next) {

  var name = req.body.name;
  var age = req.body.age;

  res.render('index', {
    title: "結果！",
    name: name,
    age: age
  });

});

module.exports = router;