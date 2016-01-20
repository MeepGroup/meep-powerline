'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');
const uuid = require('uuid');
const request = require('request');
const chalk = require('chalk');

const Notify = require('../notify').Notify;

const {
 apiAddr, debug
} = require('../../../config/global.js');

let Nest = mongoose.model('Nest');

/** @function
 * @name provisionServer
 * @param {object} options - options
 * @param {object} options.server - Server address to provision.
 * @param {object} options.owner - Owner of the server.
 * @param {function} callback - Err, response
 */
const provisionServer = function(options) {
  return new Promise((resolve, reject) => {
    let query = Nest.findOne({address: options.address});
    let authKey = uuid.v4();

    query.find(function(err, nests) {
      if (err) {
        reject(new Error(
          'Unknown Mongoose issue.',
          'nest/provision.js',
          '22'
        ));
      }

      if (nests.length) {
        let nest = nests[0];
        if (nest.roles.owner === options.owner) {
          resolve({status: 200, data: {
            success: `Nest provision has started please check status at /nest/find
              providing the provision_token `,
            provisionToken: nest.provision_token
          }});

          let tickCount = 0;

          nest.progress = [0, 11];

          nest.busy = true;
          nest.save();

          provision({
            meepConfig: options.meepConfig,
            server: {
              host: nest.address,
              port: nest.port,
              user: nest.user,
              password: nest.password
            },
            authKey: authKey,
            tickCallback: (tick, total) => {
              tickCount += tick;
              // record the progress of the task for UI progress bar.
              nest.progress = [tickCount, total];
              nest.save();
            }
          }, response => {
            if (response.success) {
              nest.authKey = authKey;
              nest.provisioned = true;
              nest.provisionedAt = Date.now();
              nest.busy = false;
              nest.save(function(err) {
                if (err) {
                  console.log(err);
                }
              });

              let noti = new Notify({
                message: `${nest.address} has finished the provisioning task and is ready for use.`,
                assignee: nest.roles.owner
              });
              noti.dispatch(data => {
                console.log(data);
              });
            } else if (response.error) {
              nest.provisionError = response.error;
              nest.busy = false;

              nest.save(function(err) {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
        } else {
          resolve({
            status: 403,
            data: {
              error: `You do not own this nest!`
            }
          });
        }
      } else {
        resolve({
          status: 404,
          data: {
            error: `Nest with address ${options.address} not found!`
          }
        });
      }
    });
  });
};

module.exports = provisionServer;
