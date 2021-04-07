var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('employee_add', { title: '社員追加' });
});

router.post('/', function(req, res, next) {

  var employee_name = req.body.employee_name;
  var password = req.body.password;
  var type = req.body.type;

  console.log(req);

  const mariadb = require('mariadb');
  const pool = mariadb.createPool({
       host: 'localhost', 
       user:'root', 
       password: 'nippo_202010',
       database: 'nippo_app',
  });

  pool.getConnection()
      .then(conn => {
        conn.query("insert into employee_information(employee_name, password, type) values('" + employee_name + "', '" + password + "', '" + type + "')")
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
            res.redirect('employee_add_err');
          })
          }).catch(err => {
            res.redirect('top_admin');
  });

  

});

module.exports = router;
