var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {

  console.log("OK");
  var test = req.body.name;
  console.log(test);
  
  res.render('login', { title: 'ログインあ'});
});

router.post('/', function(req, res, next) {

  var employee_name = req.body.employee_name;
  var password = req.body.password;

  console.log(req.body);

  const mariadb = require('mariadb');
  const pool = mariadb.createPool({
       host: 'localhost', 
       user:'root', 
       password: 'nippo_202010',
       database: 'nippo_app',
  });
  pool.getConnection()
      .then(conn => {
        conn.query("SELECT * from employee_information where employee_name =" + "'" + employee_name + "' and password = '" + password +"'")
          .then((rows) => {

            console.log(rows[0].id);
            console.log(rows[0].employee_name);
            console.log(rows[0].password);
            console.log(rows[0].type);
            conn.close();

            if(rows[0].type == "admin"){
              req.session.login = "admin";
              console.log(req.session);
              res.redirect('top_admin?id='+ rows[0].id);
            }else{
              req.session.login = "gene";
              console.log("gene");
              res.redirect('top_general?id='+ rows[0].id);
            }

            
          })
          .then((res) => {
            console.log("res" + res);
            conn.end();

          })
          .catch(err => {
            console.log("エラー" + err); 
            conn.end();
            // res.redirect('login_err');
            res.render('login', {err: 'エラー'});
          })
          }).catch(err => {
  });

  // res.render('login', {
    
  // });
});

module.exports = router;
