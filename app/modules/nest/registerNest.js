'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

var Nest = mongoose.model('Nest');

/** @function
 * @name registerNest
 * @param {object} options - Server information
 * @param {string} options.user - The user for logging into the server.
 * @param {string} options.address - The address of the server.
 * @param {number} options.port - The port for the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.password - The password for the server.
 */
const registerNest = function(options, callback) {
  var query = Nest.findOne({'address': options.address});

  query.find(function (err, nests) {
    if (err) return handleError(err);
    if(nests.length) {
      let nest = nests[0];
      callback({
        status: 200,
        data: {
          error: `Machine is already registered.`
        }
      });
    }else {
      var newNest = new Nest({
        registered_at: Date.now(),
        user: options.user,
        address: options.address,
        name: options.name,
        port: options.port,
        roles: {
          owner: options.owner
        },
        password: options.password
      });
      newNest.save((err) => {
        callback({
          status: 200,
          data: {
            success: `Sucessfully registered nest. Provisioning is suggested
              as a next step.`
          }
        });
        console.log(err);
      });
    }
  });
};

module.exports = registerNest;
