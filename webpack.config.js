const path = require('path');

module.exports = {
  mode: 'production',
  entry: './dist/src/connectStockfish.js', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'distWebpack'), // Output directory
  },
};