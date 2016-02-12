/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const request = require('request');

const commandBlacklist = require('../../../config/global.js').commandBlacklist;

/** @function
 * @name exec
 * @param {object} options - Authkey, Address, Command.
 * @param {string} options.authKey - Authkey for the nest.
 * @param {string} options.address - Address of nest to issue command on.
 * @param {string} options.command - Command to issue.
 * @param {string} options.owner - The owner of the nest.
 * @return {promise} promise - Returns new promise
 */
const exec = function(options) {
  return new Promise((resolve, reject) => {
    let issueCommand = () => {
      request.post(`http://${options.address}:3000/exec`, {form: {
        command: options.command,
        authKey: options.authKey
      }}, (err, httpResponse, body) => {
        if (err) {
          reject({
            status: 500,
            error: err
          });
        } else {
          resolve({
            status: 200,
            data: 'Successfully sent command request.'
          });
        }
      });
    };

    // Make sure the command being issued is not blacklisted before sending.
    commandBlacklist.map((item, i) => {
      if (options.command.match(item.regex)) {
        reject({
          error: 403,
          data: `Forbidden command, ${item.reason}`
        });
      } else if (i + 1 === commandBlacklist.length) {
        issueCommand();
      }
    });
  });
};

module.exports = exec;
