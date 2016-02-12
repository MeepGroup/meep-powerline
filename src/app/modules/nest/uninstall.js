/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const mongoose = require('mongoose');
const EggFile = require('meep-egg');
const Notify = require('../notify').Notify;
const _ = require('lodash');

const Yolk = mongoose.model('Yolk');
const Nest = mongoose.model('Nest');

/** @function
 * @name install
 * @param {object} options - Query options (name / version)
 * @return {promise} promise - Returns new promise.
 */
const uninstall = function(options) {
  return new Promise((resolve, reject) => {
    if (options.name && options.version) {
      let query = Yolk.findOne({name: options.name, version: options.version});
      query.find(function(err, yolks) {
        if (err) {
          reject(new Error(
            'Unknown Mongoose issue.',
            'nest/addrole.js',
            '20'
          ));
        }
        if (yolks.length) {
          let yolk = yolks[0];
          let query = Nest.findOne({address: options.address});
          query.find(function(err, nests) {
            if (err) {
              reject(new Error(
                'Unknown Mongoose issue.',
                'nest/addrole.js',
                '20'
              ));
            } else {
              if (nests.length) {
                let nest = nests[0];
                // Check if nest yolks contain the name of this module anywhere
                if (nest.roles.owner === options.owner) {
                  let yolkModule = require(
                    `../../../yolks/${yolk.module}.yolk.js`
                  );
                  resolve({
                    status: 200,
                    data: {
                      success: 'Egg uninstall has started.'
                    }
                  });

                  yolkModule.transpile((tasks, commands, uninstall) => {
                    let tickCount = 0;

                    nest.busy = true;
                    nest.save();

                    nest.progress = [0, tasks.length];
                    nest.save();

                    nest.eggs = _.filter(nest.eggs, function(item) {
                      return item.name !== yolk.name;
                    });

                    new EggFile({
                      server: {
                        host: nest.address,
                        user: nest.user,
                        password: nest.password,
                        port: nest.port
                      },
                      tasks: uninstall,
                      test: true,
                      tickCallback: (tick, total) => {
                        tickCount += tick;
                        // record the progress of the task for UI progress bar.
                        nest.progress = [tickCount, total];
                        nest.save();
                      }
                    }).hatch()
                      .expect('node -v')
                      .match(new RegExp(/.*/), () => {
                        nest.busy = false;
                        nest.save();

                        let noti = new Notify({
                          message:
`${nest.address} has finished uninstalling ${yolk.name}.`,
                          assignee: nest.owner
                        });

                        noti.dispatch(() => {});
                      });
                  });
                } else {
                  resolve({
                    status: 500,
                    data: {
                      error: 'You do not own this nest.'
                    }
                  });
                }
              } else {
                resolve({
                  status: 404,
                  data: {
                    error: 'Nest not found.'
                  }
                });
              }
            }
          });
        } else {
          resolve({
            status: 404,
            data: {
              error: 'Yolk not found.'
            }
          });
        }
      });
    } else {
      resolve({
        status: 400,
        data: {
          error: 'Missing one or more required options.'
        }
      });
    }
  });
};

module.exports = uninstall;
