var express = require('express');
var sys = require('sys');
var exec = require('child_process').exec;
var router = express.Router();

var Common = require('../../util/Common.js');
var OnetimePassword = require('../../model/OnetimePassword.js');
var Vote = require('../../model/Vote.js');
var Storage = require('../../model/Storage.js');
var DatabaseUtil = require('../../util/DatabaseUtil.js');
var Logger = require('../../util/Logger.js');

router.get('/get_elections', function(req, res, next) {
    common_validate(req, res);

    var promise = new Promise( (rslv, rej)=> {
        var r = DatabaseUtil.getAllRowMap('election', 'id', 'title');
        rslv(r);
    });

    promise.then( (electionMap)=>{
        console.log(electionMap);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });
        res.end(JSON.stringify(electionMap) );
    });

});

router.get('/publish', function(req, res, next) {
    common_validate(req, res);

    var password = OnetimePassword.createPassword();
    console.log(password);

    var uniqueHash = OnetimePassword.createUniqueHash();
    console.log(uniqueHash);
    console.log(req.query.json);

    var map = {
            password: password,
            unique_hash: uniqueHash,
            election_ids_json: req.query.json,
    };

    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleValue('vote_status', 'status', 'id', 1);
        rslv(r);
    });


    promise.then( (status)=>{
        if('stop' === status){
          map.result = 'NG';
          map.msg = '選挙が開始状態ではないため、発行できません';
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
          });
          res.end(JSON.stringify(map) );
          exit;
          return;
        }else{
            var promise2 = new Promise( (rslv, rej)=> {
                var r = DatabaseUtil.insertMap('onetime_password', map);
                rslv(r);
            });
            promise2.then( (result)=>{
                Logger.log('FRONT', 'INFO', `パスワード新規発行 ユニークハッシュ: ${uniqueHash}`, '-', __filename, '1001');
                map.id = result.insertId;
                map.result = 'OK';
                res.writeHead(200, {
                  'Content-Type': 'application/json; charset=utf-8',
                });
                res.end(JSON.stringify(map) );
                return;
            });
        }
    });

});

router.get('/republish', function(req, res, next) {
    common_validate(req, res);

    OnetimePassword.republish(req, res);
});

router.get('/password_cancel', function(req, res, next) {
    common_validate(req, res);

    OnetimePassword.cancel(req, res);
});

router.get('/password_check', function(req, res, next) {
    common_validate(req, res);
    var resObj = {};

    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleRow('onetime_password', 'id', req.query.id);
        rslv(r);
    });

    promise.then(async (otp)=>{
      console.log(otp);
        if('ERROR' === otp.id || 'ZERO' === otp.id){
          resObj.exists = false;
          resObj.otp = null;
          resObj.detail = null;
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
          });
          res.end(JSON.stringify(resObj) );

        }else{
          var promise2 = new Promise(async (rslv, rej)=> {
            console.log(otp);
            var electionIds = JSON.parse(otp.election_ids_json).election_ids;
            var r = await DatabaseUtil.getRowsInArr('election', 'id', electionIds);
            rslv(r);
          });
          promise2.then(async (elections)=>{
            resObj.exists = true;
            resObj.otp = otp;
            resObj.detail = await OnetimePassword.createOtpDetail(otp, elections);
            console.log(resObj);
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
            });
            res.end(JSON.stringify(resObj) );
          });

        }

    });
});

router.get('/republish_check', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleRow('onetime_password', 'id', req.query.id);
        rslv(r);
    });

    promise.then(async (otp)=>{
      var resObj = {};
      if('ERROR' === otp.id || 'ZERO' === otp.id){
        resObj.result = 'NG';
        resObj.otp_id = null;
        resObj.otp_unique_hash = null;
        resObj.otp = null;
        resObj.msg = '該当するパスワードはありません。';
        res.end(JSON.stringify(resObj) );
        exit;
        return;
      }else{
        OnetimePassword.republishCheck(req, res, otp);
      }
    });
});

router.get('/password_cancel_check', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleRow('onetime_password', 'id', req.query.id);
        rslv(r);
    });

    promise.then(async (otp)=>{
        var resObj = {};
        if('ERROR' === otp.id || 'ZERO' === otp.id){
            resObj.result = 'NG';
            resObj.otp_id = null;
            resObj.msg = '該当するパスワードはありません。';
            res.end(JSON.stringify(resObj) );
            exit;
            return;
        }else{
            OnetimePassword.cancelCheck(req, res, otp);
        }
    });
});

