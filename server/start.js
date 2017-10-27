require('babel-core/register')({
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current'
        },
        useBuiltIns: true,
        modules: 'commonjs',
        loose: true,
        debug: false
      }
    ]
  ]
});
require('babel-polyfill');

module.exports = require('./index.js');
