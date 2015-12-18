'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');

/** @function
 * @name addCredits
 * @param {object} options - Add credits options.
 * @param {string} options.user - user to add credits to.
 * @param {string} options.credits - The amount of credits to add.
 * @param {callback} callback - Returns success or error.
 */

const addCredits = function(options, callback) {

};

module.exports = addCredits;
