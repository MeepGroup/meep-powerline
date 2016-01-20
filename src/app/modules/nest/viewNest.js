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
const viewNest = async function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({
      address: options.address
    });

    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/viewNest.js',
          '19'
        ));
      }

      if (nests.length) {
        let nest = nests[0];
        nest.password = 'REDACTED';
        resolve({
          status: 200,
          data: nest
        });
      } else {
        resolve({
          status: 404,
          data: {
            error: `Nest not found!`
          }
        });
      }
    });
  });
};

module.exports = viewNest;
