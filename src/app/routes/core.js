/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const root = function(req, res) {
  res.jsonp({
    status: 200
  });
};

module.exports = {
  root
};
