module.exports = function(address) {
  return `
  module.exports = {
    meepDir: '~/.meep',
    master: false,
    hawk: {
      masterAddr: 'https://api.gomeep.com',
      myAddress: '${address}'
    }
  };
  `;
};
