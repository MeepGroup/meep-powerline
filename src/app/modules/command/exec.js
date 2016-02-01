'use strict';

const request = require('request');
const getAuthKey = require('./getAuthKey');

/** @function
 * @name exec
 * @param {object} options - Authkey, Address, Command.
 * @param {string} options.authKey - Authkey for the nest.
 * @param {string} options.address - Address of nest to issue command on.
 * @param {string} options.command - Command to issue.
 * @param {string} options.owner - The owner of the nest.
 * @return {promise} promise - Returns new promise
 */
const exec = async function(options) {
  let authKey = await getAuthKey({
    address: options.address,
    owner: options.owner
  });

  return new Promise((resolve, reject) => {
    request.post(`http://${options.address}:3000/exec`, {
      command: options.command,
      authKey: authKey
    }, (err, httpResponse, body) => {
      if (err) {
        reject({
          status: 500,
          error: err
        });
      } else {
        resolve({
          status: 200,
          data: body
        });
      }
    });
  });
};

module.exports = exec;
