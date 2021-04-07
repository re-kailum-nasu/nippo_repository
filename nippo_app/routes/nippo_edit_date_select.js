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
          conn.query("select DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') as cd, id, employee_id from nippo_information where employee_id =" + id[1])
            .then((rows) => {
                console.log(rows);
              var date_lists = [];
              for(var i = 0; i < rows.length; i++){
                date_lists.push({create_date: rows[i].cd, employee_id: rows[i].employee_id, id: rows[i].id});

                // employee_lists.name = rows[i].employee_name;
                // employee_lists.id = rows[i].id;
              }
            console.log(date_lists);
              conn.close();
              res.render('nippo_edit_date_select', {date_lists: date_lists});
              // res.writeHead(200, {
              //   'Content-Type': 'application/json; charset=utf-8',
              // });
              // res.end(JSON.stringify(date_lists));
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