router.get('/oldtrace', function(req, res, next) {
    common_validate(req, res);
    var resObj = {};

    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleRow('onetime_password', 'republish_old_password_id', req.query.id);
        rslv(r);
    });

    promise.then(async (otp)=>{
      console.log(otp);
          if('ERROR' === otp.id || 'ZERO' === otp.id){
              resObj.exists = false;
              resObj.otp = null;
              resObj.old_otp_id = req.query.id;
              resObj.msg = '該当するパスワードがありませんでした。IDが間違っているか、再発行されたものではない可能性があります。『パスワードの状態確認』にてご確認下さい。';
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
              });
              res.end(JSON.stringify(resObj) );

          }else{
              resObj.exists = true;
              resObj.otp = otp;
              resObj.old_otp_id = req.query.id;
              resObj.msg = '';
              console.log(resObj);
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
              });
              res.end(JSON.stringify(resObj) );
          }

    });
});

router.get('/zero_check', function(req, res, next) {
    common_validate(req, res);
    Vote.zeroCheck(req, res);
});

router.get('/password_stat', function(req, res, next) {
    common_validate(req, res);
    OnetimePassword.passwordStat(req, res);
});

router.get('/vote_status_check', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getSingleValue('vote_status', 'status', 'id', 1);
        rslv(r);
    });

    promise.then(async (status)=>{
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end(status);
    });
});

router.get('/vote_start', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.updateRowMap('vote_status', {
          status: 'start',
        }, 'id', 1);
        rslv(r);
    });

    promise.then(async (result)=>{
      if('ERROR' !== result){
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('SUCCESS');
        Logger.log('FRONT', 'INFO', '選挙開始', '-', __filename, '1002');
      }    
    });
});

router.get('/vote_stop', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.updateRowMap('vote_status', {
          status: 'stop',
        }, 'id', 1);
        rslv(r);
    });

    promise.then(async (result)=>{
      if('ERROR' !== result){
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('SUCCESS');
        Logger.log('FRONT', 'INFO', '選挙停止', '-', __filename, '1003');
      }    
    });
});

router.get('/client_ip', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.getAllRows('client_ip');
        rslv(r);
    });

    promise.then(async (rows)=>{
      var resObj = {rows: rows};
      var json = JSON.stringify(resObj);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(JSON.stringify(resObj) );
    });
});

router.get('/update_client_ip', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.updateRowMap('client_ip', req.query, 'id', req.query.id);
        rslv(r);
    });

    promise.then(async (result)=>{
      if('ERROR' !== result){
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('SUCCESS');
      }
    });
});

router.get('/delete_client_ip', function(req, res, next) {
    common_validate(req, res);
    var promise = new Promise(async (rslv, rej)=> {
        var r = await DatabaseUtil.execSQL(`delete from client_ip where id = ${req.query.id}`);
        rslv(r);
    });

    promise.then(async (result)=>{
      if('ERROR' !== result){
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('SUCCESS');
      }
    });
});

router.get('/ping', function(req, res, next) {
    common_validate(req, res);

    var cmd = `ping -c 5 -i 0.5 ${req.query.ip}`;
    console.log('CMD');
    console.log(cmd);
    
    var puts = function(err, stdout, stderr){ 
      console.log('ERR');
      console.log(err);
      console.log('STDOUT');
      console.log(stdout);
      console.log('STDERR');
      console.log(stderr);

      var result = '';

      if(null == err){
        result = '疎通';
      }else{
        result = '応答なし';
      }

      var resObj = {
        result: result,
        err: err,
        stdout: stdout,
        stderr: stderr,
      };

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(JSON.stringify(resObj) );
    };

    exec(cmd, puts);
});

router.get('/storage_check', function(req, res, next) {
    common_validate(req, res);
    Storage.storageCheckAdminApi(req, res);
});

router.get('/capacity_check', function(req, res, next) {
    common_validate(req, res);
    Storage.storageCapacityCheck(req, res);
});

var common_validate = (req, res) => {
    console.log(req.session);
    if(Common.isNull(req.session.admin_sess) ){
        res.writeHead(400, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        console.log('未ログインアクセス1');
        Logger.log('FRONT', 'SECURITY', `受付担当者 未ログイン直接アクセス発生`,
        'アクセス拒否 セッションクリア', __filename, '1004');
        req.session.admin_sess = {};
        res.end('ERROR');
    }

    if(!req.session.admin_sess.is_loggedin){
        res.writeHead(400, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        console.log('未ログインアクセス2');
        Logger.log('FRONT', 'SECURITY', `受付担当者 未ログイン直接アクセス発生`,
        'アクセス拒否 セッションクリア', __filename, '1005');
        req.session.admin_sess = {};
        res.end('ERROR');
    }

};

module.exports = router;
