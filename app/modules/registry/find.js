'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name find
 * @param {object} options - Query options (name / version)
 * @param {funciton} callback - Err response
 */
const find = function(options, callback) {
  if (options.name && options.version) {
    let query = Yolk.find({name: options.name, version: options.version});
    query.find(function(err, yolks) {
      if (err) {
        callback(new Error(
          'Unknown Mongoose issue.',
          'nest/addrole.js',
          '20'
        ), {});
      }
      callback(false, {
        status: 200,
        data: {
          yolks: yolks
        }
      });
    });
  } else {
    callback(false, {
      status: 400,
      data: {
        error: 'Missing one or more required options.'
      }
    });
  }
};

module.exports = find;
