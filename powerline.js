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
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(cors({
  origin: [
    'http://localhost:3005',
    'http://192.168.1.100:3005',
    'http://69.255.214.24:3005',
    'http://69.255.214.24:3005/',
    'http://192.168.1.100:3005/',
    'http://localhost'
  ],
  credentials: true
}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'wowthissushiisawesome' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log(chalk.green('Meep Powerline running on http://localhost:' + port));
