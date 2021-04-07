var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
         host: 'localhost', 
         user:'root', 
         password: 'nippo_202010',
         database: 'nippo_app',
    });
  
    pool.getConnection()
        .then(conn => {
          conn.query("select employee_name, id from employee_information where type = 'general'")
            .then((rows) => {
              var employee_lists = [];
              for(var i = 0; i < rows.length; i++){
                console.log(rows[i].id);
                employee_lists.push({name: rows[i].employee_name, id: rows[i].id});

                // employee_lists.name = rows[i].employee_name;
                // employee_lists.id = rows[i].id;
              }
              console.log(employee_lists);
              var json = JSON.stringify(employee_lists);
              conn.close();
              res.render('nippo_history_employee_select', {employee_lists: employee_lists, json: json});
            })
            .then((res) => {
              console.log("res" + res);
              conn.end();
              //res.redirect('top_admin');
            })
            .catch(err => {
              console.log("err" + err); 
              conn.end();
              //res.redirect('top_admin');
            })
            }).catch(err => {
              //res.redirect('top_admin');
    });
});

router.post('/', function(req, res, next) {
  console.log("post");
  console.log(req.body.search);

  //console.log("update nippo_information set attendance_time = '" + attendance_time +  "', leave_time = '" + leave_time + "', break_time = '" + bleak_time + "', study_time = '" + study_time + "', report = '"+ report + "', feel = '" + feel + "', meal = '" + meal + "', sleep = '" + sleep + "', consultation = '" + consultation + "' where id = " + nippo_id + "");

  const mariadb = require('mariadb');
  const pool = mariadb.createPool({
       host: 'localhost', 
       user:'root', 
       password: 'nippo_202010',
       database: 'nippo_app',
  });

  pool.getConnection()
        .then(conn => {
          conn.query("select employee_name, id from employee_information where type = 'general' and employee_name like '%" + req.body.search + "%'")
            .then((rows) => {
              var employee_lists = [];
              for(var i = 0; i < rows.length; i++){
                console.log(rows[i].id);
                employee_lists.push({name: rows[i].employee_name, id: rows[i].id});

                // employee_lists.name = rows[i].employee_name;
                // employee_lists.id = rows[i].id;
              }
              console.log(employee_lists);
              var json = JSON.stringify(employee_lists);
              conn.close();
              res.render('nippo_history_employee_select', {employee_lists: employee_lists, json: json});
            })
            .then((res) => {
              console.log("res" + res);
              conn.end();
              //res.redirect('top_admin');
            })
            .catch(err => {
              console.log("err" + err); 
              conn.end();
              //res.redirect('top_admin');
            })
            }).catch(err => {
              //res.redirect('top_admin');
    });
});
  
  module.exports = router;
