'use strict';
const Yolk = require('./yolk_transpiler.js');

const minecraft_ubuntu = new Yolk(`
sudo apt-get update
sudo apt-get install -y wget
sudo apt-get install -y openjdk-8-jre
mkdir minecraft
cd ./minecraft && wget https://s3.amazonaws.com/Minecraft.Download/versions/1.8.9/minecraft_server.1.8.9.jar
cd ./minecraft && echo 'eula=true' > eula.txt
`,
`
sudo nginx -s stop
sudo apt-get remove -y nginx
`,
{
  'start': false,
  'stop': 'stop',
  'restart': false,
  'instanced': true,
  'instanceName': 'Minecraft-1-8-9'
}
);

module.exports = minecraft_ubuntu;
