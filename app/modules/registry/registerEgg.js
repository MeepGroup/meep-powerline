'use strict';

const mongoose = require('mongoose');

var Egg = mongoose.model('Egg');

/** @function
 * @name registerEgg
 * @param {object} options - Egg options
 * @param {string} options.version - The version of the Egg.
 * @param {string} options.eggName - The name of the egg.
 * @param {object} options.egg - The egg.
 */

const registerEgg = function(options, callback) {
  var query = Egg
      .findOne({
        'name': options.eggName,
        'version': options.version });

  query.find(function (err, egg) {
    if (err) return handleError(err);
    if(egg.length) {
      callback({
        status: 500,
        data: {
          error: `${options.eggName} Egg with this version already exists,
            Please bump version.`
        }
      });
    }else {
      console.log(options);
      var newEgg = new Egg({
        version: options.version,
        name: options.eggName,
        egg: options.egg
      });
      newEgg.save(function(err){
        if(err) {
          callback(err);
        }
        callback({
          status: 200,
          data: {
            success: `${options.eggName} Egg created and stored on the
              registry.`
          }
        })
      });
    }
  });
};

module.exports = registerEgg;
