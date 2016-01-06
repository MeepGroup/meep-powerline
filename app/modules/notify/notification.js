'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid');
const Notification = mongoose.model('Notification');
const chalk = require('chalk');

module.exports = class Notify {

  constructor(options) {
    this.uuid = uuid.v1();
    this.seen = (options.seen) ?
      options.seen : false;

    this.message = (options.message) ?
      options.message : 'No notification content.';

    this.createdAt = Date.now();

    this.locked = (options.locked) ?
      options.locked : false;

    // Without this, we're not going to do anything.
    this.assignee = (options.assignee) ?
      options.assignee : false;

    this.from = (options.from) ?
      options.from : 'System';
  }

  delete() {
    const query = Notification.find({ uuid: this.uuid });
    query.findOne((error, noti) => {
      if(error) console.log(chalk.red(error));
      if(noti) {
        noti.seen = true;

        noti.remove((err) => {
          if(err) callback({
            error: err
          });

          callback({
            status: 200,
            success: 'Successfully deleted notification.'
          });
        });

      } else {
        callback({
          status: 404,
          error: 'Notification not found.'
        });
      }
    });
  }

  dispatch(callback) {
    // add this notification to mongo
    let noti = new Notification({
      uuid: this.uuid,
      seen: this.seen,
      message: this.message,
      createdAt: this.createdAt,
      locked: this.locked,
      assignee: this.assignee,
      from: this.from
    });

    noti.save((err) => {
      if(err) callback({
        error: err
      });

      callback({
        status: 200,
        success: 'Successfully dispatched a new notification.'
      });
    });
  }

  markSeen(callback) {
    const query = Notification.find({ uuid: this.uuid });
    query.findOne((error, noti) => {
      if(error) console.log(chalk.red(error));
      if(noti) {
        noti.seen = true;

        noti.save((err) => {
          if(err) callback({
            error: err
          });

          callback({
            status: 200,
            success: 'Successfully marked notification as seeen.'
          });
        });

      } else {
        callback({
          status: 404,
          error: 'Notification not found.'
        });
      }
    });
  }

  togglelocked() {
    const query = Notification.find({ uuid: this.uuid });
    query.findOne((error, noti) => {
      if(error) console.log(chalk.red(error));
      if(noti) {
        noti.locked = !noti.locked;

        noti.save((err) => {
          if(err) callback({
            error: err
          });

          callback({
            status: 200,
            success: `Successfully marked notification locked to ${noti.locked}.`
          });
        });

      } else {
        callback({
          status: 404,
          error: 'Notification not found.'
        });
      }
    });
  }

}
