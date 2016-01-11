'use strict';

const {
  getAuthKey
} = require('../modules/');

const {
  cmdShimPort, debug
} = require('../../config/global.js');

const chalk = require('chalk');

const commandIssue = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /command/issue`
      )
    );
  }

  // get authkey with mongon if we own this server, then redirect the request
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.body.address;

  getAuthKey(options, (err, response) => {
    if (err) {
      res.status(500).jsonp(err);
    } else {
      res.redirect(
        307,
        `http://${options.address}:${cmdShimPort}/cmd/${response.data.authKey}`
      );
    }
  });
};

const commandShim = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /command/shim/add/${req.params.address}`
      )
    );
  }

  // get authkey with mongon if we own this server, then redirect the request
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.params.address;

  getAuthKey(options, (err, response) => {
    if (err) {
      res.status(500).jsonp(err);
    } else {
      res.redirect(
        307,
        `http://${options.address}:${cmdShimPort}/mod/add/${response.data.authKey}`
      );
    }
  });
};

module.exports = {
  commandIssue,
  commandShim
};