'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name registerShim
 * @param {object} options - Owner Information
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.address - The address of the server.
 * @param {string} options.shimName - The name of the shim being added.
 * @param {function} callback - Returned shim response
 */
const registerShim = function(options, callback) {
  let query = Nest.findOne({address: options.address});

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'registerShim.js',
        '22'
      ), {});
    }
    if (nests.length) {
      let nest = nests[0];
      if (nest.roles.owner === options.email) {
        if (nest.shims && !(nest.shims.indexOf(options.shimName) > -1)) {
          callback(false, {
            status: 409,
            data: {
              error: `The shim ${options.shimName} already exists on the server.`
            }
          });
        } else {
          if (nest.shims) {
            nest.shims.push(options.shimName);
          }
          if (!nest.shims) {
            nest.shims = [options.shimName];
          }
          callback(false, {
            status: 200,
            data: {
              error: `The shim ${options.shimName} has been registered for the server.`
            }
          });
        }
      } else {
        callback(new Error(
          'Unauthorized to access this nest.',
          'registerShim.js',
          '51'
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
        'registerShim.js',
        '63'
      ), {
        status: 404,
        data: {
          error: `Nest not found.`
        }
      });
    }
  });
};

module.exports = registerShim;
