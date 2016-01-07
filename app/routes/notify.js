'use strict';

const Notify = require('../modules');

const mongoose = require('mongoose');
const uuid = require('uuid');
const Notification = mongoose.model('Notification');
const chalk = require('chalk');

const notifyNewNotification = function(req, res) {
  let noti = new Notify({
    message: req.body.message,
    assignee: req.user.local.email
  });

  noti.dispatch((data) => {
    res.status(data.status).jsonp(data);
  });
};

const deleteNotification = function(req, res) {
  const query = Notification.find({ uuid: req.body.uuid });
  query.findOne((error, noti) => {
    if(error) console.log(chalk.red(error));
    if(noti) {
      if(req.user.local.email) {
        noti.remove((err) => {
          if(err) callback({
            error: err
          });

          res.status(200).jsonp({
            status: 200,
            success: 'Successfully deleted notification.'
          });
        });
      }else {
        res.status(401).jsonp({
          status: 401,
          error: 'Unautorized to modify this notification.'
        });
      }
    } else {
      res.status(404).jsonp({
        status: 404,
        error: 'Notification not found.'
      });
    }
  });
};

const toggleLocked = function(req, res) {
  const query = Notification.find({ uuid: req.body.uuid });
  query.findOne((error, noti) => {
    if(error) console.log(chalk.red(error));
    if(noti) {
      if(req.user.local.email) {
        noti.locked = !noti.locked;
        noti.save((err) => {
          if(err) callback({
            error: err
          });

          res.status(200).jsonp({
            status: 200,
            success: `Successfully changed notification locked status to ${noti.locked}.`
          });
        });
      }else {
        res.status(401).jsonp({
          status: 401,
          error: 'Unautorized to modify this notification.'
        });
      }
    } else {
      res.status(404).jsonp({
        status: 404,
        error: 'Notification not found.'
      });
    }
  });
};

const getMyNotifications = function(req, res) {
  const query = Notification.find({ uuid: req.body.uuid });
  query.findOne((error, noti) => {
    if(error) console.log(chalk.red(error));
    if(noti) {
      if(req.user.local.email) {
        noti.seen = true;
        noti.save((err) => {
          if(err) callback({
            error: err
          });

          res.status(200).jsonp({
            status: 200,
            success: 'Successfully marked notification as seen.'
          });
        });
      }else {
        res.status(401).jsonp({
          status: 401,
          error: 'Unautorized to modify this notification.'
        });
      }
    } else {
      res.status(404).jsonp({
        status: 404,
        error: 'Notification not found.'
      });
    }
  });
};

const markSeen = function(req, res) {
  const query = Notification.find({ uuid: req.body.uuid });
  query.findOne((error, noti) => {
    if(error) console.log(chalk.red(error));
    if(noti) {
      if(req.user.local.email) {
        noti.seen = true;
        noti.save((err) => {
          if(err) callback({
            error: err
          });

          res.status(200).jsonp({
            status: 200,
            success: 'Successfully marked notification as seen.'
          });
        });
      }else {
        res.status(401).jsonp({
          status: 401,
          error: 'Unautorized to modify this notification.'
        });
      }
    } else {
      res.status(404).jsonp({
        status: 404,
        error: 'Notification not found.'
      });
    }
  });
};

module.exports = {
  notifyNewNotification,
  markSeen,
  toggleLocked,
  deleteNotification
}
