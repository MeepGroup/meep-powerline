/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

const request = require('request');

const {
  getAuthKey
} = require('../modules/');

const spawn = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  request.post(`http://${options.address}:3000/spawn`, {
    form: options
  }, (err, httpResponse, body) => {
    console.log('got error', err);
    console.log('got response body', body);
    console.log('got response httpResponse', httpResponse);
    if (err) {
      try {
         res.status(500).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    } else {
      try {
         res.status(200).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    }
  });
};

const despawn = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  request.post(`http://${options.address}:3000/despawn`, {
    form: options
  }, (err, httpResponse, body) => {
    if (err) {
      try {
         res.status(500).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    } else {
      try {
         res.status(200).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    }
  });
};

const cycle = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  request.post(`http://${options.address}:3000/cycle`, {
    form: options
  }, (err, httpResponse, body) => {
    if (err) {
      try {
         res.status(500).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    } else {
      try {
         res.status(200).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    }
  });
};

const instance = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  request.post(`http://${options.address}:3000/instance`, {
    form: options
  }, (err, httpResponse, body) => {
    if (err) {
      try {
         res.status(500).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    } else {
      try {
         res.status(200).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    }
  });
};

const instances = async function(req, res) {
  let options = req.body;
  options.owner = req.user.local.email;
  let authKeyData = await getAuthKey({
    address: req.body.address,
    owner: req.user.local.email
  });
  options.authKey = authKeyData.data.authKey;

  request.post(`http://${options.address}:3000/instances`, {
    form: options
  }, (err, httpResponse, body) => {
    if (err) {
      try {
         res.status(500).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    } else {
      try {
         res.status(200).jsonp(JSON.parse(body));
      } catch (e) {
         res.status(500).jsonp(e);
      }
    }
  });
};

module.exports = {
  spawn,
  despawn,
  cycle,
  instance,
  instances
};
