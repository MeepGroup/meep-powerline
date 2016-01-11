'use strict';

const {
  registerEgg, allEggs, findEgg
} = require('../modules/');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const registryRegisterGet = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /registry/register`
      )
    );
  }

  res.render('registerEgg.ejs');
};

const registryRegister = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /registry/register`
      )
    );
  }

  registerEgg(req.body, (err, response) => {
    if (err) {
      console.warn(err);
    }
    if (debug) {
      console.log(
        chalk.yellow(
          `New Egg Registered by: ${req.user.email}`
        )
      );
    }

    res.status(response.status).jsonp(response.data);
  });
};

const registryList = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /registry/list`
      )
    );
  }

  allEggs((err, response) => {
    if (err) {
      console.warn(err);
    }
    res.jsonp(response);
  });
};

const registryFind = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /registry/find`
      )
    );
  }

  findEgg(req.body, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.code).jsonp(response.data);
  });
};

module.exports = {
  registryRegister, registryList, registryFind, registryRegisterGet
};
