'use strict';

const Notify = require('../modules/notify/notification.js');

const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
const chalk = require('chalk');

const notifyNewNotification = function(req, res) {
  let noti = new Notify({
    message: req.body.message,
    assignee: req.user.local.email
  });

  noti.dispatch((err, data) => {
    if (err) {
      console.warn(err);
    }
    res.status(data.status).jsonp(data);
  });
};

const deleteNotification = function(req, res) {
  const query = Notification.find({uuid: req.body.uuid});
  query.findOne((err, noti) => {
    if (err) {
      console.warn(err);
    }
    if (noti) {
      if (req.user.local.email) {
        noti.remove(err => {
          if (err) {
            req.statu(500).jsonp({
              error: err
            });
          }

          res.status(200).jsonp({
            status: 200,
            success: 'Successfully deleted notification.'
          });
        });
      } else {
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
  const query = Notification.find({
    assignee: req.user.local.email
  });
  query.find((err, notifications) => {
    if (err) {
      console.warn(err);
    }
    if (notifications && notifications.length) {
      res.status(200).jsonp(notifications);
    } else {
      res.status(404).jsonp({
        status: 404,
        error: 'You\'ve got no notifications'
      });
    }
  });
};

const toggleLocked = function(req, res) {
  const query = Notification.find({uuid: req.body.uuid});
  query.findOne((error, noti) => {
    if (error) {
      console.log(chalk.red(error));
    }
    if (noti) {
      if (req.user.local.email) {
        noti.locked = !noti.locked;
        noti.save(err => {
          if (err) {
            res.status(500).jsonp({
              error: err
            });
          }

          res.status(200).jsonp({
            status: 200,
            success: `Successfully changed notification locked status to
            ${noti.locked}.`
          });
        });
      } else {
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
  const query = Notification.find({uuid: req.body.uuid});
  query.findOne((err, noti) => {
    if (err) {
      console.warn(err);
    }
    if (noti) {
      if (req.user.local.email) {
        noti.seen = true;
        noti.save(err => {
          if (err) {
            res.status(500).jsonp({
              error: err
            });
          }

          res.status(200).jsonp({
            status: 200,
            success: 'Successfully marked notification as seen.'
          });
        });
      } else {
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
  deleteNotification,
  getMyNotifications
};
