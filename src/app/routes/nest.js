'use strict';

const {
  addrole, revokerole, registerNest, provision, myNests, viewNest, hawk, install
} = require('../modules/');

const meepConfig = require('../../config/meepConfig.js');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const nestHawk = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/hawk`
      )
    );
  }

  let options = req.body;

  let response = await hawk(options);
  res.status(response.status).jsonp(response.data);
};

const nestInstall = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/hawk`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;

  let response = await install(options);
  res.status(response.status).jsonp(response.data);
};

const nestAddrole = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/addrole`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;
  let response = await addrole(options);

  console.log(response);
  res.status(response.status).jsonp(response.data);
};

const nestRevokerole = async function(req, res) {
  if (debug) {
    console.log(chalk.cyan(`[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/revokerole`));
  }
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await revokerole(options);
  res.status(response.status).jsonp(response.data);
};

const nestRegister = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/register`
      )
    );
  }

  let options = req.body;
  options.owner = req.user.local.email;

  let response = await registerNest(options);
  res.status(response.status).jsonp(response.data);
};

const nestProvision = async function(req, res) {
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

  let response = await provision(options);
  res.status(response.status).jsonp(response.data);
};

const nestMyNests = async function(req, res) {
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

  let response = await myNests(options);
  res.status(response.status).jsonp(response.data);
};

const nestPrey = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /nest/prey`
      )
    );
  }

  let response = await viewNest(req.body);
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  nestAddrole,
  nestRevokerole,
  nestRegister,
  nestProvision,
  nestMyNests,
  nestPrey,
  nestHawk,
  nestInstall
};
