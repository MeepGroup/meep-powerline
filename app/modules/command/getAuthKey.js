'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

const Nest = mongoose.model('Nest');

/** @function
 * @name getAuthKey
 * @param {object} options - Owner Information
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.address - The address of the server we'd like the authkey for.

 */
const getAuthKey = function(options, callback) {
  const query = Nest.findOne({'address': options.address});

  query.find(function (err, nests) {
    if (err) return handleError(err);
    if(nests.length) {
      const nest = nests[0];
      if(nest.roles.owner === options.email) {
        callback({
          status: 200,
          data: {
            authKey: nest.authKey
          }
        });
      } else {
        callback({
          status: 401,
          data: {
            error: `Unauthorized to access this nest.`
          }
        });
      }
    }else {
      callback({
        status: 404,
        data: {
          error: `Nest not found.`
        }
      });
    }
  });
};

module.exports = getAuthKey;
