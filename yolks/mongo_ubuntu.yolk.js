const Yolk = require('./yolk-transpiler.js');

const git_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y mongodb mongodb-server
`,
[
  'start': 'sudo service mongod start',
  'stop': 'sudo service mongod stop',
  'restart': 'sudo service mongod restart'
]
);
