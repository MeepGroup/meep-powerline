'use strict';

const {
  addrole, revokerole, registerNest, provision, myNests, viewNest, hawk
} = require('../modules/');

const meepConfig = require('../../config/meepConfig.js');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const nestHawk = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/hawk`
      )
    );
  }

  let options = req.body;

  hawk(options, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

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
  options.meepConfig = meepConfig(req.body.address);

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
  nestPrey,
  nestHawk
};
