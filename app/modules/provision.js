'use strict';

const mongoose = require('mongoose');
const provision = require('meep-provision');
const uuid = require('uuid');

var Nest = mongoose.model('Nest');

/** @function
 * @name registerEgg
 * @param {object} options - Egg options
 * @param {string} options.version - The version of the Egg. Must not already exist.
 * @param {string} options.eggName - The name of the egg.
 * @param {object} options.egg - The egg.
 */
const provisionServer = function(options, callback) {
  var query = Nest.findOne({'address': options.address});

  query.find(function (err, nests) {

    if (err) return handleError(err);
    if(nests.length) {
      let nest = nests[0];
      callback({status: 200, data: {
        success: 'Nest provision has started please check status at /nest/find providing the provision_token',
        provision_token: nest.provision_token
      }});
      nest.busy = true;
      nest.save();
      if(options.force) {// if we are forcing a re provision, re provision.
        provision({
          server: {
            host: options.address,
            port: options.port,
            user: options.user,
            password: options.password
          }
        }, (response) => {
          if (response.success) {
            nest.provisioned = true;
            nest.provisioned_at = Date.now();
            nest.busy = false;
            nest.save(function(err){
              if(err) console.log(err);
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
        callback({status: 500, data: {
          error: `Nest with address ${options.address} has already been provisioned! Use force to override.`
        }});
      }
    }else {
      // provision our server using the specified options. We need to do some
      // logic to make sure all of our required options are provided, if not
      // send a response back telling them it's required.
      let provision_token = uuid.v1();
      var newNest = new Nest({
        address: options.address,
        name: options.name,
        port: options.port,
        user: options.user,
        password: options.password,
        provision_token: provision_token,
        eggs: ['provision'],
        busy: true
      });
      newNest.save((err) => console.log(err));
      callback({status: 200, data: {
        success: 'Nest provision has started please check status at /nest/find providing the provision_token',
        provision_token: provision_token
      }});
      provision({
        server: {
          host: options.address,
          port: options.port,
          user: options.user,
          password: options.password
        }
      }, (response) => {
        if (response.success) {
          newNest.provisioned = true;
          newNest.provisioned_at = Date.now();
          newNest.busy = false;
          newNest.save(function(err){
            if(err) console.log(err);
          });
        }else if(response.error){
          newNest.provision_error = response.error;
          newNest.busy = false;
          newNest.save(function(err){
            if(err) console.log(err);
          });
        }
      });
    }
  });
};

module.exports = provisionServer;
