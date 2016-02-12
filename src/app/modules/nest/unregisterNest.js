/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name unregisterNest
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.owner - The owner of the server.
 * @return {promise} promise - Returns new promise.
 */
const unregisterNest = function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({address: options.address});

    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/addrole.js',
          '20'
        ));
      }
      if (!nests.length) {
        resolve({
          status: 404,
          data: {
            error: `Machine not found.`
          }
        });
      } else {
        let nest = nests[0];
        nest.remove(err => {
          if (err) {
            resolve({
              status: 500,
              data: {
                error: `Error removing machine.`
              }
            });
          } else {
            resolve({
              status: 404,
              data: {
                error: `Machine removed from Meep.`
              }
            });
          }
        });
      }
    });
  });
};

module.exports = unregisterNest;
