'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name hawk
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.authKey - AuthKey for this server.
 * @param {string} options.data - The user to add to the role group.
 * @param {function} callback - Response sent here.
 */
const hawk = function(options, callback) {
  let query = Nest.findOne({address: options.address});

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'nest/hawk.js',
        '20'
      ), {});
    }
    if (nests.length) {
      let nest = nests[0];
      if (nest.authKey === options.authKey) {
        nest.usage = options.data;
        nest.save(function(err) {
          if (err) {
            callback(new Error(
              'Mongoose save issue.',
              'nest/hawk.js',
              '29'
            ), {});
          }
          callback(false, {
            status: 200,
            data: {
              success: 'Data added'
            }
          });
        });
      } else {
        callback(new Error(
          `Unauthorized to modify this nest.`,
          'nest/hawk.js',
          '40'
        ), {
          status: 401,
          data: {
            error: `Unauthorized to modify this nest.`
          }
        });
      }
    } else {
      callback(new Error(
        `Nest not found.`,
        'nest/addrole.js',
        '91'
      ), {
        status: 404,
        data: {
          error: `Nest not found.`
        }
      });
    }
  });
};

module.exports = hawk;
