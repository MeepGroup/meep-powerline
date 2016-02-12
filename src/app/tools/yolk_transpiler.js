/* This file is subject to the terms and conditions defined in
   file 'LICENSE.md', which is part of this source code package. */
'use strict';

module.exports = class Yolk {
  constructor(tasks, translations) {
    this.ta = tasks;
    this.tr = translations;
  }

  interpTasks() {
    let taskArray = this.ta.split('\n');
    taskArray.shift();
    taskArray.pop();
    return taskArray;
  }

  transpile(callback) {
    callback(
      this.interpTasks(),
      this.tr
    );
  }
};
