'use strict';

const chalk = require('chalk');

const {
  install
} = require('../modules/');

const {
  cmdShimPort, apiAddr, debug
} = require('../../config/global.js');

const eggInstall = function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /egg/install`));

  let options = req.body;
  options.email = req.user.local.email;

  install(options, (response) => {
    res.status(response.status).jsonp(response.data);
  });
};

module.exports = {
  eggInstall
};
