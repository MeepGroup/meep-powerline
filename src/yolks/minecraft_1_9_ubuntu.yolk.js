'use strict';
const Yolk = require('./yolk_transpiler.js');

const minecraft_1_9_ubuntu = new Yolk(
// Install
`
sudo apt-get update
sudo apt-get install -y wget
sudo apt-get install -y openjdk-8-jre
mkdir minecraft
cd ./minecraft && wget https://s3.amazonaws.com/Minecraft.Download/versions/1.9/minecraft_server.1.9.jar
cd ./minecraft && echo 'eula=true' > eula.txt
`,
// Uninstall
`
sudo killall minecraft
sudo rm -rf ./minecraft
`,
// Translator
{
  'stop': 'stop',
  'instanced': true,
  'instace': {
    'name': 'minecraft',
    'startCommand': 'java',
    'startOptions': ['-jar', 'minecraft_server.1.9.jar', 'nogui'],
    'stopCommand': 'stop',
    'dir': '/root/minecraft'
  }
},
// Backup
`
mkdir -p /backup
tar -czf /backup/minecraft.tar.gz /root/minecraft
`
);

module.exports = minecraft_1_9_ubuntu;
