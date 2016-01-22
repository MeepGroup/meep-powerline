'use strict';

const mongoose = require('mongoose');
const EggFile = require('meep-egg');
const Notify = require('../notify').Notify;

const Yolk = mongoose.model('Yolk');
const Nest = mongoose.model('Nest');

/** @function
 * @name install
 * @param {object} options - Query options (name / version)
 * @return {promise} promise - Returns new promise.
 */
const install = function(options) {
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
                let dedupe = nest.eggs.filter(existingYolk => {
                  if (existingYolk.name === yolk.name) {
                    return existingYolk;
                  }
                });

                if (dedupe.length > 0) {
                  resolve({
                    status: 409,
                    data: {
                      success: 'Egg already installed.'
                    }
                  });
                } else {
                  if (nest.roles.owner === options.owner) {
                    let yolkModule = require(`../../../yolks/${yolk.module}.yolk.js`);
                    yolkModule.transpile((tasks, translator) => {
                      let tickCount = 0;

                      nest.busy = true;
                      nest.save();

                      nest.progress = [0, tasks.length];
                      nest.save();

                      nest.eggs.push(yolk);

                      new EggFile({
                        server: {
                          host: nest.address,
                          user: nest.user,
                          password: nest.password,
                          port: nest.port
                        },
                        tasks: tasks,
                        test: true,
                        tickCallback: (tick, total) => {
                          tickCount += tick;
                          // record the progress of the task for UI progress bar.
                          nest.progress = [tickCount, total];
                          nest.save();
                        }
                      }).hatch().expect('node -v').match(new RegExp(/.*/), () => {
                        nest.busy = false;
                        nest.save();

                        let noti = new Notify({
                          message: `${nest.address} has finished the installing ${yolk.name}, and is ready for use.`,
                          assignee: nest.owner
                        });

                        noti.dispatch(() => {});
                      });

                      resolve({
                        status: 200,
                        data: {
                          success: 'Egg hatching has started.'
                        }
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

module.exports = install;
