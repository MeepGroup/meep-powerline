'use strict';

const {
  addrole, revokerole, registerNest, provision, myNests, viewNest
} = require('../modules/');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const nestAddrole = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/addrole`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;

  addrole(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const nestRevokerole = function(req, res) {
  if (debug) {
    console.log(chalk.cyan(`[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/revokerole`));
  }
  let options = req.body;
  options.owner = req.user.local.email;

  revokerole(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const nestRegister = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/register`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;

  registerNest(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const nestProvision = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/provision`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;

  provision(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const nestMyNests = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/mynests`
      )
    );
  }

  let options = {
    owner: req.user.local.email
  };
  myNests(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const nestPrey = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/prey`
      )
    );
  }

  viewNest(req.body, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

module.exports = {
  nestAddrole,
  nestRevokerole,
  nestRegister,
  nestProvision,
  nestMyNests,
  nestPrey
};
