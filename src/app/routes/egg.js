/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const {
  install
} = require('../modules/');

const eggInstall = function(req, res) {
  let options = req.body;
  options.email = req.user.local.email;

  install(options, (err, response) => {
    if (err) {
      res.status(500).jsonp(err);
    } else {
      res.status(response.status).jsonp(response.data);
    }
  });
};

module.exports = {
  eggInstall
};
