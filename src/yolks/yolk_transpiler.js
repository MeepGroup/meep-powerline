'use strict';

module.exports = class Yolk {
  constructor(tasks, uninstall, translations) {
    this.ta = tasks;
    this.un = uninstall;
    this.tr = translations;
  }

  interpTasks(type) {
    let taskArray = this[type].split('\n');
    taskArray.shift();
    taskArray.pop();
    return taskArray;
  }

  transpile(callback) {
    callback(
      this.interpTasks(ta),
      this.tr,
      this.interpTasks(un)
    );
  }
};
