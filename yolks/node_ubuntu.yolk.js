const Yolk = require('./yolk-transpiler.js');

const node_ubuntu = new Yolk(`
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
`,
[
  // No controls
  'none': true
]
);
