'use strict';

const request = require('request');

const chalk = require('chalk');
let debug = true;

const {
  registerEgg, allEggs, findEgg, provision, viewNest, registerNest, addrole,
  revokerole, addCredits, myNests
} = require('./modules/');

module.exports = function(app, passport) {
// =============================================================================
// Core ========================================================================
// =============================================================================

  app.get('/status', function(req, res) {
    request.get('https://meeppanel.com/hawk/status', (err,httpResponse,hawkBody) => {
      request.get('https://meeppanel.com/rooster/status', (err,httpResponse,roosterBody) => {
        res.status(200).jsonp({
          hawk: JSON.parse(hawkBody),
          rooster: JSON.parse(roosterBody)
        });
      });
    });
  });

  // Get config
  app.get('/config', isLoggedIn, isAdmin, function(req, res) {
    request(`https://meeppanel.com/rooster`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        res.jsonp(JSON.parse(body));
      }
    });
  });

  // Get stats on a nest by address
  app.get('/prey/:address', isLoggedIn, isAdmin, function(req, res) {
    request(`https://meeppanel.com/hawk/prey/${req.params.address}`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        res.jsonp(JSON.parse(body));
      }
    });
  });

  // Trust a new nest.
  app.get('/trust/:address', isLoggedIn, isAdmin, function(req, res) {
    request(`https://meeppanel.com/rooster/trust/${req.params.address}`,
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
// Pay   =======================================================================
// =============================================================================

  app.get('/pay/credit/add', isLoggedIn, isAdmin, function(req, res) {
    addCredits(req.body, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

// =============================================================================
// Nest  =======================================================================
// =============================================================================

  app.post('/nest/addrole', isLoggedIn, function(req, res) {
    var options = req.body;
    options.owner = req.user.local.email;

    addrole(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/revokerole', isLoggedIn, function(req, res) {
    var options = req.body;
    options.owner = req.user.local.email;

    revokerole(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/register', isLoggedIn, function(req, res) {
    var options = req.body;
    options.owner = req.user.local.email;

    registerNest(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.post('/nest/provision', isLoggedIn, function(req, res) {
    var options = req.body;
    options.owner = req.user.local.email;

    provision(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  app.get('/nest/mynests', isLoggedIn, function(req, res) {
    let options = {
      owner: req.user.local.email
    };
    myNests(options, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

  // different from /prey, /nest/prey shows database data, such as provision stats.
  app.post('/nest/prey', isLoggedIn, isAdmin, function(req, res) {
    viewNest(req.body, (response) => {
      res.status(response.status).jsonp(response.data);
    });
  });

// =============================================================================
// Registry ====================================================================
// =============================================================================

  // Register eggs
  app.get('/registry/register', isLoggedIn, isAdmin, function(req, res) {
    res.render('registerEgg.ejs');
  });

  app.post('/registry/register', isLoggedIn, isAdmin, function(req, res) {
    registerEgg(req.body, (response) => {
      if(debug)
        console.log(chalk.blue(`New Egg Registered by: ${req.user.email}`));

      res.status(response.status).jsonp(response.data);
    });
  });

  // Find All Eggs
  app.get('/registry/list', isLoggedIn, function(req, res) {
    allEggs((response) => {
      res.jsonp(response);
    });
  });

  // Find All Eggs
  app.post('/registry/find', isLoggedIn, function(req, res) {
    findEgg(req.body, (response) => {
      res.status(response.code).jsonp(response.data);
    });
  });


// =============================================================================
// Normal Routes  ==============================================================
// =============================================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
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
  app.post('/profile', isLoggedIn, function(req, res) {
      res.jsonp(req.user);
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------

    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login'), function(req, res) {
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
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
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
    app.get('/connect/local', function(req, res) {
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
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isAdmin(req, res, next) {
    if(req.user.isAdmin) {
      return next();
    }
    res.status(401).jsonp({ error: 'You must be an admin to tap this powerline.' });
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).jsonp({ error: 'You must be logged in to tap this powerline.' });
}
