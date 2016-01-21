'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name hawk
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.authKey - AuthKey for this server.
 * @param {string} options.data - The user to add to the role group.
 * @return {promise} promise - Returns new promise.
 */
const hawk = function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({address: options.address});

    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/hawk.js',
          '20'
        ));
      }
      if (nests.length) {
        let nest = nests[0];
        if (nest.authKey === options.authKey) {
          nest.usage = options.data;
          nest.save(function(err) {
            if (err) {
              reject(new Error(
                'Mongoose save issue.',
                'nest/hawk.js',
                '29'
              ));
            }
            resolve({
              status: 200,
              data: {
                success: 'Data added'
              }
            });
          });
        } else {
          resolve({
            status: 401,
            data: {
              error: `Unauthorized to modify this nest.`
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

module.exports = hawk;
