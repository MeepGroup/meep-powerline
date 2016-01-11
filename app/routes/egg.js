'use strict';

const chalk = require('chalk');

const {
  install
} = require('../modules/');

const {
  debug
} = require('../../config/global.js');

const eggInstall = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /egg/install`
      )
    );
  }

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
