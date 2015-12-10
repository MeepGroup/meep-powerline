const request = require('request');

module.exports = function(app, passport) {


// =============================================================================
// Meat and Bones  =============================================================
// =============================================================================

  // Get stats on a nest by address
  app.get('/prey/:address', isLoggedIn, function(req, res) {
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
  app.get('/trust/:address', isLoggedIn, function(req, res) {
    request(`https://meeppanel.com/rooster/trust/${req.params.address}`,
    function (error, response, body) {
      if(error){
        res.status(500).jsonp(error);
      }else{
        res.jsonp(JSON.parse(body));
      }
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
    app.get('/profile', isLoggedIn, function(req, res) {
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
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


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
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.status(401).jsonp({ error: 'You must be logged in to tap this powerline.' });
}
