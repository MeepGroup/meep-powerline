/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const {
  exec, getAuthKey
} = require('../modules/');

const cmdExec = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  let response = await exec(options);
  res.status(response.status).jsonp(response);
};

module.exports = {
  cmdExec
};
