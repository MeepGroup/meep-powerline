'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name register
 * @param {object} options - Yolk Info
 * @param {string} options.name - The name of the Yolk
 * @param {string} options.version - The version of the Yolk
 * @param {number} options.module - The module which should be used.
 * @return {promise} promise - Returns new promise.
 */
const register = function(options) {
  return new Promise((resolve, reject) => {
    let query = Yolk.findOne({name: options.name, version: options.version});
    if (options.name && options.version && options.module) {
      query.find(function(err, yolks) {
        if (err) {
          reject(new Error(
            'Unknown Mongoose issue.',
            'nest/addrole.js',
            '20'
          ));
        }
        if (yolks.length) {
          resolve({
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
            resolve({
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
      resolve({
        status: 400,
        data: {
          success: `Missing nessicary options.`
        }
      });
    }
  });
};

module.exports = register;
