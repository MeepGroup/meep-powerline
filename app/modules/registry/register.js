'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name register
 * @param {object} options - Yolk Info
 * @param {string} options.name - The name of the Yolk
 * @param {string} options.version - The version of the Yolk
 * @param {number} options.module - The module which should be used.
 * @param {funciton} callback - Err response
 */
const register = function(options, callback) {
  let query = Yolk.findOne({name: options.name, version: options.version});
  if (options.name && options.version && options.module) {
    query.find(function(err, yolks) {
      if (err) {
        callback(new Error(
          'Unknown Mongoose issue.',
          'nest/addrole.js',
          '20'
        ), {});
      }
      if (yolks.length) {
        callback(false, {
          status: 200,
          data: {
            error: `Yolk is already registered.`
          }
        });
      } else {
        let newYolk = new Yolk({
          registeredAt: Date.now(),
          name: options.name,
          version: options.version,
          module: options.module
        });
        newYolk.save(err => {
          if (err) {
            console.warn(err);
          }
          callback(false, {
            status: 200,
            data: {
              success: `Sucessfully registered new Yolk.`,
              yolk: newYolk
            }
          });
        });
      }
    });
  } else {
    callback(false, {
      status: 400,
      data: {
        success: `Missing nessicary options.`
      }
    });
  }
};

module.exports = register;
