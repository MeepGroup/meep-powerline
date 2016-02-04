'use strict';

const {
  addrole, revokerole, registerNest, provision, myNests, viewNest, hawk,
  install, uninstall, unregisterNest
} = require('../modules/');

const meepConfig = require('../../config/meepConfig.js');

const nestHawk = async function(req, res) {
  let options = req.body;

  let response = await hawk(options);
  res.status(response.status).jsonp(response.data);
};

const nestInstall = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await install(options);
  res.status(response.status).jsonp(response.data);
};

const nestUninstall = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await uninstall(options);
  res.status(response.status).jsonp(response.data);
};

const nestAddrole = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let response = await addrole(options);

  res.status(response.status).jsonp(response.data);
};

const nestRevokerole = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await revokerole(options);
  res.status(response.status).jsonp(response.data);
};

const nestRegister = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await registerNest(options);
  res.status(response.status).jsonp(response.data);
};

const nestUnregister = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;

  let response = await unregisterNest(options);
  res.status(response.status).jsonp(response.data);
};

const nestProvision = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  options.meepConfig = meepConfig(req.body.address);

  let response = await provision(options);
  console.log(response);
  res.status(response.status).jsonp(response.data);
};

const nestMyNests = async function(req, res) {
  let options = {
    owner: req.user.local.email
  };

  let response = await myNests(options);
  res.status(response.status).jsonp(response.data);
};

const nestPrey = async function(req, res) {
  let response = await viewNest(req.body);
  res.status(response.status).jsonp(response.data);
};

module.exports = {
  nestAddrole,
  nestRevokerole,
  nestRegister,
  nestUnregister,
  nestProvision,
  nestMyNests,
  nestPrey,
  nestHawk,
  nestInstall,
  nestUninstall
};
