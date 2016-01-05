'use strict';

const {
  getAuthKey
} = require('../modules/');

const {
  debug
} = require('../../config/global.js');

const chalk = require('chalk');

const daemon = function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;
  options.address = req.params.address;

  getAuthKey(options, (response) => {
    res.redirect(
      307,
      `http://localhost:3003/${req.params.action}/${response.data.authKey}`
    );
  });
};

module.exports = {
  daemon
};
