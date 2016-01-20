'use strict';
const Yolk = require('./yolk_transpiler.js');

const mongo_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y mongodb mongodb-server
`,
{
  'start': 'sudo service mongod start',
  'stop': 'sudo service mongod stop',
  'restart': 'sudo service mongod restart'
}
);
module.exports = mongo_ubuntu;
