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

      let allYolks = yolks;
      (function transpileAndRepeat(i) {

         if (allYolks[i].module) {
            let module = require(`../../../yolks/${allYolks[i].module}.yolk.js`);
            module.transpile((tasks, translator, uninstall) => {
              allYolks[i] = {
                info: allYolks[i],
                tasks,
                translator,
                uninstall
              };
            });
         }
          
         if (i + 1 < allYolks.length) {
            transpileAndRepeat(i + 1);
         } else {
            resolve({
              status: 200,
              data: {
                yolks: allYolks
              }
            });
         }
      })(0);
    });
  });
};

module.exports = all;
