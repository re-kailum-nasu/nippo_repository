var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var loginErrRouter = require('./routes/login_err');
var nippoCreateRouter = require('./routes/nippo_create');
var topAdminRouter = require('./routes/top_admin');
var topGeneralRouter = require('./routes/top_general');
var employeeAddRouter = require('./routes/employee_add');
var employeeDeleteRouter = require('./routes/employee_delete');
var employeeAddErrRouter = require('./routes/employee_add_err');
var nippoHistoryEmployeeSelectRouter = require('./routes/nippo_history_employee_select');
var nippoHistoryDateSelectRouter = require('./routes/nippo_history_date_select');
var nippoHistoryRouter = require('./routes/nippo_history');
var nippoEditDateSelectRouter = require('./routes/nippo_edit_date_select');
var nippoEditRouter = require('./routes/nippo_edit');
var nippoTestRouter = require('./routes/test');
//var nippoHistoryRouter = require('./routes/nippo_history');


var app = express();

var session_opt = {
  secret: 'keybord cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000}
};
app.use(session(session_opt));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/login_err', loginErrRouter);
app.use('/nippo_create', nippoCreateRouter);
app.use('/top_admin', topAdminRouter);
app.use('/top_general', topGeneralRouter);
app.use('/employee_add', employeeAddRouter);
app.use('/employee_delete', employeeDeleteRouter);
app.use('/employee_add_err', employeeAddErrRouter);
app.use('/nippo_history_employee_select', nippoHistoryEmployeeSelectRouter);
app.use('/nippo_history_date_select', nippoHistoryDateSelectRouter);
app.use('/nippo_history', nippoHistoryRouter);
app.use('/nippo_edit_date_select', nippoEditDateSelectRouter);
app.use('/nippo_edit', nippoEditRouter);
app.use('/test', nippoTestRouter);
//app.use('/nippo_history', nippoHistoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
