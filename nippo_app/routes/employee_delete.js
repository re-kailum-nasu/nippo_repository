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
          conn.query("select employee_name, id from employee_information")
            .then((rows) => {
                //console.log(rows);
              var employee_lists = [];
              for(var i = 0; i < rows.length; i++){
                //console.log(rows[i].id);
                employee_lists.push({name: rows[i].employee_name, id: rows[i].id});

                // employee_lists.name = rows[i].employee_name;
                // employee_lists.id = rows[i].id;
              }
              //console.log(employee_lists);
              var json = JSON.stringify(employee_lists);
              conn.close();
              res.render('employee_delete', {employee_lists: employee_lists, json: json, title: '社員削除'});
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

    // var employee_name = req.body.employee_name;
    // var password = req.body.password;
    // var type = req.body.type;
  
    console.log(res.req.body.select);
    var id = res.req.body.select;
  
    const mariadb = require('mariadb');
    const pool = mariadb.createPool({
         host: 'localhost', 
         user:'root', 
         password: 'nippo_202010',
         database: 'nippo_app',
    });
  
    pool.getConnection()
        .then(conn => {
          conn.query("delete from employee_information where id =" + id)
            .then((rows) => {
              conn.close();
              res.redirect('top_admin');
            })
            .then((res) => {
              console.log("res" + res);
              conn.end();
              res.redirect('top_admin');
            })
            .catch(err => {
              console.log("err" + err); 
              conn.end();
              res.redirect('top_admin');
            })
            }).catch(err => {
              res.redirect('top_admin');
    });
  
    
  
  });

module.exports = router;
