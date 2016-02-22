'use strict';
const Yolk = require('./yolk_transpiler.js');

const minecraft_ubuntu = new Yolk(
// Install
`
sudo apt-get update
sudo apt-get install -y wget
sudo apt-get install -y openjdk-8-jre
mkdir minecraft
cd ./minecraft && wget https://s3.amazonaws.com/Minecraft.Download/versions/1.8.9/minecraft_server.1.8.9.jar
cd ./minecraft && echo 'eula=true' > eula.txt
`,
// Uninstall
`
sudo killall minecraft
sudo rm -rf ./minecraft
`,
// Translator
{
  'start': false,
  'stop': 'stop',
  'restart': false,
  'instanced': true,
  'instanceName': 'Minecraft-1-8-9'
},
// Backup
`
mkdir -p /backup
tar -czf /backup/minecraft.tar.gz /root/minecraft
`
);

module.exports = minecraft_ubuntu;
