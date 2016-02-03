'use strict';

const {
  install
} = require('../modules/');

const eggInstall = function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;

  install(options, (err, response) => {
    if (err) {
      res.status(500).jsonp(err);
    } else {
      res.status(response.status).jsonp(response.data);
    }
  });
};

module.exports = {
  eggInstall
};
