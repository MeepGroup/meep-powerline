'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');

var Nest = mongoose.model('Nest');

/** @function
 * @name viewNest
 * @param {object} options - options
 * @param {string} options.owner - The owner of the nest.
 * @param {object} options.address - The address of the server.
 */
const viewNest = function(options, callback) {
  var query = Nest.findOne({
    'address': options.address
  });

  query.find(function (err, nests) {

    if (err) return handleError(err);

    if(nests.length) {
      let nest = nests[0];
      nest.password = 'REDACTED';
      callback({status: 200, data: nest});
    }else {
      callback({status: 404, data: {
        error: `Nest not found!`
      }});
    }
  });
};

module.exports = viewNest;
