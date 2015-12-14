'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');

var Nest = mongoose.model('Nest');

/** @function
 * @name addRole
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.roleType - The type of role to add user to.
 * @param {string} options.user - The user to add to the role group.
 */
const addRole = function(options, callback) {
  var query = Nest.findOne({'address': options.address});

  query.find(function (err, nests) {
    if (err) return handleError(err);
    if(nests.length) {
      let nest = nests[0];
      if(nest.roles[options.role]) {
        if(options.role === "owner") {
          callback({
            status: 403,
            data: {
              error: "You cannot add more than one owner to a Nest."
            }
          });
        }else {
          if( nest.roles[options.role].indexOf(options.user) > -1 ) {
            callback({
              status: 200,
              data: {
                error: `User ${options.user} already exists in group ${options.role}.`
              }
            });
          }else {
            nest.roles[options.role].push(options.user);
            nest.save(function(err) {
              if(err) console.log(err);
              callback({
                status: 200,
                data: {
                  error: `User ${options.user} added to group ${options.role}.`
                }
              });
            });
          }
        }
      }else {
        callback({
          status: 404,
          data: {
            error: `Role ${options.role} not found.`
          }
        });
      }
    }else {
      callback({
        status: 404,
        data: {
          error: "Nest not found."
        }
      });
    }
  });
};

module.exports = addRole;