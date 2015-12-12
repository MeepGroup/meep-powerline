'use strict';
const mongoose = require('mongoose');

var Egg = mongoose.model('Egg');

/** @function
 * @name allEggs
 * @param {function} callback
 */

const findEgg = function(options, callback) {
  var query = Egg.findOne({
    'name': options.name,
    'version': options.version
  });

  query.find(function (err, egg) {
    if (err) return handleError(err);
    if(egg[0]) {
      callback({
        code: 200,
        data: egg[0]
      });
    }else {
      callback({
        code: 404,
        data: {
          success: `No eggs found in the registry with provided data.`
        }
      })
    }
  });
};

module.exports = findEgg;
