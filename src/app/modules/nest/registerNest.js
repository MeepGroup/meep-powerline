'use strict';

const mongoose = require('mongoose');

let Nest = mongoose.model('Nest');

/** @function
 * @name registerNest
 * @param {object} options - Server information
 * @param {string} options.user - The user for logging into the server.
 * @param {string} options.address - The address of the server.
 * @param {number} options.port - The port for the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.password - The password for the server.
 * @return {promise} promise - Returns new promise.
 */
const registerNest = function(options) {
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
      if (nests.length) {
        resolve({
          status: 200,
          data: {
            error: `Machine is already registered.`
          }
        });
      } else {
        let newNest = new Nest({
          registeredAt: Date.now(),
          user: options.user,
          address: options.address,
          details: {
            os: options.os,
            provider: options.provider,
            package: options.package,
            location: options.location,
            network: options.network
          },
          name: options.name,
          port: options.port,
          roles: {
            owner: options.owner
          },
          password: options.password
        });
        newNest.save(err => {
          if (err) {
            console.warn(err);
          }
          resolve({
            status: 200,
            data: {
              success: `Sucessfully registered nest. Provisioning is suggested
                as a next step.`
            }
          });
        });
      }
    });
  });
};

module.exports = registerNest;
