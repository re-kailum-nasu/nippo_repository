var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {

  console.log("OK");
  var test = req.body.name;
  console.log(test);
  
  res.render('login_err', { title: 'ログイン'});
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

  var success = "test";
  console.log("before" + success);

  // try{
  //   pool.getConnection()
  //     .then(conn => {
  //       conn.query("SELECT * from employee_information where employee_name =" + "'" + employee_name + "' and password = '" + password +"'")
  //         .then((rows) => {

  //           console.log(rows[0].employee_name);
  //           console.log(rows[0].password);
  //           console.log(rows[0].type);
  //           conn.close();
  //         })
  //         .then((res) => {
  //           console.log("res" + res);
  //           conn.end();

  //         })
  //         .catch(err => {
  //           console.log("err" + err); 
  //           conn.end();
  //         })
  //         }).catch(err => {
  //   });
  //   res.render('top_admin', {
    
  //   });
  // }catch(err){

  //   res.render('login', {
    
  //   });

  // }
  pool.getConnection()
      .then(conn => {
        conn.query("SELECT * from employee_information where employee_name =" + "'" + employee_name + "' and password = '" + password +"'")
          .then((rows) => {

            console.log(rows[0].employee_name);
            console.log(rows[0].password);
            console.log(rows[0].type);
            conn.close();

            if(rows[0].type == "admin"){
              req.session.login = "ok";
              res.render('top_admin',{name : rows[0].employee_name});
            }else{
              console.log("gene");
              req.session.login = "ok";
              //res.redirect('top_general');
              res.render('top_general',{name : rows[0].employee_name});
              //res.render('nippo_create',{name : rows[0].employee_name});
            }

            
          })
          .then((res) => {
            console.log("res" + res);
            conn.end();

          })
          .catch(err => {
            console.log("エラー" + err); 
            conn.end();
            res.redirect('login_err');
          })
          }).catch(err => {
  });

  // res.render('login', {
    
  // });
});

module.exports = router;
