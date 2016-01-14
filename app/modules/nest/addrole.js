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
 * @param {function} callback - Response sent here.
 */
const addRole = function(options, callback) {
  let query = Nest.findOne({address: options.address});

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'nest/addrole.js',
        '20'
      ), {});
    }
    if (nests.length) {
      let nest = nests[0];
      if (nest.roles[options.role]) {
        if (options.role === 'owner') {
          callback(false, {
            status: 403,
            data: {
              error: `You cannot add more than one owner to a Nest.`
            }
          });
        } else {
          if (nest.roles[options.role].indexOf(options.user) > -1) {
            callback(new Error(
              `User ${options.user} already exists in group ${options.role}.`,
              'addrole.js',
              '39'
            ), {
              status: 500,
              data: {
                error: `User ${options.user} already exists in group
                  ${options.role}.`
              }
            });
          } else {
            nest.roles[options.role].push(options.user);
            nest.save(function(err) {
              if (err) {
                callback(new Error(
                  'Mongoose save issue.',
                  'nest/addrole.js',
                  '52'
                ), {});
              }

              let noti = new Notify({
                message: `${options.user} has been added to the role
                  ${options.role} on your nest: ${nest.address}.`,
                assignee: nest.roles.owner
              });

              noti.dispatch(data => {
                console.log(data);
              });

              callback(false, {
                status: 200,
                data: {
                  success: `User ${options.user} added to group
                    ${options.role}.`
                }
              });
            });
          }
        }
      } else {
        callback(new Error(
          `Role ${options.role} not found.`,
          'nest/addrole.js',
          '79'
        ), {
          status: 404,
          data: {
            error: `Role ${options.role} not found.`
          }
        });
      }
    } else {
      callback(new Error(
        `Nest not found.`,
        'nest/addrole.js',
        '91'
      ), {
        status: 404,
        data: {
          error: `Nest not found.`
        }
      });
    }
  });
};

module.exports = addRole;
