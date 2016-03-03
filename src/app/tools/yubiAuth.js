'use strict';
const {YUBIID, YUBISECRET} = require('../../config/yubi');

const YubiKey = require('yubikey');
const yubikey = new YubiKey(YUBIID, YUBISECRET);

const mongoose = require('mongoose');

let User = mongoose.model('User');

module.exports = function(ykey, email, cb, justCheck) {
  let query = User.findOne({'local.email': email});
  query.find(function(err, users) {
    if (err) {
      cb(false);
    }
    if (users.length) {
      let user = users[0];
      if (justCheck) {
        if (user.yubikey) {
          cb(true);
        } else {
          cb(false);
        }
      } else {
        let yid = ykey.substring(0, 12);

        yubikey.verify(ykey, function(err) {
          if (err) {
            cb(false);
          } else {
            if (user.yubikey) {
              if (user.yubikey === yid) {
                cb(yid);
              } else {
                cb(false);
              }
            } else {
              user.yubikey = yid;
              user.save(err => {
                if (err) {
                  cb(false);
                }
                cb(yid);
              });
            }
          }
        });
      }
    } else {
      cb(false);
    }
  });
};
