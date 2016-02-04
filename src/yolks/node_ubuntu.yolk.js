'use strict';
const Yolk = require('./yolk_transpiler.js');

const node_ubuntu = new Yolk(`
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
`,
`
sudo apt-get remove -y nodejs
`,
{
  noControls: true
}
);

module.exports = node_ubuntu;
