'use strict';

const mongoose = require('mongoose');
const Notify = require('../notify').Notify;

let Nest = mongoose.model('Nest');

/** @function
 * @name revokeRole
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.roleType - The type of role to add user to.
 * @param {string} options.user - The user to add to the role group.
 * @param {function} callback - Err, response
 */
const revokeRole = function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({address: options.address});

    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/revokerole.js',
          '21'
        ));
      }
      if (nests.length) {
        let nest = nests[0];
        if (nest.roles[options.role]) {
          if (options.role === 'owner') {
            resolve({
              status: 403,
              data: {
                error: `You cannot remove an one owner to a Nest.`
              }
            });
          } else {
            if (nest.roles[options.role].indexOf(options.user) > -1) {
              let index = nest.roles[options.role].indexOf(options.user);
              nest.roles[options.role].splice(index, 1);
              nest.save(function(err) {
                if (err) {
                  console.warn(err);
                }

                let noti = new Notify({
                  message: `${options.user} has been added removed from the role ${options.role} on your nest: ${nest.address}.`,
                  assignee: nest.roles.owner
                });

                noti.dispatch(data => {
                  console.log(data);
                });

                resolve({
                  status: 200,
                  data: {
                    error: `User ${options.user} removed from group
                      ${options.role}.`
                  }
                });
              });
            } else {
              resolve({
                status: 404,
                data: {
                  error: `User ${options.user} is not in group ${options.role}.`
                }
              });
            }
          }
        } else {
          resolve({
            status: 404,
            data: {
              error: `Role ${options.role} not found.`
            }
          });
        }
      } else {
        resolve({
          status: 404,
          data: {
            error: `Nest not found.`
          }
        });
      }
    });
  });
};

module.exports = revokeRole;
