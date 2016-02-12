/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const mongoose = require('mongoose');
const Notify = require('../notify').Notify;

let Nest = mongoose.model('Nest');

/** @function
 * @name addRole
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.roleType - The type of role to add user to.
 * @param {string} options.user - The user to add to the role group.
 * @return {promise} promise - Returns new promise.
 */
const addRole = function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({address: options.address});
    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/addrole.js',
          '20'
        ));
      }
      if (nests.length) {
        let nest = nests[0];
        if (nest.roles[options.role]) {
          if (options.role === 'owner') {
            resolve({
              status: 403,
              data: {
                error: `You cannot add more than one owner to a Nest.`
              }
            });
          } else {
            if (nest.roles[options.role].indexOf(options.user) > -1) {
              resolve({
                status: 500,
                data: {
                  error:
`User ${options.user} already exists in group ${options.role}.`
                }
              });
            } else {
              nest.roles[options.role].push(options.user);
              nest.save(function(err) {
                if (err) {
                  reject(new Error(
                    'Mongoose save issue.',
                    'nest/addrole.js',
                    '52'
                  ));
                }

                let noti = new Notify({
                  message:
`${options.user} was added to the role ${options.role} on ${nest.address}.`,
                  assignee: nest.roles.owner
                });

                noti.dispatch(() => {
                  // noop
                });

                resolve({
                  status: 200,
                  data: {
                    success:
                      `User ${options.user} added to group ${options.role}.`
                  }
                });
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

module.exports = addRole;
