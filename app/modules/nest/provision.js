'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');
const uuid = require('uuid');

const Notify = require('../notify').Notify;

let Nest = mongoose.model('Nest');

/** @function
 * @name provisionServer
 * @param {object} options - options
 * @param {object} options.server - Server address to provision.
 * @param {object} options.owner - Owner of the server.
 */
const provisionServer = function(options, callback) {
  let query = Nest.findOne({'address': options.address});
  let authKey = uuid.v4();

  query.find(function (err, nests) {

    if (err) return handleError(err);
    if(nests.length) {
      let nest = nests[0];
      if(nest.roles.owner === options.owner) {
        callback({status: 200, data: {
          success:`Nest provision has started please check status at /nest/find
            providing the provision_token `,
          provision_token: nest.provision_token
        }});
        nest.busy = true;
        nest.save();

        provision({
          server: {
            host: nest.address,
            port: nest.port,
            user: nest.user,
            password: nest.password
          },
          authKey: authKey
        }, (response) => {
          if (response.success) {
            nest.authKey = authKey;
            nest.provisioned = true;
            nest.provisioned_at = Date.now();
            nest.busy = false;
            nest.save(function(err){
              if(err) console.log(err);
            });

            let noti = new Notify({
              message: `${nest.address} has finished the provisioning task and is ready for use.`,
              assignee: nest.owner
            });
            noti.dispatch((data) => {
              console.log(data);
            });
          }else if(response.error){
            nest.provision_error = response.error;
            nest.busy = false;

            nest.save(function(err){
              if(err) console.log(err);
            });
          }
        });
      }else {
        callback({
          status: 403,
          data: {
            error: `You do not own this nest!`
          }
        });
      }
    }else {
      callback({
        status: 404,
        data: {
          error: `Nest with address ${options.address} not found!`
        }
      });
    }
  });
};

module.exports = provisionServer;
