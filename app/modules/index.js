const registerEgg = require('./registry/registerEgg.js');
const allEggs = require('./registry/allEggs.js');
const findEgg = require('./registry/findEgg.js');
const provision = require('./nest/provision.js');
const viewNest = require('./nest/viewNest.js');
const registerNest = require('./nest/registerNest.js');
const addrole = require('./nest/addrole.js');
const myNests = require('./nest/myNests.js');
const revokerole = require('./nest/revokerole.js');
const addCredits = require('./pay/addCredits.js');

module.exports = {
  registerEgg, allEggs, findEgg, provision, viewNest, registerNest, addrole,
  revokerole, addCredits, myNests
};
