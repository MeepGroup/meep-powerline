'use strict';

const {
  getAuthKey
} = require('../modules/');

const daemon = function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.params.address;

  getAuthKey(options, (err, response) => {
    if (err) {
      res.status(500).jsonp(err);
    } else {
      res.redirect(
        307,
        `http://localhost:3003/${req.params.action}/${response.data.authKey}`
      );
    }
  });
};

module.exports = {
  daemon
};
