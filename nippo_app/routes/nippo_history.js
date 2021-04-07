var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const mariadb = require('mariadb');
    url = req._parsedOriginalUrl.search;
    id = url.split('=');
    console.log(id[1]);
    const pool = mariadb.createPool({
         host: 'localhost', 
         user:'root', 
         password: 'nippo_202010',
         database: 'nippo_app',
    });
  
    pool.getConnection()
        .then(conn => {
          conn.query("select * from nippo_information where id =" + id[1])

            .then((rows) => {
                console.log(rows[0]);
              
            //   console.log(employee_lists);
            //   var json = JSON.stringify(employee_lists);
              conn.close();
              var resObj = {};
              resObj.result = rows[0];
              //res.render('nippo_history', {nippo_data: rows[0]});
              res.end(JSON.stringify(resObj));
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
