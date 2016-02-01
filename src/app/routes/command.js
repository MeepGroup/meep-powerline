'use strict';

const {
  exec
} = require('../modules/');

const cmdExec = async function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;

  let response = await exec(options);
  res.status(response.status).jsonp(response);
};

module.exports = {
  cmdExec
};
