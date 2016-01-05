'use strict';
const mongoose = require('mongoose');

let Egg = mongoose.model('Egg');

/** @function
 * @name allEggs
 * @param {function} callback
 */

const allEggs = function(callback) {
  let query = Egg;

  query.find(function (err, eggs) {
    if (err) return handleError(err);
    if(eggs) {
      callback(eggs);
    }else {
      callback({
        success: `No eggs are stored on the registry.`
      })
    }
  });
};

module.exports = allEggs;
