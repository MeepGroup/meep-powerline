const Yolk = require('./yolk-transpiler.js');

const git_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y git
`,
[
  // No controls
  'none': true
]
);
