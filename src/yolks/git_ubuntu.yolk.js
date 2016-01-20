'use strict';
const Yolk = require('./yolk_transpiler.js');

const git_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y git
`,
{
  noControls: true
}
);
module.exports = git_ubuntu;
