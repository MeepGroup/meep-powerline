/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const mongoose = require('mongoose');

let Yolk = mongoose.model('Yolk');

/** @function
 * @name all
 * @return {promise} promise - Returns new promise.
 */
const all = function() {
  return new Promise((resolve, reject) => {
    let query = Yolk.find();
    query.find(function(err, yolks) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/addrole.js',
          '20'
        ));
      }
      (function transpileAndRepeat(i) {
         let transpiled = {};

         if (yolks[i].module) {
            let module = require(`../../../yolks/${yolks[i].module}.yolk.js`);
            module.transpile((tasks, translator, uninstall) => {
              transpiled = {
                tasks,
                translator,
                uninstall
              };
            });
         }
         
         yolks[i].transpiled = transpiled;
         
         if (i + 1 < yolks.length) {
            transpileAndRepeat(i + 1);
         } else {
            resolve({
              status: 200,
              data: {
                yolks: yolks
              }
            });
         }
      })(0);
    });
  });
};

module.exports = all;
