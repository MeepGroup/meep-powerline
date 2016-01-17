'use strict';

const chalk = require('chalk');

const {
  debug
} = require('../../config/global.js');

const {register, all, find} = require('../modules');

const registryRegister = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/register`
      )
    );
  }

  register(req.body, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const registryFind = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/find`
      )
    );
  }

  find(req.body, (err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

const registryAll = function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/all`
      )
    );
  }

  all((err, response) => {
    if (err) {
      console.warn(err);
    }
    res.status(response.status).jsonp(response.data);
  });
};

module.exports = {
  registryRegister,
  registryAll,
  registryFind
};
