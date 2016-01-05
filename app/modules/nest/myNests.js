'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');

let Nest = mongoose.model('Nest');

/** @function
 * @name myNests
 */
const myNests = function(options, callback) {
  let query = Nest.findOne({
    'roles.owner': options.owner
  });

  query.find(function (err, nests) {
    if (err) return handleError(err);

    if(nests.length) {
      nests.map((nest, i) => {
        nests[i].password = "REDACTED"
      });
      callback({status: 200, data: nests});
    }else {
      callback({status: 404, data: {
        error: `No nests found!`
      }});
    }
  });
};

module.exports = myNests;
