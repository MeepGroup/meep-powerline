/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const {
  deleteNotification, toggleLocked, markSeen, notifyNewNotification,
  getMyNotifications
} = require('./routes/notify.js');

const {root} = require('./routes/core.js');

const {payAdd, payDel} = require('./routes/pay.js');
const {
  nestAddrole, nestRevokerole, nestProvision, nestRegister, nestMyNests,
  nestPrey, nestHawk, nestInstall, nestUninstall, nestUnregister
} = require('./routes/nest.js');

const {
  cmdExec
} = require('./routes/command.js');

const {
  registryRegister, registryAll, registryFind
} = require('./routes/registry.js');

const {
  spawn, despawn, cycle, instance, instances
} = require('./routes/instance.js');

module.exports = function(app, passport) {
// =============================================================================
// Instance ====================================================================
// =============================================================================

  app.post('/instance/spawn', isLoggedIn, spawn);
  app.post('/instance/despawn', isLoggedIn, despawn);
  app.post('/instance/cycle', isLoggedIn, cycle);
  app.post('/instance', isLoggedIn, instance);
  app.post('/instances', isLoggedIn, instances);

// =============================================================================
// Registry ====================================================================
// =============================================================================

  app.post('/registry/register', isLoggedIn, isAdmin, registryRegister);
  app.post('/registry/all', isLoggedIn, registryAll);
  app.post('/registry/find', isLoggedIn, registryFind);

// =============================================================================
// Notify ======================================================================
// =============================================================================

  app.post('/notify/add', isLoggedIn, notifyNewNotification);
  app.post('/notify/del', isLoggedIn, deleteNotification);
  app.post('/notify/seen', isLoggedIn, markSeen);
  app.post('/notify/togglelock', isLoggedIn, toggleLocked);
  app.post('/notify', isLoggedIn, getMyNotifications);

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
  app.post('/nest/unregister', isLoggedIn, nestUnregister);
  app.post('/nest/provision', isLoggedIn, nestProvision);
  app.get('/nest/mynests', isLoggedIn, nestMyNests);
  app.post('/nest/hawk', nestHawk);
  app.post('/nest/prey', isLoggedIn, isAdmin, nestPrey);
  app.post('/nest/install', isLoggedIn, nestInstall);
  app.post('/nest/uninstall', isLoggedIn, nestUninstall);
  app.post('/nest/exec', isLoggedIn, cmdExec);

// =============================================================================
// Normal Routes  ==============================================================
// =============================================================================

  app.get('/', root);

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

  app.get('/login', function(req, res) {
    res.jsonp({error: req.flash('loginMessage')});
  });

  // process the login form
  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({
        success : false,
        message : 'Incorrect email or password.'
      });
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({
        success : true,
        message : 'authentication succeeded'
      });
    });
    })(req, res, next);
  });

  // SIGNUP =================================
  app.get('/signup', function(req, res) {
    res.jsonp({error: req.flash('signupMessage')});
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      failureRedirect : '/signup',
      failureFlash : true
  }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

  // locally --------------------------------
  app.get('/connect/local',
  function(req, res) {
    res.render('connect-local.ejs', {message: req.flash('loginMessage')});
  });

  app.post('/connect/local', passport.authenticate('local-signup', {
    // redirect to the secure profile section
    successRedirect: '/profile',
    // redirect back to the signup page if there is an error
    failureRedirect: '/connect/local',
    // allow flash messages
    failureFlash: true
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
    let user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      if (err) {
        console.warn(err);
      }
      res.redirect('/profile');
    });
  });
};

// =============================================================================
// MIDDLEWARE ==================================================================
// =============================================================================

// route middleware to ensure user is logged in
/** @function
 * @name isAdmin
 * @param {object} req - request
 * @param {object} res - response
 * @param {function} next - Continues to next function
 * @return {function} next - Calls nest function
 */
function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }
  res.status(401).jsonp({
    error: 'You must be an admin to tap this powerline.'
  });
}

// route middleware to ensure user is logged in
/** @function
 * @name isLoggedIn
 * @param {object} req - request
 * @param {object} res - response
 * @param {function} next - Continues to next function
 * @return {function} next - Calls nest function
 */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).jsonp({
    error: 'You must be logged in to tap this powerline.'
  });
}
