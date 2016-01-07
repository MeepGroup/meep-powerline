'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');
const Notify = require('../notify').Notify;

/** @function
 * @name addCredits
 * @param {object} options - Add credits options.
 * @param {string} options.email - user to add credits to.
 * @param {string} options.credits - The amount of credits to add.
 * @param {callback} callback - Returns success or error.
 */

const addCredits = function(options, callback) {
  let query = User.findOne({'local.email': options.email});

  query.find(function (err, users) {
    if (err) return handleError(err);
    if (users.length) {
      let user = users[0];

      user.account.credits += parseFloat(options.credits);
      user.save((err) => {
        if (err) console.log(err);
        let noti = new Notify({
          message: `$${options.credits} has been added to your account.`,
          assignee: options.email
        });

        noti.dispatch((data) => {
          console.log(data);
        });

        callback({
          status: 200,
          data: {
            success: `Successfully added ${options.credits} to
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

module.exports = addCredits;
