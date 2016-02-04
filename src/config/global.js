module.exports = {
  apiAddr: 'http://localhost',
  debug: true,
  yolkDir: '/yolks',
  commandBlacklist: [
    {
      regex: /.*rm .*\w?\//,
      reason: 'rm commands are restricted to prevent damage.'
    }
  ]
};
