'use strict';

const mongoose = require('mongoose');

const Nest = mongoose.model('Nest');

/** @function
 * @name getAuthKey
 * @param {object} options - Owner Information
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.address - The address of the server we'd like the authkey for.
 * @param {function} callback - Returns error if true, and data
 */
const getAuthKey = function(options, callback) {
  const query = Nest.findOne({
    address: options.address
  });

  query.find(function(err, nests) {
    if (err) {
      return callback(err, {});
    }

    if (nests.length) {
      const nest = nests[0];
      if (nest.roles.owner === options.email) {
        callback(false, {
          status: 200,
          data: {
            authKey: nest.authKey
          }
        });
      } else {
        callback(new Error(
          'Unauthorized to access this nest.',
          'getAuthKey.js',
          '30'
        ), {
          status: 401,
          data: {
            error: `Unauthorized to access this nest.`
          }
        });
      }
    } else {
      callback(new Error(
        'Nest not found.',
        'getAuthKey.js',
        '44'
      ), {
        status: 404,
        data: {
          error: `Nest not found.`
        }
      });
    }
  });
};

module.exports = getAuthKey;
