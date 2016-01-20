'use strict';

const chalk = require('chalk');

const {
  debug
} = require('../../config/global.js');

const {register, all, find} = require('../modules');

const registryRegister = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/register`
      )
    );
  }

  let response = await register(req.body);
  res.status(response.status).jsonp(response.data);
};

const registryFind = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/find`
      )
    );
  }

  let response = await find(req.body);
  res.status(response.status).jsonp(response.data);
};

const registryAll = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] /registry/all`
      )
    );
  }

  let response = await all();
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  registryRegister,
  registryAll,
  registryFind
};
