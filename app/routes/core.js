'use strict';

const request = require('request');
const chalk = require('chalk');

const {
  cmdShimPort, apiAddr, debug
} = require('../../config/global.js')

const status = function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /status`));

  request.get(`${apiAddr}:3000/status`,
  (err, httpResponse, hawkBody) => {
    request.get(`${apiAddr}/rooster/status`,
    (err, httpResponse, roosterBody) => {
      res.status(200).jsonp({
        hawk: JSON.parse(hawkBody),
        rooster: JSON.parse(roosterBody)
      });
    });
  });
};

const config = function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /config`));

  request(`${apiAddr}:3001`,
  function (error, response, body) {
    if(error){
      res.status(500).jsonp(error);
    }else{
      res.jsonp(JSON.parse(body));
    }
  });
};

const prey = function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /prey/${req.params.address}`));

  request(`${apiAddr}:3000/prey/${req.params.address}`,
  function (error, response, body) {
    if(error){
      res.status(500).jsonp(error);
    }else{
      res.jsonp(JSON.parse(body));
    }
  });
};

const trust = function(req, res) {
  if(debug) console.log(chalk.blue(`[${Date.now()}] /trust/${req.params.address}`));

  request(`${apiAddr}:3001/trust/${req.params.address}`,
  function (error, response, body) {
    if(error){
      res.status(500).jsonp(error);
    }else{
      if(debug)
        console.log(chalk.blue(`New address trusted: ${req.params.address}`));
      res.jsonp(body);
    }
  });
};

module.exports = {
  status,
  config,
  prey,
  trust
};
