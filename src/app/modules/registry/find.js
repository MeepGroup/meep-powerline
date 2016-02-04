'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name find
 * @param {object} options - Query options (name / version)
 * @param {funciton} callback - Err response
 * @return {promise} promise - Returns new promise
 */
const find = function(options) {
  return new Promise((resolve, reject) => {
    if (options.name && options.version) {
      let query = Yolk.find({name: options.name, version: options.version});
      query.find(function(err, yolks) {
        if (err) {
          reject(new Error(
            'Unknown Mongoose issue.',
            'nest/addrole.js',
            '20'
          ));
        }
        if (yolks.length) {
          let transpiled = {};

          if (yolks[0].module) {
            let module = require(`../../../yolks/${yolks[0].module}.yolk.js`);
            module.transpile((tasks, translator, uninstall) => {
              transpiled = {
                tasks,
                translator,
                uninstall
              };
            });
          }
          resolve({
            status: 200,
            data: {
              yolk: yolks[0],
              module: transpiled
            }
          });
        } else {
          resolve({
            status: 404,
            data: {
              error: 'Yolk not found.'
            }
          });
        }
      });
    } else {
      resolve({
        status: 400,
        data: {
          error: 'Missing one or more required options.'
        }
      });
    }
  });
};

module.exports = find;
