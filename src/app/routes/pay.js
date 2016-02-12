/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const {
  addCredits, delCredits
} = require('../modules/');

const payAdd = async function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;

  let response = await addCredits(options);
  res.status(response.status).jsonp(response.data);
};

const payDel = async function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;

  let response = await delCredits(options);
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  payAdd,
  payDel
};
