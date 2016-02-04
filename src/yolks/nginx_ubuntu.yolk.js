'use strict';
const Yolk = require('./yolk_transpiler.js');

const nginx_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y nginx
`,
`
sudo nginx -s stop
sudo apt-get remove -y nginx
`,
{
  'start': 'nginx',
  'stop': 'nginx -s stop',
  'restart': 'nginx -s restart'
}
);

module.exports = nginx_ubuntu;
