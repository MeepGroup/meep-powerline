'use strict';

const request = require('request');

/** @function
 * @name exec
 * @param {object} options - Authkey, Address, Command.
 * @param {string} options.authKey - The owner of the server.
 * @param {string} options.address - The owner of the server.
 * @param {string} options.command - The owner of the server.
 * @return {promise} promise - Returns new promise
 */
const exec = function(options) {
  return new Promise((resolve, reject) => {
    request.post(`asdfasdfsadf`, {}, (data) => {
      resolve();
    });
    // hit the api
  });
};

module.exports = exec;
