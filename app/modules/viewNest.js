'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');

var Nest = mongoose.model('Nest');

/** @function
 * @name registerEgg
 * @param {object} options - Egg options
 * @param {string} options.version - The version of the Egg. Must not already exist.
 * @param {string} options.eggName - The name of the egg.
 * @param {object} options.egg - The egg.
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
