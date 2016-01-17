'use strict';

const root = function(req, res) {
  res.jsonp({
    status: 200
  });
};

module.exports = {
  root
};
