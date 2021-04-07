var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("れく:"+req);
  
  console.log("管理者画面:"+req.session.login);
  if(req.session.login === "admin"){
    console.log('ろぐいん');
    
  }else{
    console.log("未ログイン");
    res.redirect('login');
  }

  res.render('top_admin');
});

module.exports = router;
