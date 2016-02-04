'use strict';

const mongoose = require('mongoose');

const Nest = mongoose.model('Nest');

/** @function
 * @name getAuthKey
 * @param {object} options - Owner Information
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.address - The address of the server we'd like the authkey for.
 * @param {function} callback - Returns error if true, and data
 * @return {promise} promise - Returns new promise.
 */
const getAuthKey = function(options) {
  return new Promise((resolve, reject) => {
    const query = Nest.findOne({
      address: options.address
    });

    query.find(function(err, nests) {
      if (err) {
        return reject(err);
      }

      if (nests.length) {
        const nest = nests[0];
        if (nest.roles.owner === options.owner) {
          resolve({
            status: 200,
            data: {
              authKey: nest.authKey
            }
          });
        } else {
          resolve({
            status: 401,
            data: {
              error: `Unauthorized to access this nest.`
            }
          });
        }
      } else {
        resolve({
          status: 404,
          data: {
            error: `Nest not found.`
          }
        });
      }
    });
  });
};

module.exports = getAuthKey;
