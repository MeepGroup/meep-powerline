'use strict';

const request = require('request');

const chalk = require('chalk');

const {
  registerEgg, allEggs, findEgg, provision, viewNest, registerNest, addrole,
  revokerole, addCredits, myNests, delCredits, install, getAuthKey, registerShim
} = require('./modules/');

const {
  cmdShimPort, apiAddr, debug
} = require('../config/global.js');

const { status, config, prey, trust, root } = require('./routes/core.js');
const { commandIssue, commandShim } = require('./routes/command.js');
const { eggInstall } = require('./routes/egg.js');
const { payAdd, payDel } = require('./routes/pay.js');
const {
  nestAddrole, nestRevokerole, nestProvision, nestRegister, nestMyNests,
  nestPrey
} = require('./routes/nest.js');
const {
  registryRegister, registryList, registryFind
} = require('./routes/registry.js');
const { daemon } = require('./routes/daemon.js');

module.exports = function(app, passport) {
// =============================================================================
// Core ========================================================================
// =============================================================================

  app.get('/status', status);
  app.get('/config', isLoggedIn, isAdmin, config);
  app.get('/prey/:address', isLoggedIn, isAdmin, prey);
  app.get('/trust/:address', isLoggedIn, isAdmin, trust);

// =============================================================================
// Command =====================================================================
// =============================================================================

//TODO: Document me!
  app.post('/command/issue', isLoggedIn, commandIssue);
  app.post('/command/shim/add/:address', isLoggedIn, commandShim);

// =============================================================================
// Egg  ========================================================================
// =============================================================================

//TODO: Document me!
  app.post('/egg/install', isLoggedIn, eggInstall);

// =============================================================================
// Pay   =======================================================================
// =============================================================================

  app.post('/pay/credit/add', isLoggedIn, isAdmin, payAdd);
  app.post('/pay/credit/del', isLoggedIn, isAdmin, payDel);

// =============================================================================
// Nest  =======================================================================
// =============================================================================

  app.post('/nest/addrole', isLoggedIn, nestAddrole);
  app.post('/nest/revokerole', isLoggedIn, nestRevokerole);
  app.post('/nest/register', isLoggedIn, nestRegister);
  app.post('/nest/provision', isLoggedIn, nestProvision);
  app.get('/nest/mynests', isLoggedIn, nestMyNests);
  // different from /prey, /nest/prey shows database data, such as stats.
  app.post('/nest/prey', isLoggedIn, isAdmin, nestPrey);

// =============================================================================
// Registry ====================================================================
// =============================================================================

  // Register eggs
  app.get('/registry/register', isLoggedIn, isAdmin, registryRegister);

  app.post('/registry/register', isLoggedIn, isAdmin, registryRegister);
  app.get('/registry/list', isLoggedIn, registryList);
  app.post('/registry/find', isLoggedIn, registryFind);

// =============================================================================
// Daemon  =====================================================================
// =============================================================================

  app.post('/daemon/:address/:action', isLoggedIn, daemon);

// =============================================================================
// Normal Routes  ==============================================================
// =============================================================================

  app.get('/', root);

  // PROFILE SECTION =========================
  app.post('/profile', isLoggedIn,
  function(req, res) {
    if(debug) console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /profile`
      )
    );

    res.jsonp(req.user);
  });

  // LOGOUT ==============================
  app.get('/logout',
  function(req, res) {
    if(debug) console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /logout`
      )
    );

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
      if(debug) console.log(
        chalk.cyan(
          `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /login`
        )
      );

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
