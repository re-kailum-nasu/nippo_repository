const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: 'nippo_202010',
     database: 'nippo_app',
});

pool.getConnection()
    .then(conn => {
        
      conn.query("SELECT * from employee_information")
        .then((rows) => {
          console.log(rows[0].employee_name);
          console.log(rows[0].password);
          conn.close();
          console.log("a");
        })
        .then((res) => {
          console.log("res" + res);
          conn.end();
        })
        .catch(err => {
          console.log("err" + err); 
          conn.end();
        })
    }).catch(err => {
    });

// pool.getConnection(function(err, connection){
//     connection.query("select * from employee_information", function(err, rows, fields){
//         console.log(rows[0].employee_name);
//         connection.release();
//     });
// });

// console.log("oka");


