/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const {register, all, find} = require('../modules');

const registryRegister = async function(req, res) {
  let response = await register(req.body);
  res.status(response.status).jsonp(response.data);
};

const registryFind = async function(req, res) {
  let response = await find(req.body);
  res.status(response.status).jsonp(response.data);
};

const registryAll = async function(req, res) {
  let response = await all();
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  registryRegister,
  registryAll,
  registryFind
};
