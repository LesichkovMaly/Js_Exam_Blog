const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const dateFormat = require('dateformat');

module.exports = (app, config) => {
    // engine setup
    app.set('views', path.join(config.rootFolder, '/views'));
    app.set('view engine', 'hbs');

    // parser for request data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // cookies
    app.use(cookieParser());

    // Session is storage for cookies, which will be de/encrypted with that 'secret' key
    app.use(session({secret: 'malydog123', resave: false, saveUninitialized: false}));

    // For user validation we will use passport module.
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        if(req.user){
            res.locals.user = req.user;
        }

        next();
    });

    // makes the content accessible for every user
    app.use(express.static(path.join(config.rootFolder, 'public')));

    //formating the date
   // app.use(dateFormat());
};



