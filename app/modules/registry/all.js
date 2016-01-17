'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name all
 * @param {funciton} callback - Err response
 */
const all = function(callback) {
  let query = Yolk.find();
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
};

module.exports = all;
