'use strict';

const mongoose = require('mongoose');
const EggFile = require('meep-egg');

const Nest = mongoose.model('Nest');
const Egg = mongoose.model('Egg');

const Notify = require('../notify').Notify;

/** @function
 * @name install
 * @param {object} options - Server information
 * @param {string} options.address - The address of the server.
 * @param {string} options.owner - The owner of the server.
 * @param {string} options.eggName - The egg name of the egg.
 * @param {string} options.version - The version of the egg to be installed.
 */

const install = function(options, callback) {
  const query = Nest.findOne({address: options.address});

  query.find(function(err, nests) {
    if (err) {
      callback(new Error(
        'Unknown Mongoose issue.',
        'egg/install.js',
        '25'
      ), {});
    }
    if (nests.length) {
      const nest = nests[0];

      if (options.email === nest.roles.owner) {
        let query = Egg.findOne({
          name: options.eggName,
          version: options.version
        });
        query.find(function(err, eggs) {
          if (err) {
            callback(new Error(
              'Unknown Mongoose issue.',
              'egg/install.js',
              '42'
            ), {});
          }
          if (eggs.length) {
            let egg = eggs[0];
            let tickCount = 0;

            nest.busy = true;
            nest.save();

            nest.progress = [0, JSON.parse(egg.egg).tasks.length];
            nest.save();

            new EggFile({
              server: {
                host: nest.address,
                user: nest.user,
                password: nest.password,
                port: nest.port
              },
              tasks: JSON.parse(egg.egg).tasks,
              test: true,
              tickCallback: (tick, total) => {
                tickCount += tick;
                // record the progress of the task for UI progress bar.
                nest.progress = [tickCount, total];
                nest.save();
              }
            }).hatch().expect('node -v').match(new RegExp(/v4\..*\..*/),
            res => {
              if (typeof (res)) {
                nest.busy = false;
                nest.save();

                let noti = new Notify({
                  message: `${nest.address} has finished the installing ${options.eggName}, and is ready for use.`,
                  assignee: nest.owner
                });

                noti.dispatch(data => {
                  console.log(data);
                });
              }
            });

            callback(false, {
              status: 200,
              data: {
                success: 'Egg hatching has started.'
              }
            });
          } else {
            callback(new Error(
              'Egg not found',
              'egg/install.js',
              '96'
            ), {
              status: 404,
              data: {
                error: 'Egg not found.'
              }
            });
          }
        });
      }
    } else {
      callback(new Error(
        'Nest not found.',
        'egg/install.js',
        '110'
      ), {
        status: 404,
        data: {
          error: 'Nest not found.'
        }
      });
    }
  });
};

module.exports = install;