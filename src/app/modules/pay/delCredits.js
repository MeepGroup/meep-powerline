/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');

/** @function
 * @name delCredits
 * @param {object} options - Add credits options.
 * @param {string} options.email - user to del credits from.
 * @param {string} options.credits - The amount of credits to del.
 * @return {promise} promise - Returns new promise.
 */

const delCredits = function(options) {
  return new Promise((resolve, reject) => {
    let query = User.findOne({'local.email': options.email});

    query.find(function(err, users) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'pay/delCredits.js',
          '18'
        ));
      }

      if (users.length) {
        let user = users[0];

        user.account.credits -= parseFloat(options.credits);
        user.save(err => {
          if (err) {
            reject(new Error(
              'Mongoose save issue.',
              'pay/delCredits.js',
              '30'
            ));
          }

          resolve({
            status: 200,
            data: {
              success: `Successfully removed ${options.credits} from ${options.email}'s account.`
            }
          });
        });
      } else {
        resolve({
          status: 404,
          data: {
            error: `User with email ${options.email} not found.`
          }
        });
      }
    });
  });
};

module.exports = delCredits;
