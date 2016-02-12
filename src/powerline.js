/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

require("babel-polyfill");
// set up ======================================================================
// get all the tools we need
const express = require('express');
const app = express();
const port = 3002;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const chalk = require('chalk');
const cors = require('cors');

require('./app/modules/schemaInit.js');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database.js');

// configuration ===============================================================

// connect to our database
mongoose.connect(configDB.url);

// pass passport for configuration
require('./config/passport')(passport);

// set up our express application
app.use(cors({
  origin: [
    'http://localhost:3005',
    'http://192.168.1.100:3005',
    'http://69.255.214.24:3005',
    'http://69.255.214.24:3005/',
    'http://192.168.1.100:3005/',
    'http://localhost',
    'http://localhost:3004',
    'http://localhost:3004/',
    'https://gomeep.com',
    'https://gomeep.com/'
  ],
  credentials: true
}));

// read cookies (needed for auth)
app.use(cookieParser());

// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set up ejs for templating
app.set('view engine', 'ejs');

// required for passport
// session secret
app.use(session({secret: 'wowthissushiisawesome'}));
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// use connect-flash for flash messages stored in session
app.use(flash());

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log(chalk.green('Meep Powerline running on http://localhost:' + port));
