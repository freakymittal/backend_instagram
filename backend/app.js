var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport=require('passport')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const uri="mongodb+srv://bosePriyangshu:JSTZ8VCI7Go4CZgA@cluster0.xl6bz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const app = express();

// const {jwtStrategy}=require('./Auth/auth');
const mongoose = require("mongoose");
// require('./Schema/users')
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("connected to db");
    })
    .catch((e)=>{
        console.log("not connected",e);
    });
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

app.use('/', indexRouter);
app.use('/users', usersRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

const port=3010;
app.listen(port,()=>{
  console.log(`listening at ${port}`);
})