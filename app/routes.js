'use strict';

const request = require('request');

const chalk = require('chalk');
const debug = true;

const {
  registerEgg, allEggs, findEgg, provision, viewNest, registerNest, addrole,
  revokerole, addCredits, myNests, delCredits, install, getAuthKey, registerShim
} = require('./modules/');

const {
  cmdShimPort, apiAddr
} = require('../config/global.js');

module.exports = function(app, passport) {
// =============================================================================
// Core ========================================================================
// =============================================================================

  app.get('/status',
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /status`));

    request.get(`${apiAddr}:3000/status`,
    (err, httpResponse, hawkBody) => {
      request.get(`${apiAddr}/rooster/status`,
      (err, httpResponse, roosterBody) => {
        res.status(200).jsonp({
          hawk: JSON.parse(hawkBody),
          rooster: JSON.parse(roosterBody)
        });
      });
    });
  });

  // Get config
  app.get('/config', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /config`));

    request(`${apiAddr}:3001`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        res.jsonp(JSON.parse(body));
      }
    });
  });

  // Get stats on a nest by address
  app.get('/prey/:address', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /prey/${req.params.address}`));

    request(`${apiAddr}:3000/prey/${req.params.address}`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        res.jsonp(JSON.parse(body));
      }
    });
  });

  // Trust a new nest.
  app.get('/trust/:address', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /trust/${req.params.address}`));

    request(`${apiAddr}:3001/trust/${req.params.address}`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        if(debug)
          console.log(chalk.blue(`New address trusted: ${req.params.address}`));
        res.jsonp(body);
      }
    });
  });

// =============================================================================
// Command =====================================================================
// =============================================================================

app.post('/command/issue', isLoggedIn,
function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /command/issue`));

  // get authkey with mongon if we own this server, then redirect the request
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.body.address;

  getAuthKey(options, (response) => {
    res.redirect(
      307,
      `http://${options.address}:${cmdShimPort}/cmd/`
    );
  });
});


app.post('/command/shim/add/:address', isLoggedIn,
function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /command/shim/add/${req.params.address}`));

  // get authkey with mongon if we own this server, then redirect the request
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.params.address;

  getAuthKey(options, (response) => {
    res.redirect(
      307,
      `http://${options.address}:${cmdShimPort}/mod/add/${response.data.authKey}`
    );
  });

});

// =============================================================================
// Egg  ========================================================================
// =============================================================================

  app.post('/egg/install', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /egg/install`));

    let options = req.body;
    options.email = req.user.local.email;

    install(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

// =============================================================================
// Pay   =======================================================================
// =============================================================================

  app.post('/pay/credit/add', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /pay/credit/add`));

    let options = req.body;
    options.email = req.user.local.email;

    addCredits(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/pay/credit/del', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /pay/credit/del`));

    let options = req.body;
    options.email = req.user.local.email;

    delCredits(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });
// =============================================================================
// Nest  =======================================================================
// =============================================================================

  app.post('/nest/addrole', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/addrole`));

    let options = req.body;
    options.owner = req.user.local.email;

    addrole(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/revokerole', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/revokerole`));

    let options = req.body;
    options.owner = req.user.local.email;

    revokerole(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/register', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/register`));

    let options = req.body;
    options.owner = req.user.local.email;

    registerNest(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/provision', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/provision`));

    let options = req.body;
    options.owner = req.user.local.email;

    provision(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.get('/nest/mynests', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/mynests`));

    let options = {
      owner: req.user.local.email
    };
    myNests(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  // different from /prey, /nest/prey shows database data, such as stats.
  app.post('/nest/prey', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /nest/prey`));

    viewNest(req.body, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

// =============================================================================
// Registry ====================================================================
// =============================================================================

  // Register eggs
  app.get('/registry/register', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /registry/register`));

    res.render('registerEgg.ejs');
  });

  app.post('/registry/register', isLoggedIn, isAdmin,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /registry/register`));

    registerEgg(req.body, (response) => {
      if(debug)
        console.log(chalk.blue(`New Egg Registered by: ${req.user.email}`));

      res.status(response.status).jsonp(response.data);
    });
  });

  // Find All Eggs
  app.get('/registry/list', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /registry/list`));

    allEggs((response) => {
      res.jsonp(response);
    });
  });

  // Find All Eggs
  app.post('/registry/find', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /registry/find`));

    findEgg(req.body, (response) => {
      res.status(response.code).jsonp(response.data);
    });
  });

// =============================================================================
// Daemon  =====================================================================
// =============================================================================

app.post('/daemon/:address/:action', isLoggedIn, (req, res) => {
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.params.address;

  getAuthKey(options, (response) => {
    res.redirect(
      307,
      `http://localhost:3003/${req.params.action}/${response.data.authKey}`
    );
  });
});

// =============================================================================
// Normal Routes  ==============================================================
// =============================================================================

  // show the home page (will also have our login links)
  app.get('/',
  function(req, res) {
      res.jsonp({
        routes: [
          {
            name: 'login',
            desc: 'Login to Meep API.'
          },
          {
            name: 'signup',
            desc: 'Signup for Meep API.'
          },
          {
            name: 'profile',
            desc: 'Gett profile for current user.'
          }
        ]
      });
  });

  // PROFILE SECTION =========================
  app.post('/profile', isLoggedIn,
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /profile`));

    res.jsonp(req.user);
  });

  // LOGOUT ==============================
  app.get('/logout',
  function(req, res) {
    if(debug) console.log(chalk.blue(`[${Date.now()}] /logout`));

    req.logout();
    res.redirect('/');
  });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------

    // show the login form
    app.get('/login',
    function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login'),
    function(req, res) {
      if(debug) console.log(chalk.blue(`[${Date.now()}] /login`));

      if( req.user ) {
        res.status(200).jsonp({
          success: 'Successfully logged in.'
        });
      } else {
        res.status(500).jsonp({error: 'Failed to authenticate'});
      }
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup',
    function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup'),
    function(req, res) {
      if( req.user ) {
        res.status(200).jsonp({
          success: 'Successfully signed up.'
        });
      } else {
        res.status(500).jsonp({error: 'Failed to sign up.'});
      }
    });


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local',
    function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn,
    function(req, res) {
        let user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// =============================================================================
// MIDDLEWARE ==================================================================
// =============================================================================

// route middleware to ensure user is logged in
function isAdmin(req, res, next) {
    if(req.user.isAdmin) {
      return next();
    }
    res.status(401).jsonp({
      error: 'You must be an admin to tap this powerline.'
    });
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).jsonp({
      error: 'You must be logged in to tap this powerline.'
    });
}
