'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');

/** @function
 * @name delCredits
 * @param {object} options - Add credits options.
 * @param {string} options.email - user to del credits from.
 * @param {string} options.credits - The amount of credits to del.
 * @param {callback} callback - Returns success or error.
 */

const delCredits = function(options, callback) {
  let query = User.findOne({'local.email': options.email});

  query.find(function (err, users) {
    if (err) return handleError(err);
    if (users.length) {
      let user = users[0];

      user.account.credits -= parseFloat(options.credits);
      user.save((err) => {
        if (err) console.log(err);
        callback({
          status: 200,
          data: {
            success: `Successfully removed ${options.credits} to
              ${options.email}'s account.`
          }
        });
      });
    } else{
      callback({
        status: 404,
        data: {
          error: `User with email ${options.email} not found.`
        }
      });
    }
  });
};

module.exports = delCredits;
