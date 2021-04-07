var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { 
  //console.log(req._parsedOriginalUrl.search);
  url = req._parsedOriginalUrl.search;
  id = url.split('=');
  //console.log(id[1]);
  //console.log(res);
  res.render('nippo_create', { title: '日報作成' });

});



router.post('/', function(req, res, next) {

  console.log("ポスト");
  // console.log(req);
  // console.log(res);

  // console.log(id[1]);

  console.log(req.body);

  var employee_id = req.body.employee_id;
  var attendance_time = req.body.attendance_time;
  var leave_time = req.body.leave_time;
  var bleak_time = req.body.bleak_time;
  var study_time = req.body.study_time;
  var report = req.body.report;
  var feel = req.body.feel;
  var meal = req.body.meal;
  var sleep = req.body.sleep;
  var consultation = req.body.consultation;

  const mariadb = require('mariadb');
  const pool = mariadb.createPool({
       host: 'localhost', 
       user:'root', 
       password: 'nippo_202010',
       database: 'nippo_app',
  });

  pool.getConnection()
      .then(conn => {
        conn.query("insert into nippo_information(employee_id, attendance_time, leave_time, break_time, study_time, report, feel, meal, sleep, consultation) values('" + employee_id + "', '" + attendance_time + "', '" + leave_time + "', '" + bleak_time + "', '" + study_time + "', '" + report + "', '" + feel + "', '" + meal + "', '" + sleep + "', '" + consultation + "')")
          .then((rows) => {
            //console.log(rows[0].employee_name);
            //console.log(rows[0].password);
            conn.close();
            res.redirect('top_general?id=' + employee_id);
          })
          .then((res) => {
            console.log("res" + res);
            conn.end();
            res.redirect('top_genaral');
          })
          .catch(err => {
            console.log("err" + err); 
            conn.end();
            res.redirect('top_genaral');
          })
          }).catch(err => {
            res.redirect('top_genaral');
  });
});

module.exports = router;
