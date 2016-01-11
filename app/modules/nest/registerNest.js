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
 * @param {funciton} callback - Err response
 */
const registerNest = function(options, callback) {
  let query = Nest.findOne({address: options.address});

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'nest/addrole.js',
        '20'
      ), {});
    }
    if (nests.length) {
      callback(false, {
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
        callback(false, {
          status: 200,
          data: {
            success: `Sucessfully registered nest. Provisioning is suggested
              as a next step.`
          }
        });
      });
    }
  });
};

module.exports = registerNest;
