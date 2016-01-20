'use strict';

const {
  addCredits, delCredits
} = require('../modules/');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const payAdd = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /pay/credit/add`
      )
    );
  }

  let options = req.body;
  options.email = req.user.local.email;

  let response = await addCredits(options);
  res.status(response.status).jsonp(response.data);
};

const payDel = async function(req, res) {
  if (debug) {
    console.log(
      chalk.cyan(
        `[${Date.now()}] Connection from ${req.connection.remoteAddress} at /pay/credit/del`
      )
    );
  }
  let options = req.body;
  options.email = req.user.local.email;

  let response = await delCredits(options);
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  payAdd,
  payDel
};
