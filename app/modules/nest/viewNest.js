'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name viewNest
 * @param {object} options - options
 * @param {string} options.owner - The owner of the nest.
 * @param {object} options.address - The address of the server.
 * @param {function} callback - err, Response
 */
const viewNest = function(options, callback) {
  let query = Nest.findOne({
    address: options.address
  });

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'nest/viewNest.js',
        '19'
      ), {});
    }

    if (nests.length) {
      let nest = nests[0];
      nest.password = 'REDACTED';
      callback(false, {status: 200, data: nest});
    } else {
      callback(false, {status: 404, data: {
        error: `Nest not found!`
      }});
    }
  });
};

module.exports = viewNest;
