'use strict';
const Yolk = require('./yolk_transpiler.js');

const owncloud_ubuntu = new Yolk(`
sudo cd /tmp
sudo wget http://download.opensuse.org/repositories/isv:ownCloud:community/xUbuntu_14.04/Release.key
sudo apt-key add - < Release.key
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/isv:/ownCloud:/community/xUbuntu_14.04/ /' >> /etc/apt/sources.list.d/owncloud.list"
sudo apt-get update -y
sudo apt-get install -y owncloud
`,
`
sudo apt-get remove -y owncloud
`,
{}
);

module.exports = owncloud_ubuntu;
