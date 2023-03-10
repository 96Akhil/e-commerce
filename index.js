const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/e_hub");
mongoose.set('strictQuery', false);
var createError = require('http-errors');
var express = require('express');
var session = require("express-session");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
var app = express();
var bodyparser = require('body-parser');
var config = require("./config/collection");
let auth = require("./middleware/auth")



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/'}))
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:config.sessionSecret,
    cookie:{maxAge:600000},
    resave:true,
    saveUninitialized:true
}));
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', userRouter);
app.use('/admin', adminRouter);

app.listen(4000,console.log("Server is running now!"))